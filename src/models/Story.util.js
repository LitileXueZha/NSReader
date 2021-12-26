/**
 * Some utils function for models/Story
 * 
 * It's designed for unit test.
 */
export default 'Story.util';

/**
 * Insert data to list (in `.date` order)
 * 
 * @param {array} stories
 * @param {array} list
 */
export function insertStoryTo(stories, list) {
    const data = stories.concat(list);

    if (list.length !== 0) {
        // Straight insert sort
        let startIndex = stories.length - 1;
        let endIndex = startIndex + 1;
        const minDate = stories[startIndex].date;
        const maxDate = list[0].date;
        for (let i = startIndex; i >= 0; i--) {
            if (stories[i].date < maxDate) {
                startIndex = i;
            } else break;
        }
        for (let i = endIndex, len = data.length; i < len; i++) {
            if (data[i].date > minDate) {
                endIndex = i;
            } else break;
        }
        if (endIndex - startIndex > 1) {
            for (let i = stories.length; i <= endIndex; i++) {
                for (let j = i; j > startIndex && data[j].date > data[j - 1].date; j--) {
                    // Exchange
                    const tmp = data[j];
                    data[j] = data[j - 1];
                    data[j - 1] = tmp;
                }
            }
        }
    }
    return data;
}
