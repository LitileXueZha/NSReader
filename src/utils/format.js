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
    date(datetime) {}

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

export default new Formatter();
