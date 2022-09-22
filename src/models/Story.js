/* eslint-disable class-methods-use-this */
import fs from 'react-native-fs';
import { nanoid } from 'nanoid/non-secure';

import Perf from '../utils/Perf.js';
import { insertStoryTo } from './Story.util.js';
import $ev from '../utils/Event.js';

const SL_DIR = `${fs.CachesDirectoryPath}/story`;
const SL_DIR_JSOND = `${SL_DIR}/jsond`;
const SL_DIR_HTML = `${SL_DIR}/html`;
const SL_IDS = `${SL_DIR}/ids`;
const ZERO = `${SL_DIR}/0`;

const MAX = 100;
const ID_LENGTH = 16;
const DESC_LENGTH = 200;
// Delete html tags: <h1>,</h1>,<img/>
const REG_HTMLTAG = /(<\w+.*?\/?>|<\/\w+>|<\w*\s*$)/gm;
const EXTRA_DEFAULTS = {
    read: 0,
};

class StoryList {
    constructor() {
        this.data = [];
        this.initialized = false;
        this.more = true;
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
            const files = [ZERO, SL_IDS];
            const readTasks = files.map((f) => fs.readFile(f));
            const results = await Promise.all(readTasks);
            const [rawData, rawIds] = results;

            this.data = JSON.parse(rawData);
            this._ids = JSON.parse(rawIds);
            this.more = this.data.length >= MAX;
        } catch (e) {
            // await fs.mkdir(SL_DIR);
            await fs.mkdir(SL_DIR_HTML);
            await fs.mkdir(SL_DIR_JSOND);
        }
        Perf.info('StoryList initialized');
    }

    /**
     * Add to story list
     *
     * @param {array} list stories
     * @param {object} rss parent rss source
     * @param {Date} mtime
     */
    async append(list, rss, mtime) {
        await this.init();
        if (list.length === 0) {
            return;
        }
        const pid = rss.id;
        if (!this._ids[pid]) {
            this._ids[pid] = {
                latest: [],
                list: [],
            };
        }
        const { latest } = this._ids[pid];
        // Only the stories which has title and description will be saved
        const usedList = list.filter((v) => v && v.title && v.description);
        const newStories = [];
        const sameDates = {};
        for (let i = usedList.length - 1; i >= 0; i--) {
            const item = usedList[i];

            // Skip the exsiting story
            if (latest.indexOf(item.title) < 0) {
                const { desc, description, date } = item;
                const id = nanoid(ID_LENGTH);
                const summary = desc
                    || description
                        // Reduce the string
                        .substr(0, DESC_LENGTH * 2)
                        .replace(REG_HTMLTAG, '')
                        .substr(0, DESC_LENGTH)
                        // Limited entity support
                        .replace('&quot;', '"')
                        .replace('&nbsp;', ' ');
                // If date is undefined, set it as the time of added
                let ts = new Date(date).getTime() || mtime?.getTime() || (Date.now() - i);
                // Some rss sources publish a series of stories which has the same date.
                // It will affect load more, because this feature is based on the date,
                // same date will cause duplicate story in list.
                if (ts in sameDates) {
                    sameDates[ts] += 1;
                    ts += sameDates[ts];
                } else {
                    sameDates[ts] = 0;
                }
                const storyItem = {
                    ...item,
                    id,
                    pid,
                    desc: summary,
                    date: ts, // convert date string to timestamp
                    ...EXTRA_DEFAULTS,
                };
                // Remove the large description
                delete storyItem.description;
                if (storyItem.link instanceof Array) {
                    storyItem.link = storyItem.link[0];
                }
                newStories.push(storyItem);
                this._ids[pid].list.push(id);
                this._cacheQueue.push(createWriteTask(`${SL_DIR_JSOND}/${ts}${id}`, storyItem));
                this._cacheQueue.push(createWriteTask(`${SL_DIR_HTML}/${id}.html`, description));
            }
        }
        if (newStories.length > 0) {
            this._ids[pid].latest = usedList.map((item) => item.title);
            const sortStories = newStories.sort((a, b) => b.date - a.date);
            let insertedData = insertStoryTo(sortStories, this.data);
            const lastItem = this.data[this.data.length - 1];
            if (lastItem) {
                // Appended stories which older than the last one in list will break
                // StoryList load more. Remove them.
                const lastIdx = insertedData.findIndex((v) => v.id === lastItem.id);
                if (lastIdx > -1) {
                    insertedData = insertedData.slice(0, lastIdx + 1);
                }
            }
            this.data = insertedData;
            this._cacheQueue.push(createWriteTask(SL_IDS, this._ids));
            this._cacheQueue.push(createWriteTask(ZERO, this.data.slice(0, MAX)));
            this.mkCache();
            $ev.emit('storychange');
        }
    }

    /**
     * Update story list on local
     *
     * @param {string} id
     * @param {object} data
     */
    update(id, data = {}) {
        const index = this.data.findIndex((v) => v.id === id);
        if (index > -1) {
            const updateData = { ...this.data[index], ...data };
            this.data[index] = updateData;
            this._cacheQueue.push(createWriteTask(`${SL_DIR_JSOND}/${updateData.date}${id}`, updateData));
            if (index < MAX) {
                this._cacheQueue.push(createWriteTask(ZERO, this.data.slice(0, MAX)));
            }
            this.mkCache();
        }
    }

    /**
     * Also see `models/RSS#delete()`
     *
     * @param {string} pid parent rss id
     */
    async delete(pid) {
        this.data = this.data.filter((v) => v.pid !== pid);
        const deleteItem = this._ids[pid];
        delete this._ids[pid];
        this._cacheQueue.push(createWriteTask(SL_IDS, this._ids));
        this._cacheQueue.push(createWriteTask(ZERO, this.data.slice(0, MAX)));
        this.mkCache();
        $ev.emit('storychange');
        if (deleteItem) {
            const ids = deleteItem.list;
            const dirs = await fs.readDir(SL_DIR_JSOND);
            for (const file of dirs) {
                const id = file.name.substring(13); // 13 is timestamp length
                if (ids.indexOf(id) > -1) {
                    fs.unlink(file.path).catch(Perf.error);
                }
            }
        }
    }

    /**
     * Load a part of stories
     *
     * @param {string} nextId
     * @param {number} size
     */
    async load(nextId, size = MAX) {
        if (!this.more) return;

        Perf.start();
        const LEN = 13; // timestamp length
        const LEN_NAME = LEN + ID_LENGTH;
        const files = await fs.readdir(SL_DIR_JSOND);
        const sortFiles = files.sort((a, b) => b.substr(0, LEN) - a.substr(0, LEN));
        let start = false;
        const readFiles = [];

        for (let i = 0, len = sortFiles.length; i < len; i++) {
            const file = sortFiles[i];
            if (start && readFiles.length < size) {
                readFiles.push(file);
            } else if (!start && file.substring(LEN) === nextId) {
                start = true;
            }
        }
        // No more
        if (readFiles.length < size) {
            this.more = false;
        }
        const self = this;
        await read(0);

        async function read(i) {
            if (i >= readFiles.length) {
                Perf.info('StoryList load more');
                return;
            }
            try {
                const content = await fs.readFile(`${SL_DIR_JSOND}/${readFiles[i]}`);
                const story = JSON.parse(content);
                self.data.push(story);
            } catch (e) {
                Perf.error(e);
            }
            return read(i + 1);
        }
    }

    loadHtml(id) {
        return fs.readFile(`${SL_DIR_HTML}/${id}.html`);
    }

    /**
     * Performance problem of write bunch of files.
     *
     * Write a file costs ≈5ms
     * Write 2000 files costs 2000x5 ≈10s
     */
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
                const duplicateIndex = self._cacheQueue.findLastIndex((v) => v.path === path);
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
            return runTasks();
        }
    }

    existCache() {
        return fs.exists(ZERO);
    }

    async diskUsage() {
        let bytes = 0;
        const countSize = async (dir) => {
            const dirFiles = await fs.readDir(dir);
            const subDirs = [];
            for (const file of dirFiles) {
                if (file.isFile()) {
                    bytes += file.size;
                } else if (file.isDirectory()) {
                    subDirs.push(file.path);
                }
            }
            await Promise.all(subDirs.map(countSize));
        };

        try {
            await countSize(SL_DIR);
        } catch (e) { /**/ }

        return { bytes };
    }

    async clearDisk() {
        await fs.unlink(SL_DIR);
        // Re-create dir for pending tasks in _cacheQueue
        await fs.mkdir(SL_DIR_HTML);
        await fs.mkdir(SL_DIR_JSOND);
    }
}

function createWriteTask(path, data) {
    return {
        type: 'write',
        path,
        data,
    };
}

// eslint-disable-next-line no-extend-native
Array.prototype.findLastIndex = function findLastIndex(callbackFn, thisArg) {
    let i = this.length - 1;
    while (i >= 0) {
        const ok = callbackFn(this[i], i);
        if (ok) return i;
        i--;
    }
    return -1;
};

export default new StoryList();
