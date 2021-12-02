import { InteractionManager } from 'react-native';
import fs from 'react-native-fs';

import defaultSettings from './settings.json';

const { DocumentDirectoryPath } = fs;
const FILE = `${DocumentDirectoryPath}/settings.json`;
const WRITE_THRESHOLD = 300;

/**
 * App settings controller
 * 
 * Read settings from local file system, and save into it.
 */
class AppSettings {
    constructor() {
        this._settings = {};
        this._initialized = false;
        this._timer = null;
        this._rHandle = null;
    }

    /**
     * Init settings
     * 
     * It should be called when app launched at once.
     */
    async init() {
        if (this._initialized) return;

        try {
            const rawJson = await fs.readFile(FILE);
            console.log('Load settings:', rawJson);
            this._settings = JSON.parse(rawJson);
        } catch (e) {
            // Use defaults and save it on device
            this._settings = defaultSettings;
            this._writeToDisk();
        }
        this._initialized = true;
    }

    /**
     * Read a settings item
     * 
     * @param {string} key See avaliable values in `settings.json`
     */
    get(key) {
        return this._settings[key];
    }

    /**
     * Update and save settings
     * 
     * @param {string} key
     * @param {string|number} value
     */
    store(key, value) {
        this._settings[key] = value;
        this._writeToDisk();
    }

    _writeToDisk() {
        clearTimeout(this._timer);
        this._rHandle?.cancel();
        this._timer = setTimeout(() => {
            this._rHandle = InteractionManager.runAfterInteractions(() => this._write());
        }, WRITE_THRESHOLD);
    }

    async _write() {
        const rawJson = JSON.stringify(this._settings);
        await fs.writeFile(FILE, rawJson, 'utf8').catch((err) => {
            /* More.. */
        });
    }
}

export default new AppSettings();
