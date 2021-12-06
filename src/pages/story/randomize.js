import emmet from 'emmet';

/**
 * Randomize a story list (**DEV only**)
 * 
 * @param {number} length
 */
export default function getRandomValues(length = 20) {
    const values = [];
    let i = 0;

    while (i < length) {
        const title = emmet('lorem2-16');
        const description = emmet(`lorem60-${60 + length}`);
        const date = Date.now() - i * 1000 * 3600 * 8;
        const rcIdx = parseInt(Math.random() * 8, 10);
        const read = Math.random() > 0.7;

        values.push({
            title,
            description,
            date,
            rcIdx,
            read,
        });
        i ++;
    }
    return values;
}
