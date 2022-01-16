export const BASE_SPACE = 12;
export const GOLD_RATIO = 0.618;
const FONT_SIZE = 16;
const FONT_HEIGHT = 20;

const FONT_SIZE_SMALL = FONT_SIZE * 0.875;
const PADDING = BASE_SPACE;
const MARGIN = BASE_SPACE;
const M_SIZE = BASE_SPACE * 2; // Most common used size, eg: icon, list item minHeight...

export default {
    // Use namespace for extendable
    normal: {
        baseSpace: BASE_SPACE,
        goldRatio: GOLD_RATIO,
        mSize: M_SIZE,

        padding: PADDING,
        margin: MARGIN,

        fontSize: FONT_SIZE,
        fontHeight: FONT_HEIGHT,
        fontSizeSmall: FONT_SIZE_SMALL,

        // Special typos
        h1: {
            marginBottom: MARGIN / GOLD_RATIO,
            fontSize: FONT_SIZE * 1.5,
            lineHeight: FONT_SIZE * 1.5 * 1.375,
            fontWeight: 'bold',
        },
        h2: {
            marginBottom: MARGIN / GOLD_RATIO,
            fontSize: FONT_SIZE * 1.125,
            lineHeight: FONT_SIZE * 1.125 * 1.375,
            fontWeight: '600',
        },
    },
};
