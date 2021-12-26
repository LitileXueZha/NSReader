/// <reference types="mocha" />
import { expect } from 'chai';
import { nanoid } from 'nanoid/non-secure';
import { insertStoryTo } from '../src/models/Story.util.js';

const stories = [];
const datalist = [];
const datalistOutdate = []; // best case
const storiesOutdate = []; // most bad case

describe('models/Story', () => {
    before(() => {
        for (let i = 0; i < 20; i++) {
            stories[i] = randomValue(i);
        }
        for (let i = 0; i < 100; i++) {
            datalist[i] = randomValue(i + 15); // 15 < 20
        }
        for (let i = 0; i < 50; i++) {
            datalistOutdate[i] = randomValue(i + 50); // 50 > 20
        }
        for (let i = 0; i < 20; i++) {
            storiesOutdate[i] = randomValue(i + 115); // 110+15
        }
    });

    it('.insertStoryTo()', () => {
        const data = insertStoryTo(stories, datalist);
        const isOrdered = validateOrderDate(data);
        expect(isOrdered).to.equal(true);

        const data1 = insertStoryTo(stories, datalistOutdate);
        const isOutdateOrdered = validateOrderDate(data1);
        expect(isOutdateOrdered).to.equal(true);

        const data2 = insertStoryTo(storiesOutdate, datalist);
        const isOutdateOrdered2 = validateOrderDate(data2);
        expect(isOutdateOrdered2).to.equal(true);
    });
});

// Helpers
function validateOrderDate(arr) {
    for (let i = 1, len = arr.length; i < len; i++) {
        if (arr[i].date > arr[i - 1].date) {
            return false;
        }
    }
    return true;
}
function randomValue(n) {
    return {
        id: nanoid(8),
        date: Date.now() - parseInt((Math.random() + n) * 60 * 1000, 10),
    };
}
