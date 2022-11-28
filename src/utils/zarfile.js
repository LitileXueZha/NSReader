

import fs from 'react-native-fs';
import Perf from './Perf.js';

/**
 * Archive utilities - inspired by tar
 *
 * Written in pure js, only used in react-native, need combined with
 * `react-native-fs`. Focus on files, regardless of permissions
 *
 * NOTE: Hermes performance issue with `react-native-fs`, JavaScriptCore works
 * fine, but Hermes costs 100x time when read/writeFile frequently. (Run on
 * Android)
 *
 * @link https://en.wikipedia.org/wiki/Tar_(computing)
 */
class Zarfile {
    /**
     * Header encode (simplified)
     *
     * Contain 512 bytes, padded with NUL("\0").
     *
     * offset   size   field
     * --------------------------------------------------
     * 0        100    file name
     * 124      12     file size in bytes (octal)
     * 136      12     last modified time in Unix (octal)
     * 345      155    filename prefix
     * @param {string} path
     * @param {number} size
     * @param {Date} mtime
     */
    static encHeader(path, size, mtime) {
        const block = new Array(512).fill('\0');
        const prefixIdx = path.lastIndexOf('/');
        const encName = path.substring(prefixIdx + 1).substring(0, 100);
        const encPrefix = path.substring(0, prefixIdx).substring(0, 155);
        const encSize = (size & 0o77777777777).toString(8); // ~8G
        const encMTime = parseInt(mtime.getTime() / 1000, 10).toString(8);
        const writeBlock = (str, offset) => {
            for (let i = 0, len = str.length; i < len; i++) {
                block[offset + i] = str[i];
            }
        };

        writeBlock(encName, 0);
        writeBlock(encSize, 124);
        writeBlock(encMTime, 136);
        writeBlock(encPrefix, 345);

        return block.join('');
    }

    static decHeader(header) {
        const regNUL = /\0+$/g;
        const readBlock = (offset, len) => header.substr(offset, len).replace(regNUL, '');
        const name = readBlock(0, 100);
        const size = readBlock(124, 12);
        const mtime = readBlock(136, 12);
        const prefix = readBlock(345, 155);
        const metadata = {
            path: `${prefix}/${name}`,
            size: parseInt(size, 8),
            mtime: new Date(parseInt(mtime, 8) * 1000),
        };

        return metadata;
    }
}

const ZAR_OPTS = {
    gzip: false,
};
/**
 * Archive a series of files
 *
 * @param {string[]} entries paths of directory or file
 * @param {string} saveTo saved archived file path
 */
export async function zar(entries, saveTo, options = ZAR_OPTS) {
    const files = [];
    const collect = (item) => {
        const { path, mtime } = item;
        files.push({ path, mtime });
    };
    const zarInOne = async (i) => {
        const { path, mtime } = files[i];
        /**
         * Read in 'ascii' encoding.
         * If 'base64' it will increase the raw string size,
         * if 'utf-8' cause the raw string charCode exceed Uint8Array (gzip required)
         *
         * Because read binary file as 'ascii', it's required to write with same encoding.
         */
        const content = await fs.readFile(path, 'ascii');
        const size = content.length;
        const headerStr = Zarfile.encHeader(path, size, mtime);

        /**
         * PERF: frequent open/write file cause performance bottleneck
         *
         * Similar to nodejs filesystem, use `fs.writeFile` has performance issue,
         * the better way is Stream API. (Unavaliable in RN)
         */
        await fs.appendFile(saveTo, headerStr);
        await fs.appendFile(saveTo, content, 'ascii');
        if (i < files.length - 1) {
            return zarInOne(i + 1);
        }
    };

    await resolveEntries(entries, collect);
    await zarInOne(0);
}

/**
 * @param {string[]} list
 * @param {function} collect
 */
async function resolveEntries(list, collect) {
    const readTasks = list.map((v) => fs.readDir(v).catch(() => fs.stat(v)));
    const result = await Promise.all(readTasks);
    const subList = [];

    for (const item of result) {
        if (item instanceof Array) {
            // Directory
            for (let i = 0, len = item.length; i < len; i++) {
                const isDirectory = item[i].isDirectory();
                if (isDirectory) {
                    subList.push(item[i].path);
                } else {
                    collect(item[i]);
                }
            }
        } else collect(item); // File
    }
    if (subList.length > 0) {
        return resolveEntries(subList, collect);
    }
}

const UNZAR_OPTS = {
    gzip: false,
    overwrite: false, // force to save file
    overwritePaths: [],
    writePath: (filePath) => filePath, // change file path
};
/**
 * Unarchive files from a `.zar`
 *
 * @param {string} filePath
 * @param {object} options
 */
export async function unzar(filePath, options = UNZAR_OPTS) {
    const {
        gzip, overwrite, overwritePaths, writePath,
    } = options;
    const { size: fileSize } = await fs.stat(filePath);
    const unzarInOne = async (pos) => {
        const h1 = await fs.read(filePath, 512, pos);
        const header = Zarfile.decHeader(h1);
        const content = await fs.read(filePath, header.size, pos + 512, 'ascii');

        await writeDisk(header, content);
        const fixUtf8Pos = 512 - h1.length;
        const nextPos = pos + 512 + header.size + fixUtf8Pos;
        if (nextPos < fileSize) {
            return unzarInOne(nextPos);
        }
    };
    const cacheMkdir = new Set();
    const writeDisk = async (header, content) => {
        const { path: originalPath, mtime } = header;
        const path = writePath ? writePath(originalPath) : originalPath;
        let shouldWrite = overwrite || overwritePaths?.indexOf(path) > -1;
        // Overwrite will not check exists
        if (!shouldWrite) {
            const exist = await fs.exists(path);
            shouldWrite = !exist;
        }
        if (!shouldWrite) {
            return;
        }

        const dir = path.substring(0, path.lastIndexOf('/'));
        if (!cacheMkdir.has(dir)) {
            await fs.mkdir(dir);
            cacheMkdir.add(dir);
        }
        Perf.log('Write %s', path);
        await fs.writeFile(path, content, 'ascii');
        await fs.touch(path, mtime);
    };
    await unzarInOne(0);
}

/**
 * @param {string} str
 * @link https://stackoverflow.com/questions/834316/how-to-convert-large-utf-8-strings-into-ascii
 * @link https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString/Binary
 * @link https://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
 */
function utf8ToAscii(str) {
    /**
     * ASCII contains 127 characters.
     *
     * In JavaScript, strings is encoded by UTF-16, it means that
     * js cannot present strings which charCode greater than 2^16. Eg:
     * `String.fromCharCode(0) === String.fromCharCode(2**16)`
     */
    const reg = /[\x7f-\uffff]/g; // charCode: [127, 65535]
    const replacer = (s) => {
        const charCode = s.charCodeAt(0);
        const unicode = charCode.toString(16).padStart(4, '0');
        return `\\u${unicode}`;
    };

    return str.replace(reg, replacer);
}
// function utf8ToAscii(str) {
//     // Encoding API is not avaliable in RN
//     const enc = new TextEncoder('utf-8');
//     const u8s = enc.encode(str);
//
//     return Array.from(u8s).map(v => String.fromCharCode(v)).join('');
// }
// function u8sToString(arr) {
//     const dec = new TextDecoder('utf-8');
//     const u8s = new Uint8Array(arr);
//     // Or FileReader
//     const reader = new FileReader();
//     const block = new Blob([new Uint8Array(arr)]);
//     reader.onload = (e) => console.log(e.target.result);
//     reader.readAsText(block);
//
//     return dec.decode(u8s);
// }
