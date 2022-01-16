import { useState } from 'react';


export default function useFilter(initialState = {}) {
    const [summary, setSummary] = useState(Boolean(initialState.summary));
    const [read, setRead] = useState(Boolean(initialState.read));
    const [today, setToday] = useState(Boolean(initialState.today));
    const [last, setLast] = useState(Boolean(initialState.last));
    const fnMap = {
        summary: setSummary,
        read: setRead,
        today: setToday,
        last: setLast,
    };
    const setFilter = (key, value) => fnMap[key](value);

    return [{
        summary,
        read,
        today,
        last,
    }, setFilter];
}

/**
 * @param {array} stories
 * @param {object} filterValues
 */
export function doFilter(stories, filterValues) {
    if (stories.length === 0) {
        return [];
    }

    const {
        read,
        today,
        last,
    } = filterValues;
    let answer = stories;
    const todayTs = new Date().setHours(0, 0, 0);

    answer = answer.filter((item) => read || !item.read);
    answer = answer.filter((item) => !today || item.date > todayTs);
    if (last) {
        answer = answer.reverse();
    }
    // Add a flag for past
    const past = answer.find((item) => item.date < todayTs);
    if (past) {
        past.flagPast = true;
    }

    return answer;
}
