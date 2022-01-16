/**
 * Transform app theme to css styles
 * 
 * @param {*} context
 * @returns {string}
 */
export default function themeStyles(context) {
    const { theme, typo } = context;

    return `
        body,html {
            font-size: ${typo.fontSize}px;
            color: ${theme.fontColor};
        }
        body { padding: ${typo.padding}px }
        img,video,audio,iframe {
            max-width: calc(100% + ${typo.padding * 2}px);
            margin-left: -${typo.padding}px;
            margin-right: -${typo.padding}px;
        }
        a { color: ${theme.linkColor} }
        h1,h2,h3,h4 {
            ${stylesToCSS(typo.h2)}
            font-weight: bold;
        }
    `;
}

function stylesToCSS(obj) {
    const css = [];
    const reg = /[A-Z]/g;
    // eslint-disable-next-line guard-for-in
    for (const name in obj) {
        const nameLoweCase = name.replace(reg, (val) => `-${val.toLowerCase()}`);
        let value = obj[name];
        if (typeof value === 'number') {
            value += 'px';
        }
        css.push(`${nameLoweCase}:${value};`);
    }
    return css.join('');
}
