/* eslint-disable class-methods-use-this */
const fs = require('fs/promises');
const { watch } = require('fs');
const http = require('http');
const path = require('path');
const EventEmitter = require('events');

process.env.DEBUG = 'UIDesignServer';
const debug = require('debug')('UIDesignServer');

const DIR_STATIC = path.resolve(__dirname);
const PORT = 8010;
const MIME_TYPES = {
    html: 'text/html', htm: 'text/html',
    css: 'text/css',
    js: 'application/javascript', json: 'application/json',
    txt: 'text/plain',
    jpeg: 'image/jpeg', jpg: 'image/jpeg',
    png: 'image/png',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
};
const SSR_LIVERELOAD = `
<script>
    const sse = new EventSource('/livereload');
    sse.addEventListener('open', () => {
        console.log('open');
    });
    sse.addEventListener('message', (ev) => {
        const data = JSON.parse(ev.data);
        if (data.reload) {
            location.reload();
        }
    });
    window.addEventListener('unload', () => {
        sse.close();
    });
</script>
`;

class UIDesignServer extends EventEmitter {
    constructor() {
        super();
        this.start = this.start.bind(this);
        this.aliveRes = null;
        this.watcher = null;
    }

    /**
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse} res
     */
    async start(req, res) {
        const { url, method } = req;
        const { pathname } = new URL(url, 'http://localhost');
        const filePathname = pathname === '/' ? '/index.html' : pathname;

        debug('%s %s', method, url);

        // Livereload
        if (pathname === '/livereload') {
            this.aliveRes = res;
            this.livereload(req.headers.referer);
            return;
        }

        // Static server
        this.serve(filePathname, res);
    }

    livereload(referer) {
        this.aliveRes.setHeader('Content-Type', 'text/event-stream');
        this.aliveRes.write('event: livereload\ndata: 1\n\n');

        const { pathname } = new URL(referer);
        const filePathname = pathname === '/' ? '/index.html' : pathname;
        const filePath = path.join(DIR_STATIC, filePathname);
        let timer = null;

        // setTimeout(() => {
        //     this.emit('livereload', filePathname);
        // }, 4000);
        if (this.watcher) {
            this.watcher.close();
            this.removeAllListeners('livereload');
        }
        debug('watch %o', filePathname);
        this.watcher = watch(filePath, (eventType, filename) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.emit('livereload', filename);
            }, 1000);
        });
        this.on('livereload', (file) => {
            const data = JSON.stringify({
                reload: 1,
                file,
            });
            this.aliveRes.write(`event: message\ndata: ${data}\n\n`);
            debug('reload');
        });
    }

    /**
     * @param {http.ServerResponse} res
     */
    async serve(pathname, res) {
        const filePath = path.join(DIR_STATIC, pathname);
        const ext = path.extname(pathname).substr(1);
        const mimeType = MIME_TYPES[ext];

        res.setHeader('Content-Type', mimeType || 'text/plain');
        res.setHeader('Cache-Control', 'no-cache');

        try {
            let rawContent = await fs.readFile(filePath);

            // Inject livereload code to .html
            if (ext === 'html') {
                rawContent = rawContent.toString().replace('</head>', `${SSR_LIVERELOAD}</head>`);
            }

            res.write(rawContent);
        } catch (error) {
            // Not exist
            res.writeHead(404);
        }
        res.end();
    }
}

http.createServer(new UIDesignServer().start)
    .listen(PORT, () => {
        debug('start ==> http://localhost:%d', PORT);
    });
