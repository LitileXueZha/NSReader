import emmet from 'emmet';

/**
 * Randomize a story list **(DEV only)**
 * 
 * @param {number} length
 */
export function getRandomStories(length = 20) {
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
            desc: description,
            date,
            rcIdx,
            read,
        });
        i ++;
    }
    return values;
}

/**
 * Randomize a rss sources list **(DEV only)**
 * 
 * @param {number} length
 */
export function getRandomSources(length = 20) {
    const values = [];
    let i = 0;

    while (i < length) {
        const title = emmet('lorem2-8');
        const description = emmet('lorem1-40');
        const date = Date.now() - i * 1000 * 3600 * 12;
        const rcIdx = parseInt(Math.random() * 8, 10);
        const enabled = Math.random() > 0.3;

        values.push({
            title,
            date,
            description,
            rcIdx,
            enabled,
        });
        i ++;
    }
    return values;
}
