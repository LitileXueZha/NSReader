/* eslint-disable class-methods-use-this */
import fs from 'react-native-fs';
import MD5 from 'crypto-js/md5';
import { nanoid } from 'nanoid/non-secure';

import Perf from '../utils/Perf.js';
import MStory from './Story.js';
import parseRSS from '../utils/RSSParser.js';
import $ev from '../utils/Event.js';

/** The download file path when add rss */
export const RSS_ADD_DLP = `${fs.CachesDirectoryPath}/rssadd.tmp`;

const RSS_DIR = `${fs.DocumentDirectoryPath}/data`;
// Extra settings which user can change
const RSS_DEFAULT_EXTRA = {
    /** Alias of the rss title */
    alias: '',
    /** Should rss auto update */
    enabled: 1,
    /** As daily */
    daily: 0,
};
const RSS_INDEX = 'index.json';
const REG_URL_ORIGIN = /^(https?:\/\/([\w-]+\.)+[\w-]+)/;
const FETCH_TIMEOUT = 15; // seconds

/**
 * Abstract data layer of rss
 */
class RSSSource {
    constructor() {
        this.data = {};
        this.initialized = false;
    }

    async init() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        Perf.start();
        try {
            const dirs = await fs.readDir(RSS_DIR);
            const readTasks = dirs.map((v) => fs.readFile(`${v.path}/${RSS_INDEX}`));
            const contents = await Promise.all(readTasks);
            for (const content of contents) {
                try {
                    const rssItem = JSON.parse(content);
                    this.data[rssItem.id] = rssItem;
                } catch (e) {
                    // Don't let the error break the loop, handle more items as possible
                }
            }
        } catch (e) {
            // Read failed, usually no rss items
            Perf.error(e);
        }
        Perf.info('RSSSource initialized');
    }

    /**
     * @param {string} url
     * @param {object} data parsed rss data
     */
    async create(url, data) {
        const id = MD5(url).toString();
        const dataPath = `${RSS_DIR}/${id}`;

        await fs.mkdir(dataPath);
        const saveId = this._getSaveId(data);
        if (saveId) {
            await fs.moveFile(RSS_ADD_DLP, `${dataPath}/${saveId}.xml`).catch((e) => {
                // Move failed
                Perf.error(e);
            });
        }
        const rssMetadata = this._getMetadata(data);
        const rssItem = {
            ...rssMetadata,
            ...RSS_DEFAULT_EXTRA,
            // Assign id
            id,
            url,
            // Allocate a random color index
            rcIdx: parseInt(Math.random() * 8, 10),
        };
        await this._saveWork(rssItem);
        // Deal with story
        MStory.append(data.story, rssItem);
    }

    /**
     * Fetch a rss source from remote origin
     *
     * @param {string} id
     */
    async fetch(id) {
        Perf.log('Fetching RSSSource %s', id);
        const { url } = this.data[id];
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT * 1000);
        const resp = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            signal: ac.signal,
        });
        clearTimeout(timer);
        if (!resp.ok) {
            return;
        }
        const sourceText = await resp.text();
        const result = parseRSS(sourceText || '');
        if (!result?.ok) {
            return;
        }
        const { data } = result;
        const saveId = this._getSaveId(data);

        if (saveId) {
            // Don't use await, make it asynchronous
            fs.writeFile(`${RSS_DIR}/${id}/${saveId}.xml`, sourceText).catch((e) => {
                Perf.error(e);
            });
        }
        const rssMetadata = this._getMetadata(data);
        await this.update(id, rssMetadata);
        MStory.append(data.story, { ...rssMetadata, id, url });
    }

    async fetchAll() {
        await this.init();
        // const ids = Object.keys(this.data);
        const ids = [];

        // eslint-disable-next-line
        for (const id in this.data) {
            const { enabled } = this.data[id];
            if (enabled) {
                ids.push(id);
            }
        }
        const tasks = ids.map((id) => this.fetch(id));

        // Concurrent mode
        await Promise.all(tasks).catch(Perf.error);
    }

    /**
     * Update on local
     *
     * @param {string} id
     * @param {object} data
     */
    async update(id, data = {}) {
        if (!this.data[id]) {
            return;
        }
        await this._saveWork({ ...this.data[id], ...data });
    }

    /**
     * Delete a rss source
     *
     * There are a series of works:
     * + delete rss memory
     * + delete rss data files
     * + delete story list memory
     * + delete story list cache files
     * @param {string} id
     */
    async delete(id) {
        if (!this.data[id]) {
            return;
        }
        delete this.data[id];
        await fs.unlink(`${RSS_DIR}/${id}`);
        $ev.emit('rsschange');
        MStory.delete(id);
    }

    /**
     * Parse the saved rss files
     *
     * Be careful of JavaScript event-loop(single-thread mechanism), too many tasks
     * will cause the thread in a "busy" state, the task which is at the end of queue
     * will seems a bit slow when executed.
     *
     * For the peformance, make sure there are no frequent tasks when parsing the
     * local files, eg: debounce the ui-update task
     */
    async parseLocalStory() {
        const ids = Object.keys(this.data);
        if (ids.length === 0) return;
        Perf.start();
        const dirTasks = ids.map((name) => fs.readDir(`${RSS_DIR}/${name}`));
        const dirs = await Promise.all(dirTasks);
        const self = this;

        await readLocalRSS(0);

        async function readLocalRSS(i) {
            if (i >= dirs.length) {
                Perf.info('RSS xml parsed (local)');
                return;
            }

            const id = ids[i];
            Perf.log('Parsing RSSSource %s', id);
            const xmlFiles = dirs[i].filter((v) => v.name !== RSS_INDEX)
                // Fix the unexpected save same mutiple stories
                .sort((a, b) => a.mtime - b.mtime);
            const readTasks = xmlFiles.map((xml) => fs.readFile(xml.path));
            const contents = await Promise.all(readTasks);

            for (let j = 0, len = xmlFiles.length; j < len; j++) {
                const { mtime } = xmlFiles[j];
                const result = parseRSS(contents[j]);
                if (result.ok) {
                    MStory.append(result.data.story, self.data[id], mtime);
                }
            }
            return readLocalRSS(i + 1);
        }
    }

    get countList() {
        Perf.log('get RSS#countList');
        const list = Object.values(this.data);
        const fnMap = (item) => {
            const { id, title, alias } = item;
            const total = MStory.ids[id]?.list || 0;

            return { id, title: alias || title, total };
        };

        return list.map(fnMap);
    }

    async _saveWork(data) {
        const { id } = data;
        const content = JSON.stringify(data);
        this.data[id] = data;
        await fs.writeFile(`${RSS_DIR}/${id}/${RSS_INDEX}`, content).catch((e) => {
            Perf.error(e);
        });
        $ev.emit('rsschange');
    }

    _getMetadata(dataParsed) {
        const { story, ...mdata } = dataParsed;

        // Atom 1.0 may has multiple links
        if (mdata.link instanceof Array) {
            mdata.link = mdata.link[0];
        }
        // RSS 2.0 has publish interval
        if (mdata.ttl) {
            mdata.ttl = parseInt(mdata.ttl, 10);
        }
        if (!mdata.favicon && mdata.link) {
            // Use website favicon.ico
            const matches = mdata.link.match(REG_URL_ORIGIN);
            if (matches) {
                mdata.favicon = `${matches[0]}/favicon.ico`;
            }
        }
        mdata.date = new Date(mdata.date).getTime(); // convert to timestamp
        return mdata;
    }

    _getSaveId(dataParsed) {
        const { story } = dataParsed;
        if (story.length === 0) {
            return false;
        }
        // Use latest story title as file name, for quick check
        // should save it or not. If exists, it's duplicate.
        let latest = story[0];
        for (let i = 1, len = story.length; i < len; i++) {
            if (new Date(story[i].date) > new Date(latest.date)) {
                latest = story[i];
            }
        }
        return MD5(latest.title).toString();
    }

    async diskUsage() {
        let dataBytes = 0;
        let dataIndexBytes = 0;

        try {
            const dirs = await fs.readdir(RSS_DIR);
            const tasks = dirs.map((d) => fs.readDir(`${RSS_DIR}/${d}`));
            const results = await Promise.all(tasks);

            for (const files of results) {
                for (const file of files) {
                    if (file.name === RSS_INDEX) {
                        dataIndexBytes += file.size;
                    } else {
                        dataBytes += file.size;
                    }
                }
            }
        } catch (e) { /**/ }

        return { bytes: dataBytes, index: dataIndexBytes };
    }

    async clearDisk() {
        const delFiles = [];
        const dirs = await fs.readDir(RSS_DIR);
        const tasks = dirs.map((d) => fs.readDir(d.path));
        const subDirs = await Promise.all(tasks);
        subDirs.forEach((d) => d.forEach((file) => {
            if (file.name !== RSS_INDEX) {
                delFiles.push(file.path);
            }
        }));
        const delTasks = delFiles.map((f) => fs.unlink(f));
        await Promise.all(delTasks);
    }
}

export default new RSSSource();
