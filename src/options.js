/**
 * A hack for `Navigation.setDefaultOptions`
 * 
 * WHY? RNN's setDefaultOptions will reset previous options.
 * We have to save the options in memory, and merge it when
 * the default options changed.
 */

import { StyleSheet, Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { themes } from './themes';
import TYPO from './themes/typography.js';

const theme = themes.main;
const APP_NAV_DURATION = 250; // Screen switch animations duration
const APP_WINDOW_WIDTH = Dimensions.get('window').width;
/**
 * The app default options
 * 
 * @type {import('react-native-navigation').Options}
 */
export const APP_DEFAULT = {
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
            content: {
                enter: {
                    translationX: {
                        from: APP_WINDOW_WIDTH,
                        to: 0,
                        duration: APP_NAV_DURATION,
                    },
                },
                exit: {
                    translationX: {
                        from: 0,
                        to: -APP_WINDOW_WIDTH / 8,
                        duration: APP_NAV_DURATION,
                    },
                },
            },
        },
        pop: {
            content: {
                enter: {
                    translationX: {
                        from: -APP_WINDOW_WIDTH / 8,
                        to: 0,
                        duration: APP_NAV_DURATION,
                    },
                },
                exit: {
                    translationX: {
                        from: 0,
                        to: APP_WINDOW_WIDTH,
                        duration: APP_NAV_DURATION,
                    },
                },
            },
        },
    },
};

export default function mergeOptions(newOptions) {

}
