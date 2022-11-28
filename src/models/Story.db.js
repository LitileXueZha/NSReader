import SQLite from 'react-native-sqlite-storage';
import fs from 'react-native-fs';
import Perf from '../utils/Perf.js';
import { isNewVersion } from '../utils';
import { copyJSONCacheToDB } from './migrateScripts.js';

/** @type {SQLite.SQLiteDatabase} */
let db;
const DB_NAME = 'story-cache.db';
const SCHEMA = {
    jsond: [
        '`id` TEXT PRIMARY KEY',
        '`title` TEXT NOT NULL',
        '`desc` TEXT',
        '`date` NUMERIC NOT NULL',
        '`pid` TEXT NOT NULL',
        '`link` TEXT',
        '`read` INT DEFAULT 0',
        '`_d` INT DEFAULT 0',
    ],
    html: [
        '`pid` TEXT PRIMARY KEY',
        '`data` TEXT',
        '`_d` INT DEFAULT 0',
    ],
    migrate: ['`ver` TEXT', '`date` NUMERIC'],
};

/**
 * @returns {Promise<SQLite.SQLiteDatabase>}
 */
export function initDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }
        const onSuccess = () => {
            // Initial tables
            for (const table in SCHEMA) {
                const columns = SCHEMA[table].join(',');
                db.executeSql(`CREATE TABLE IF NOT EXISTS ${table} (${columns})`);
            }
            resolve(db);
        };
        db = SQLite.openDatabase({ name: DB_NAME, location: 'default' }, onSuccess, reject);
    });
}

let dataing = [];
const NUM_PER_TRANSACTION = 1000;
export function insertData(info, instant = false) {
    return new Promise((resolve, reject) => {
        if (!instant && dataing.length < NUM_PER_TRANSACTION) {
            dataing.push(info);
            resolve();
            return;
        }
        if (dataing.length === 0) {
            resolve();
            return;
        }
        const onSuccess = () => {
            Perf.info(`SQLite3 inserted ${dataing.length} rows`);
            dataing = instant ? [] : [info];
            resolve();
        };
        Perf.start();
        db.transaction((tx) => {
            for (let i = 0, len = dataing.length; i < len; i++) {
                const { table, data } = dataing[i];
                switch (table) {
                    case 'jsond': {
                        const {
                            id, title, desc, date, pid, link, read,
                        } = data;
                        const params = [id, title, desc, date, pid, link, read];
                        tx.executeSql('INSERT INTO jsond (id,title,desc,date,pid,link,read) values (?,?,?,?,?,?,?)', params);
                        break;
                    }
                    case 'html': {
                        tx.executeSql('INSERT INTO html (pid,data) values (?,?)', [data.pid, data.data]);
                        break;
                    }
                    default:
                        break;
                }
            }
        }, reject, onSuccess);
    });
}

export function updateData(id, data) {
    const keys = Object.keys(data);
    if (keys.length === 0) {
        return;
    }
    const sets = keys.map((k) => `${k}=?`).join(',');
    const params = keys.map((k) => data[k]);
    params.push(id);
    db.executeSql(`UPDATE jsond SET ${sets} WHERE id=?`, params, () => {}, Perf.error);
}

export function deleteData(pid) {
    db.executeSql('DELETE FROM jsond WHERE pid=?', [pid], () => {}, Perf.error);
}

export function deleteAllData() {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('DELETE FROM jsond');
            tx.executeSql('DELETE FROM html');
        }, reject, resolve);
    });
}

export function readData(date, size, extra) {
    return new Promise((resolve, reject) => {
        const onSuccess = (res) => {
            const rows = res.rows.raw();
            resolve(rows);
        };
        let extraParams = [];
        let extraWhere = '';
        if (extra) {
            extraWhere = `AND (${extra.where})`;
            extraParams = extra.params;
        }
        db.executeSql(
            `SELECT * FROM jsond WHERE date<=? ${extraWhere} ORDER BY date DESC LIMIT ?`,
            [date, ...extraParams, size],
            onSuccess, reject,
        );
    });
}

export function readHtml(pid) {
    return new Promise((resolve, reject) => {
        const onSuccess = (res) => {
            const item = res.rows.item(0);
            resolve(item.data);
        };
        db.executeSql('SELECT data FROM html WHERE pid=?', [pid], onSuccess, reject);
    });
}

function migrate() {
    const onSuccess = (res) => {
        const params = () => [__VERSION__, parseInt(Date.now() / 1000, 10)];
        // A new user, no need to migrate
        if (res.rows.length === 0) {
            // Prepare for next migration
            db.executeSql('INSERT INTO migrate values (?,?)', params());
            return;
        }
        const lastVer = res.rows.item(0).ver;
        if (!isNewVersion(lastVer, __VERSION__)) {
            return;
        }
        db.transaction((tx) => {
            // migrate scripts...
            tx.executeSql('INSERT INTO migrate values (?,?)', params());
        });
    };
    // db.executeSql('select * from migrate', [], (res) => console.log(res.rows.raw()));
    db.executeSql('SELECT ver FROM migrate ORDER BY date DESC LIMIT 1', [], onSuccess, Perf.error);
}

function copyDBToDownload() {
    const dbPath = `${fs.DocumentDirectoryPath}/../databases/${DB_NAME}`;
    const destPath = `${fs.DownloadDirectoryPath}/${DB_NAME}`;
    fs.copyFile(dbPath, destPath).catch(console.error);
}

// initDB().then(copyDBToDownload);
