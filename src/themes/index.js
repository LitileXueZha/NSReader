import colors from '@primer/primitives/dist/js/colors';
import light from '@primer/primitives/dist/js/colors/light.js';
import dark from '@primer/primitives/dist/js/colors/dark.js';

import iconEmpty from '../../assets/empty.png';
import iconEmptyDark from '../../assets/empty_dark.png';

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
        linkColor: light.accent.fg,
        primaryColor: '#FFA733',
        dangerColor: light.danger.fg,
        successColor: light.success.fg,

        /**
         * Bottom tabs is a little darker than background
         */
        bottomTabsBackground: light.canvas.inset,
        touchHighlight: light.neutral.subtle,
        touchFeedback: undefined, // on Android
        bgModalBody: light.canvas.default,
        bgPaperInset: light.scale.gray[1],
        // bgDisabled: light.neutral.muted,
        bgRSSHelp: light.success.subtle,
        bgStoryFlag: light.attention.muted,
        bgStoryDetailOnRSS: light.canvas.subtle,

        /**
         * Several colors
         *
         * Used to generate a random color when channel's image load failed.
         */
        randomColors: [
            light.neutral.emphasis,
            light.accent.emphasis,
            light.success.emphasis,
            light.attention.emphasis,
            light.severe.emphasis,
            light.danger.emphasis,
            light.done.emphasis,
            light.sponsors.emphasis,
        ],
        fgOnPaper: light.fg.onEmphasis,
        imgIcons: {
            empty: iconEmpty,
        },
    },
    dark: {
        id: 'dark',
        background: dark.canvas.default,
        fontColor: dark.fg.default,
        borderColor: dark.border.default,
        fontColorSecond: dark.fg.muted,
        fontColorHead: '#ffffff',
        linkColor: dark.accent.fg,
        primaryColor: '#FFA733',
        dangerColor: dark.danger.emphasis,
        successColor: dark.success.emphasis,

        bottomTabsBackground: dark.canvas.inset,
        touchHighlight: dark.neutral.subtle,
        touchFeedback: dark.neutral.muted,
        bgModalBody: dark.scale.gray[7],
        bgPaperInset: dark.scale.black,
        // bgDisabled: dark.neutral.muted,
        bgRSSHelp: dark.success.subtle,
        bgStoryFlag: dark.attention.muted,
        bgStoryDetailOnRSS: dark.canvas.subtle,

        randomColors: [
            dark.neutral.emphasis,
            dark.accent.emphasis,
            dark.success.emphasis,
            dark.attention.emphasis,
            dark.severe.emphasis,
            dark.danger.emphasis,
            dark.done.emphasis,
            dark.sponsors.emphasis,
        ],
        fgOnPaper: dark.fg.onEmphasis,
        imgIcons: {
            empty: iconEmptyDark,
        },
    },
};
/**
 * Button themes
 */
export const buttons = {
    main: {
        default: {
            color: themes.main.fontColor,
            /** gradient colors */
            bg: [light.scale.gray[0], light.scale.gray[1]],
        },
        primary: {
            color: '#fff',
            bg: ['#FFA733', '#D39940'], // ORANGE, ORANGE_DARK
            borderColor: 'transparent',
        },
    },
    dark: {
        default: {
            color: themes.dark.fontColor,
            bg: [dark.scale.gray[6], dark.scale.gray[7]],
        },
        primary: {
            color: '#fff',
            bg: ['#FFA733', '#D39940'],
            borderColor: 'transparent',
        },
    },
};
/**
 * Page specify themes
 */
export const pages = {
    main: {
        story: {
            fgRead: '#24292f84',
            flag: light.attention.muted,
            flagSuccess: light.success.emphasis,
        },
        rss: {
            bgTotal: light.success.subtle,
        },
    },
    dark: {
        story: {
            fgRead: dark.fg.muted,
            flag: dark.attention.muted,
            flagSuccess: dark.success.emphasis,
        },
        rss: {
            bgTotal: dark.success.subtle,
        },
    },
};

/** Current theme type of APP */
export const AppTheme = {
    current: 'main',
};
