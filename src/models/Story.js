import fs from 'react-native-fs';
import { nanoid } from 'nanoid/non-secure';

import { insertStoryTo } from './Story.util.js';

const SL_DIR = `${fs.CachesDirectoryPath}/story`;
const SL_DIR_HTML = `${SL_DIR}/html`;
const SL_IDS = 'ids';
const ZERO = `${SL_DIR}/0`;

const MAX = 100;
const ID_LENGTH = 16;
const DESC_LENGTH = 200;
// Delete html tags: <h1>,</h1>,<img/>
const REG_HTMLTAG = /(<\w+.*?\/?>|<\/pw+>)/gm;
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

        this.__START__ = Date.now();
        try {
            const rawData = await fs.readFile(ZERO);
            this.data = JSON.parse(rawData);
            const rawIds = await fs.readFile(`${SL_DIR}/${SL_IDS}`);
            this._ids = JSON.parse(rawIds);
        } catch (e) {
            // await fs.mkdir(SL_DIR);
            await fs.mkdir(SL_DIR_HTML);
        }
        this.initialized = true;
        if (__DEV__) {
            console.log('Story initialized costs %d ms', Date.now() - this.__START__);
        }
    }

    async append(data, rss) {
        await this.init();
        if (data.length === 0) {
            return;
        }
        // console.log(rss,data);
        const pid = rss.id;
        if (!this._ids[pid]) {
            this._ids[pid] = {
                latest: [],
                list: [],
            };
        }
        const { latest } = this._ids[pid];
        const sortData = data.sort((a, b) => new Date(b) - new Date(a));
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
                const storyItem = {
                    ...item,
                    id,
                    pid,
                    desc: summary,
                    date: new Date(date).getTime(), // convert date string to timestamp
                    read: DEFAULT_READ,
                };
                // Remove the large description
                delete storyItem.description;
                if (storyItem.link instanceof Array) {
                    storyItem.link = storyItem.link[0];
                }
                this._ids[pid].list.push(id);
                newStories[i] = storyItem;
                this._cacheQueue.push(createWriteTask(`${SL_DIR}/${id}`, storyItem));
                this._cacheQueue.push(createWriteTask(`${SL_DIR_HTML}/${id}.html`, description));
            }
        }
        if (newStories.length > 0) {
            this._ids[pid].latest = sortData.map((item) => item.title);
            this.data = insertStoryTo(newStories, this.data);
            this._cacheQueue.push(createWriteTask(`${SL_DIR}/${SL_IDS}`, this._ids));
            this._cacheQueue.push(createWriteTask(ZERO, this.data.slice(0, MAX)));
            this.mkCache();
        }
    }

    update(id, data) {}

    mkCache() {
        if (this._cacheWriting) {
            // Cache is writing, new tasks in queue will also be executed
            return;
        }
        this.__START__ = Date.now();
        this._cacheWriting = true;
        const self = this;
        runTasks();

        // Don't use for-await, it will block JS thread
        async function runTasks() {
            const currTask = self._cacheQueue.shift();
            if (!currTask) {
                if (__DEV__) {
                    console.log('Story cache write costs %d ms', Date.now() - self.__START__);
                }
                // Done
                self._cacheWriting = false;
                return;
            }
            const { type, path, data } = currTask;
            if (type === 'write') {
                let content = data;
                if (typeof content === 'object') {
                    content = JSON.stringify(content);
                }
                await fs.writeFile(path, content).catch((e) => {
                    // Write failed
                    console.warn(e);
                });
            }
            await runTasks();
        }
    }

    static async existCache() {
        return fs.exists(SL_DIR);
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
