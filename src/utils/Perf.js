/* eslint-disable */
function start() {}
function info() {}
function log() {}

if (__DEV__) {
    /**
     * Only bundle these code in development
     */
    var __START__;
    var isRN = !navigator.userAgent;
    start = function () {
        __START__ = Date.now();
    }
    info = function (message) {
        const logs = [];
        const tsDiff = Date.now() - __START__;
        let tsLog = `+${tsDiff}ms`;

        if (tsDiff > 1000) {
            tsLog = `+${(tsDiff / 1000).toFixed(1)}s`;
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
    start();
}

export default {
    start,
    info,
    log,
};
