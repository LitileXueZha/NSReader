/* eslint-disable */
function start() {}
function info() {}
function log() {}
function error() {
    /**
     * Production error monitor
     * 
     * TODO:
     * Record the error stacks, write logs to disk.
     * 
     * It's useful for developer when tracking issues, but
     * users can disable this feature.
     */
}

if (__DEV__) {
    /**
     * Only bundle these code in development
     */
    var __START__;
    var isRN = !navigator.userAgent;
    start = function () {
        __START__ = performance.now();
    }
    info = function (message) {
        const logs = [];
        const tsDiff = performance.now() - __START__;
        let tsLog = `+${tsDiff.toFixed(2)}ms`;

        if (tsDiff > 10000) {
            tsLog = `+${(tsDiff / 10000).toFixed(3)}s`;
        }
        if (isRN) {
            // Command line
            // \033[m###\033[0m
            logs.push('\x1b[37m\x1b[45mPerf\x1b[0m');
            logs.push(message);
            logs.push(`\x1b[32m${tsLog}\x1b[0m`);
        } else {
            // Browser console
            logs.push(`%cPerf%c ${message} %c${tsLog}`);
            logs.push('background:purple;color:white');
            logs.push('');
            logs.push('color:green');
        }
        console.log(...logs);
    }
    log = console.log;
    error = console.error;
    start();
}

export default {
    start,
    info,
    log,
    error,
};
