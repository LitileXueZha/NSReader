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
