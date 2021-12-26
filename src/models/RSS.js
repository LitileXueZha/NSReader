import fs from 'react-native-fs';
import MD5 from 'crypto-js/md5';
import { nanoid } from 'nanoid/non-secure';

import MStory from './Story.js';

/** The download file path when add rss */
export const RSS_ADD_DLP = `${fs.CachesDirectoryPath}/rssadd.tmp`;

const RSS_DIR = `${fs.DocumentDirectoryPath}/data`;
// Extra settings which user can change
const RSS_DEFAULT_EXTRA = {
    /** Alias of the rss title */
    alias: '',
    /** Should rss auto update */
    enabled: 1,
};
const RSS_INDEX = 'index.json';

/**
 * Abstract data layer of rss
 */
class RSSSource {
    constructor() {
        this.data = {};
    }

    async create(url, data) {
        const id = MD5(url).toString();
        const dataPath = `${RSS_DIR}/${id}`;
        const { story, ...rssMetadata } = data;

        await fs.mkdir(dataPath);
        // Use latest story title as file name, for quick check
        // should save it or not. If exists, it's duplicate.
        let latest = story[0];
        for (let i = 1, len = story.length; i < len; i++) {
            if (new Date(story[i].date) > new Date(latest.date)) {
                latest = story[i];
            }
        }
        if (latest) {
            const storeFile = MD5(latest.title).toString();
            await fs.moveFile(RSS_ADD_DLP, `${dataPath}/${storeFile}.xml`).catch((e) => {
                // Move failed
                console.warn(e);
            });
        }
        // Atom 1.0 may has multiple links
        if (rssMetadata.link instanceof Array) {
            rssMetadata.link = rssMetadata.link[0];
        }
        // Assign id
        rssMetadata.id = id;
        rssMetadata.url = url;
        // Allocate a random color index
        rssMetadata.rcIdx = parseInt(Math.random() * 8, 10);

        const rssItem = { ...rssMetadata, ...RSS_DEFAULT_EXTRA };
        // Write to disk
        await fs.writeFile(`${dataPath}/${RSS_INDEX}`, JSON.stringify(rssItem));
        // Add to memory
        this.data[id] = rssItem;
        // Deal with story
        console.log(story.map(v=>MD5(v.title).toString()))
        MStory.append(story, rssItem);
    }

    update(id, data) {}
}

export default new RSSSource();
