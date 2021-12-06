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
        linkColor: light.accent.fg,
        primaryColor: light.scale.orange[4],
        dangerColor: light.danger.fg,

        /**
         * Bottom tabs is a little darker than background
         */
        bottomTabsBackground: light.canvas.inset,
        touchHighlight: light.neutral.subtle,
        touchFeedback: undefined, // on Android
        bgStoryTopbar: light.canvas.default,
        bgModalBody: light.canvas.default,
        bgPaperInset: light.scale.gray[1],
        // bgDisabled: light.neutral.muted,

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
    },
    dark: {
        id: 'dark',
        background: dark.canvas.default,
        fontColor: dark.fg.default,
        borderColor: dark.border.default,
        fontColorSecond: dark.fg.muted,
        fontColorHead: '#ffffff',
        linkColor: dark.accent.fg,
        primaryColor: dark.scale.orange[4],
        dangerColor: dark.danger.fg,

        bottomTabsBackground: dark.canvas.inset,
        touchHighlight: dark.neutral.subtle,
        touchFeedback: dark.neutral.muted,
        bgStoryTopbar: dark.scale.gray[7],
        bgModalBody: dark.scale.gray[7],
        bgPaperInset: dark.scale.black,
        // bgDisabled: dark.neutral.muted,

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
    },
};

/** Current theme type of APP */
export const AppTheme = {
    current: 'main',
};
