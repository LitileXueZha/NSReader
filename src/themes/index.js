import {
    WHITE,
    BLACK,
    BORDER,
    BLACK_BRIGHT,
    WHITE_DARK,
    BLACK_DARK,
    BLUE,
    BLUE_BRIGHT,
} from './colors.js';
import colors from '@primer/primitives/dist/js/colors';
import light from '@primer/primitives/dist/js/colors/light.js';
import dark from '@primer/primitives/dist/js/colors/dark.js';

/**
 * Support types: `main`, `dark`
 * 
 * Pick the colors from https://primer.style/primitives/colors.
 */
export const themes = {
    main: {
        id: 'main',
        background: light.canvas.default,
        fontColor: light.fg.default,
        borderColor: light.border.default,
        fontColorSecond: light.scale.gray[4],
        fontColorHead: '#000000',
        linkColor: BLUE,

        /**
         * Bottom tabs is a little darker than background
         */
        bottomTabsBackground: light.canvas.overlay,
    },
    dark: {
        id: 'dark',
        background: dark.canvas.overlay,
        fontColor: dark.fg.default,
        borderColor: dark.border.default,
        fontColorSecond: dark.fg.muted,
        fontColorHead: WHITE,
        linkColor: BLUE_BRIGHT,

        bottomTabsBackground: dark.canvas.default,
    },
};

/** Current theme type of APP */
export const AppTheme = {
    current: 'main',
};
