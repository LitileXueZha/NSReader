/**
 * A hack for `Navigation.setDefaultOptions`
 * 
 * WHY? RNN's setDefaultOptions will reset previous options.
 * We have to save the options in memory, and merge it when
 * the default options changed.
 */

import { StyleSheet, Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons.js';

import aps from './AppSettings.js';
import { themes } from './themes';
import { TABRSS, TABSettings, TABStory } from './pages/IDSymbols.js';
import TYPO from './themes/typography.js';

export function getDefaultOptions() {
    const theme = themes[aps.get('theme')] || themes.main;
    const ANIM_NAV_DURATION = 250; // Screen switch animations duration
    /**
     * When device orientation changed, the animation width
     * should changed too.
     * 
     * This is a little problem, use constant value will cause animation
     * a bit fast or slow.
     */
    const ANIM_WINDOW_WIDTH = Dimensions.get('window').width;

    /** @type {import('react-native-navigation').Options} */
    const DEFAULT_OPTIONS = {
        statusBar: {
            backgroundColor: theme.background,
        },
        topBar: { visible: false },
        layout: {
            componentBackgroundColor: theme.background,
        },
        bottomTabs: {
            backgroundColor: theme.bottomTabsBackground,
            animate: false,
            // animateTabSelection: false,
            tabsAttachMode: 'onSwitchToTab',
            borderColor: theme.borderColor,
            borderWidth: StyleSheet.hairlineWidth,
            preferLargeIcons: true,
            titleDisplayMode: 'alwaysShow',
        },
        bottomTab: {
            iconColor: theme.fontColorSecond,
            selectedIconColor: theme.fontColor,
            fontSize: TYPO.normal.fontSizeSmall,
            selectedFontSize: TYPO.normal.fontSizeSmall,
            textColor: theme.fontColorSecond,
            selectedTextColor: theme.fontColor,
        },
        animations: {
            push: {
                waitForRender: true,
                content: {
                    enter: {
                        translationX: {
                            from: ANIM_WINDOW_WIDTH,
                            to: 0,
                            duration: ANIM_NAV_DURATION,
                        },
                    },
                    exit: {
                        translationX: {
                            from: 0,
                            to: -ANIM_WINDOW_WIDTH / 8,
                            duration: ANIM_NAV_DURATION,
                        },
                    },
                },
            },
            pop: {
                content: {
                    enter: {
                        translationX: {
                            from: -ANIM_WINDOW_WIDTH / 8,
                            to: 0,
                            duration: ANIM_NAV_DURATION,
                        },
                    },
                    exit: {
                        translationX: {
                            from: 0,
                            to: ANIM_WINDOW_WIDTH,
                            duration: ANIM_NAV_DURATION,
                        },
                    },
                },
            },
        },
    };

    return DEFAULT_OPTIONS;
}

const iconStory = Icon.getImageSourceSync('reader-outline', 128);
const iconStoryEd = Icon.getImageSourceSync('reader', 128);
const iconRss = Icon.getImageSourceSync('albums-outline', 128);
const iconRssEd = Icon.getImageSourceSync('albums', 128);
const iconSettings = Icon.getImageSourceSync('settings-outline', 128);
const iconSettingsEd = Icon.getImageSourceSync('settings', 128);

const TAB_STORY = {
    /** @type {import('react-native-navigation').LayoutComponent} */
    component: {
        id: TABStory,
        name: TABStory,
        options: {
            bottomTab: {
                text: '阅读',
                icon: iconStory,
                selectedIcon: iconStoryEd,
            },
        },
    },
};
const TAB_RSS = {
    /** @type {import('react-native-navigation').LayoutComponent} */
    component: {
        id: TABRSS,
        name: TABRSS,
        options: {
            bottomTab: {
                text: 'RSS源',
                icon: iconRss,
                selectedIcon: iconRssEd,
            },
        },
    },
};
const TAB_SETTINGS = {
    /** @type {import('react-native-navigation').LayoutComponent} */
    component: {
        id: TABSettings,
        name: TABSettings,
        options: {
            bottomTab: {
                text: '设置',
                icon: iconSettings,
                selectedIcon: iconSettingsEd,
            },
        },
    },
};

/**
 * The app root of RNN
 * 
 * With a built-in stack id: `root`, all navigations should be pushed
 * into it.
 * 
 * @example
 * ```javascript
 * Navigation.push('root', ...);
 * ```
 * 
 * @type {import('react-native-navigation').LayoutRoot}
 */
export const DEFAULT_ROOT = {
    root: {
        stack: {
            id: 'root',
            children: [{
                bottomTabs: {
                    children: [TAB_STORY, TAB_RSS, TAB_SETTINGS],
                },
            }],
        },
    },
};

export default function mergeOptions(newOptions) {

}
