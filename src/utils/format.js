/* eslint-disable class-methods-use-this */

const BYTES_THRESHOLD = [
    0,
    1024,
    1024 * 1e+3,
    1024 * 1e+6,
];
const BYTES_TEXT = ['B', 'K', 'M', 'G'];

/**
 * Formatter
 * 
 * Provide human readble text, with consistence of the
 * entrie app.
 */
class Formatter {
    /**
     * Simplify date:
     * + today => `09:02`
     * + this year => `11/03`
     * + in past years => `2010/01/31`
     * 
     * @param {string|Date} datetime
     * @returns {string}
     */
    date(datetime) {
        const rawDate = new Date(datetime);
        const strs = [
            rawDate.getFullYear(),
            rawDate.getMonth() + 1,
            rawDate.getDate(),
            rawDate.getHours(),
            rawDate.getMinutes(),
        ];
        const currDate = new Date();
        const currYear = currDate.getFullYear();

        if (strs[0] === currYear) {
            // This year => 11/03
            if (strs[2] !== currDate.getDate() || strs[1] !== currDate.getMonth() + 1) {
                return strs.slice(1, 3)
                    .map(padZeroStart)
                    .join('/');
            }
            // Today => 09:02
            return strs
                .slice(3)
                .map(padZeroStart)
                .join(':');
        }
        // In past years => 2010/01/31
        return strs.slice(0, 3)
            .map(padZeroStart)
            .join('/');
    }

    /**
     * Convert bytes to K/M/G
     * 
     * @param {number} intBytes
     * @returns {string}
     */
    bytes(intBytes) {
        let i = 0;
        while (intBytes >= BYTES_THRESHOLD[i]) {
            i ++;
        }

        const idx = i - 1;
        let value = intBytes;
        if (idx > 0) {
            value = intBytes / BYTES_THRESHOLD[idx];
            // Reduce float numbers
            if (value % 10 !== 0) {
                value = value.toFixed(1);
            }
        }
        return `${value}${BYTES_TEXT[idx]}`;
    }
}

function padZeroStart(n) {
    return n < 10 ? `0${n}` : n;
}

export default new Formatter();
