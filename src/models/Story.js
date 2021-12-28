/* eslint-disable class-methods-use-this */
import fs from 'react-native-fs';
import { nanoid } from 'nanoid/non-secure';

import Perf from '../utils/Perf.js';
import { insertStoryTo } from './Story.util.js';

const SL_DIR = `${fs.CachesDirectoryPath}/story`;
const SL_DIR_HTML = `${SL_DIR}/html`;
const SL_IDS = 'ids';
const ZERO = `${SL_DIR}/0`;

const MAX = 100;
const ID_LENGTH = 16;
const DESC_LENGTH = 200;
// Delete html tags: <h1>,</h1>,<img/>
const REG_HTMLTAG = /(<\w+.*?\/?>|<\/\w+>)/gm;
const DEFAULT_READ = 0;

class StoryList {
    constructor() {
        this.data = [];
        this.initialized = false;
        this._ids = {};
        this._cacheQueue = [];
        this._cacheWriting = false;
    }

    async init() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        Perf.start();
        try {
            const files = [ZERO, `${SL_DIR}/${SL_IDS}`];
            const readTasks = files.map((f) => fs.readFile(f));
            const results = await Promise.all(readTasks);
            const [rawData, rawIds] = results;

            this.data = JSON.parse(rawData);
            this._ids = JSON.parse(rawIds);
        } catch (e) {
            // await fs.mkdir(SL_DIR);
            await fs.mkdir(SL_DIR_HTML);
        }
        Perf.info('StoryList initialized');
    }

    async append(list, rss) {
        await this.init();
        if (list.length === 0) {
            return;
        }
        const pid = rss.id;
        if (!this._ids[pid]) {
            this._ids[pid] = {
                latest: [],
                count: 0,
            };
        }
        const { latest } = this._ids[pid];
        const sortData = list.sort((a, b) => new Date(b) - new Date(a));
        const newStories = [];
        for (let i = sortData.length - 1; i >= 0; i--) {
            const item = sortData[i];

            // Skip the exsiting story
            if (latest.indexOf(item.title) < 0) {
                const { desc, description, date } = item;
                const id = nanoid(ID_LENGTH);
                const summary = desc
                    || description
                        // Reduce the string
                        .substr(0, DESC_LENGTH * 2)
                        .replace(REG_HTMLTAG, '')
                        .substr(0, DESC_LENGTH);
                const ts = new Date(date).getTime();
                const storyItem = {
                    ...item,
                    id,
                    pid,
                    desc: summary,
                    date: ts, // convert date string to timestamp
                    read: DEFAULT_READ,
                };
                // Remove the large description
                delete storyItem.description;
                if (storyItem.link instanceof Array) {
                    storyItem.link = storyItem.link[0];
                }
                newStories[i] = storyItem;
                this._cacheQueue.push(createWriteTask(`${SL_DIR}/${ts}${id}`, storyItem));
                this._cacheQueue.push(createWriteTask(`${SL_DIR_HTML}/${id}.html`, description));
            }
        }
        if (newStories.length > 0) {
            this._ids[pid].latest = sortData.map((item) => item.title);
            this._ids[pid].count += newStories.length;
            this.data = insertStoryTo(newStories, this.data);
            this._cacheQueue.push(createWriteTask(`${SL_DIR}/${SL_IDS}`, this._ids));
            this._cacheQueue.push(createWriteTask(ZERO, this.data.slice(0, MAX)));
            this.mkCache();
        }
    }

    update(id, data = {}) {
        const index = this.data.findIndex((v) => v.id === id);
        if (index > -1) {
            const updateData = { ...this.data[index], ...data };
            this.data[index] = updateData;
            this._cacheQueue.push(createWriteTask(`${SL_DIR}/${updateData.date}${id}`, updateData));
            if (index < MAX) {
                this._cacheQueue.push(createWriteTask(ZERO, this.data.slice(0, MAX)));
            }
            this.mkCache();
        }
    }

    async load(nextId, size = MAX) {
        const LEN = 13; // timestamp length
        const LEN_NAME = LEN + ID_LENGTH;
        const files = await fs.readdir(SL_DIR);
        const sortFiles = files.sort((a, b) => b.substr(0, LEN) - a.substr(0, LEN));
        let start = false;
        const readFiles = [];

        for (let i = 0, len = sortFiles.length; i < len; i++) {
            const file = sortFiles[i];
            if (start && file.length === LEN_NAME && readFiles.length < size) {
                readFiles.push(file);
            }
            if (!start && file.substring(LEN) === nextId) {
                start = true;
            }
        }
        const self = this;
        Perf.start();
        await read(0);

        async function read(i) {
            if (i === readFiles.length) {
                Perf.info('StoryList loaded');
                return;
            }
            try {
                const content = await fs.readFile(`${SL_DIR}/${readFiles[i]}`);
                const story = JSON.parse(content);
                self.data.push(story);
            } catch (e) {
                Perf.error(e);
            }
            await read(i + 1);
        }
    }

    mkCache() {
        if (this._cacheWriting) {
            // Cache is writing, new tasks in queue will also be executed
            return;
        }
        Perf.start();
        this._cacheWriting = true;
        const self = this;
        runTasks();

        // Don't use for-await, it will block JS thread
        async function runTasks() {
            const currTask = self._cacheQueue.shift();
            if (!currTask) {
                Perf.info('Story cache written');
                // Done
                self._cacheWriting = false;
                return;
            }
            const { type, path, data } = currTask;
            if (type === 'write') {
                const duplicateIndex = self._cacheQueue.findIndex((v) => v.path === path);
                // Skip the duplicate task
                // Make sure just write once to disk in _cacheQueue
                if (duplicateIndex < 0) {
                    let content = data;
                    if (typeof content === 'object') {
                        content = JSON.stringify(content);
                    }
                    await fs.writeFile(path, content).catch((e) => {
                        // Write failed
                        Perf.error(e);
                    });
                }
            }
            await runTasks();
        }
    }

    static async existCache() {
        return fs.exists(SL_DIR);
    }

    async diskUsage() {
        let bytes = 0;

        try {
            const dirs = await fs.readDir(SL_DIR);
            const htmlDirs = await fs.readDir(SL_DIR_HTML);
            for (const file of dirs) {
                if (file.path === SL_DIR_HTML) {
                    // Duplicate
                    continue;
                }
                bytes += file.size;
            }
            for (const html of htmlDirs) {
                bytes += html.size;
            }
        } catch (e) { /**/ }

        return { bytes };
    }

    async clearDisk() {
        await fs.unlink(SL_DIR);
        // Re-create dir for pending tasks in _cacheQueue
        await fs.mkdir(SL_DIR_HTML);
    }
}

function createWriteTask(path, data) {
    return {
        type: 'write',
        path,
        data,
    };
}

export default new StoryList();
