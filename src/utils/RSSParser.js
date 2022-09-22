import { SAXParser } from './sax.js';
import Perf from './Perf.js';

const PARSE_STRICT = false;
const PARSE_OPT = {
    // lowercase: true,
    trim: true,
};
/**
 * A easy RSS parser, based on sax.js
 */
export class RSSParser extends SAXParser {
    constructor() {
        super(PARSE_STRICT, PARSE_OPT);
        this._ptr = {};
        this._stack = [];
        this.result = null;
    }

    onerror(e) {
        Perf.error(e);
    }

    // How to stop a while-loop? A big problem...
    // ondoctype(type) {
    //     if (type === 'html') {
    //         throw new Error('RSSParser not support html');
    //     }
    // }

    onopentag(node) {
        const { name, isSelfClosing, attributes } = node;
        const tag = {
            attributes,
        };

        this._stack.push(this._ptr);
        // covert to array
        if (name in this._ptr) {
            if (this._ptr[name] instanceof Array) {
                this._ptr[name].push(tag);
            } else {
                // rewrite
                this._ptr[name] = [this._ptr[name], tag];
            }
        } else {
            this._ptr[name] = tag;
        }
        this._ptr = tag;
    }

    onclosetag(tagName) {
        this._ptr = this._stack.pop();
    }

    ontext(t) {
        if (this._ptr.text === undefined) {
            this._ptr.text = '';
        }
        this._ptr.text += t;
    }

    oncdata(cdata) {
        if (this._ptr.cdata === undefined) {
            this._ptr.cdata = '';
        }
        this._ptr.cdata += cdata;
    }

    onend() {
        const rules = Object.values(SPECIFICATIONS);
        const activeRule = rules.find((v) => this.validateSpec(v.ruler));

        if (activeRule) {
            this.result = {
                ok: true,
                spec: activeRule.name,
                data: this.getSpecData(activeRule),
            };
            return;
        }
        this.result = {
            ok: false,
        };
    }

    validateSpec(ruler) {
        const nodes = ruler.split('>');
        const regWithAttr = /^(\w+)\((.+)\)$/;
        let checkObj = this._ptr;

        for (let i = 0, len = nodes.length; i < len; i++) {
            let key = nodes[i];
            const matches = regWithAttr.exec(key);

            if (matches) {
                key = matches[1];
                const [attrName, attrValue] = matches[2].split('=');
                if (key in checkObj && checkObj[key]?.attributes[attrName] === attrValue) {
                    checkObj = checkObj[key];
                    continue;
                }
            } else if (key in checkObj) {
                checkObj = checkObj[key];
                continue;
            }
            return false;
        }
        return true;
    }

    getSpecData(rule) {
        const { name, maps } = rule;
        const data = { spec: name };

        // eslint-disable-next-line guard-for-in
        for (const key in maps) {
            const findKey = maps[key];
            let findValue = null;

            if (findKey instanceof Array) {
                for (const alernate of findKey) {
                    findValue = this.findValues(alernate);
                    if (findValue) {
                        break;
                    }
                }
            } else {
                findValue = this.findValues(findKey);
            }

            if (key.indexOf('.') > 0) {
                const [k, subKey] = key.split('.');
                if (!(k in data)) {
                    if (findValue instanceof Array) {
                        data[k] = findValue.map((v) => ({ [subKey]: v }));
                    } else {
                        data[k] = { [subKey]: findValue };
                    }
                }
                if (findValue instanceof Array) {
                    data[k] = findValue.map((v, i) => ({ ...data[k][i], [subKey]: v }));
                } else {
                    data[k][subKey] = findValue;
                }
            } else {
                data[key] = findValue;
            }
        }
        return data;
    }

    findValues(needle) {
        if (!needle) return null;

        const [dotStr, attr] = needle.toUpperCase().split('$');
        const keys = dotStr.split('.');
        let currObj = this._ptr;
        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];

            if (!(currObj instanceof Array || key in currObj)) {
                return null;
            }
            currObj = mapDeepArray(currObj, key);
        }

        if (currObj instanceof Array) {
            return currObj.map((item) => item && getText(item));
        }
        return getText(currObj);

        // Helpers
        function mapDeepArray(o, key) {
            if (o instanceof Array) {
                return o.map((oo) => mapDeepArray(oo, key));
            }
            return o[key];
        }
        function getText(o) {
            if (o instanceof Array) {
                return o.map((oo) => getText(oo));
            }
            if (attr) {
                return o?.attributes[attr];
            }
            return o.cdata || o.text;
        }
    }
}

export const SPECIFICATIONS = {
    // Standards
    /** @link https://wikipedia.org/wiki/Atom_(Web_standard)#Example_of_an_Atom_1.0_feed */
    ATOM: {
        // rfc4287
        name: 'Atom 1.0',
        ruler: 'FEED(XMLNS=http://www.w3.org/2005/Atom)',
        maps: {
            title: 'feed.title',
            date: 'feed.updated',
            description: 'feed.subtitle',
            favicon: undefined,
            link: 'feed.link$href',
            ttl: undefined,
            'story.title': 'feed.entry.title',
            'story.date': ['feed.entry.published', 'feed.entry.updated'],
            'story.desc': 'feed.entry.summary',
            'story.description': 'feed.entry.content',
            'story.link': 'feed.entry.link$href',
            'story.author': 'feed.entry.author.name',
        },
    },
    /** @link https://www.rssboard.org/rss-specification */
    RSS: {
        name: 'RSS 2.0',
        ruler: 'RSS(VERSION=2.0)>CHANNEL',
        maps: {
            title: 'rss.channel.title',
            date: ['rss.channel.pubDate', 'rss.channel.lastBuildDate'],
            description: 'rss.channel.description',
            favicon: 'rss.channel.image.url',
            link: 'rss.channel.link',
            ttl: 'rss.channel.ttl',

            'story.title': 'rss.channel.item.title',
            'story.date': 'rss.channel.item.pubDate',
            'story.desc': undefined,
            'story.description': 'rss.channel.item.description',
            'story.link': 'rss.channel.item.link',
            'story.author': 'rss.channel.item.author',
        },
    },
    // Third parties...
};

export default function parseRSS(xml) {
    const parser = new RSSParser();

    parser.write(xml);
    parser.close();

    return parser.result;
}
