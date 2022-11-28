export function debounce(fn, duration = 20) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), duration);
    };
}

export function throttle(fn, threshold = 10) {
    let value = 0;

    return (shouldValue) => (...args) => {
        if (Math.abs(shouldValue - value) > threshold) {
            value = shouldValue;
            fn(...args);
        }
    };
}

export function isNewVersion(old, current) {
    if (old === current) {
        return false;
    }
    const oldVers = old.split('.');
    const currVers = current.split('.');
    for (let i = 0; i < 3; i++) {
        const m = parseInt(oldVers[i], 10);
        const n = parseInt(currVers[i], 10);
        if (n > m) {
            return true;
        }
    }
    return false;
}

export function once(fn) {
    let fired = null;
    return (...args) => {
        if (fired) return;
        fn(...args);
        fired = true;
    };
}
