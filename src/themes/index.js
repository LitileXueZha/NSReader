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

        /**
         * Bottom tabs is a little darker than background
         */
        bottomTabsBackground: light.canvas.inset,
        touchHighlight: light.neutral.subtle,
        touchFeedback: undefined, // on Android
        bgStoryTopbar: light.canvas.default,
        bgModalBody: light.canvas.default,
        // bgDisabled: light.neutral.muted,
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

        bottomTabsBackground: dark.canvas.inset,
        touchHighlight: dark.neutral.subtle,
        touchFeedback: dark.neutral.muted,
        bgStoryTopbar: dark.scale.gray[7],
        bgModalBody: dark.scale.gray[7],
        // bgDisabled: dark.neutral.muted,
    },
};

/** Current theme type of APP */
export const AppTheme = {
    current: 'main',
};
