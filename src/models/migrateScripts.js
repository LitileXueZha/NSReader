import fs from 'react-native-fs';
import Perf from '../utils/Perf.js';

export async function copyJSONCacheToDB(db) {
    const jsond = `${fs.CachesDirectoryPath}/story/jsond`;
    const html = `${fs.CachesDirectoryPath}/story/html`;
    const copyData = async () => {
        const files = await fs.readdir(jsond);
        const sortFiles = files.sort((a, b) => b.substr(0, 13) - a.substr(0, 13));
        const rawContents = await readManyFiles(jsond, sortFiles);
        const data = rawContents.map((raw) => JSON.parse(raw));
        db.transaction((tx) => {
            const sql = 'INSERT INTO jsond (id,title,desc,date,pid,link,read) values (?,?,?,?,?,?,?)';
            for (let i = 0, len = data.length; i < len; i++) {
                const {
                    id, title, desc, date, pid, link, read,
                } = data[i];
                tx.executeSql(sql, [id, title, desc, date, pid, link, read]);
            }
        }, Perf.error);
    };
    const copyHtml = async () => {
        const files = await fs.readdir(html);
        const contents = await readManyFiles(html, files);
        db.transaction((tx) => {
            const sql = 'INSERT INTO html (pid,data) values (?,?)';
            for (let i = 0, len = contents.length; i < len; i++) {
                const pid = files[i].substr(0, 16);
                tx.executeSql(sql, [pid, contents[i]]);
            }
        }, Perf.error);
    };
    await Promise.all([copyHtml(), copyData()]);
}

async function readManyFiles(dir, files, start = 0, res = []) {
    if (start >= files.length) {
        return res;
    }
    const parts = files.slice(start, start + 10);
    const contents = await Promise.all(parts.map((name) => fs.readFile(`${dir}/${name}`)));
    return readManyFiles(dir, files, start + 10, res.concat(contents));
}
