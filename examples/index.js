import { StyleSheet, Dimensions, ToastAndroid } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { themes } from './themes';
import TYPO from './themes/typography.js';
import iconTab from '../assets/ic_tab.png';
import iconTabSelected from '../assets/ic_tab_selected.png';
import {
    TABAPI,
    TABComponents,
    TABTypography,
    IDTestOnly,
} from './IDSymbols.js';
import registerRoutes from './routes.js';

const APP_ROOT = 'root'; // Root stack id
const APP_NAV_DURATION = 250; // Screen switch animations duration
const APP_WINDOW_WIDTH = Dimensions.get('window').width;
/**
 * The app default options
 * 
 * @type {import('react-native-navigation').Options}
 */
const APP_DEFAULT = {
    statusBar: {
        backgroundColor: themes.main.background,
    },
    topBar: { visible: false },
    layout: {
        componentBackgroundColor: themes.main.background,
    },
    bottomTabs: {
        currentTabId: 'com',
        animate: false,
        animateTabSelection: false,
        tabsAttachMode: 'onSwitchToTab',
        borderColor: themes.main.borderColor,
        borderWidth: StyleSheet.hairlineWidth,
        preferLargeIcons: true,
        titleDisplayMode: 'alwaysShow',
    },
    bottomTab: {
        fontSize: TYPO.normal.fontSizeSmall,
        selectedFontSize: TYPO.normal.fontSizeSmall,
        textColor: themes.main.fontColorSecond,
        selectedTextColor: themes.main.fontColor,
    },
    animations: {
        push: {
            // waitForRender: true,
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
/**
 * The app's tab
 * 
 * @type {import('react-native-navigation').Layout}
 */
const APP_TABS = {
    bottomTabs: {
        children: [{
            component: {
                id: IDTestOnly,
                name: IDTestOnly,
                options: {
                    bottomTab: {
                        text: 'Test',
                        icon: iconTab,
                        selectedIcon: iconTabSelected,
                    },
                },
            },
        }, {
            component: {
                id: TABAPI,
                name: TABAPI,
                options: {
                    bottomTab: {
                        text: 'API',
                        icon: iconTab,
                        selectedIcon: iconTabSelected,
                    },
                },
            },
        }, {
            component: {
                id: TABComponents,
                name: TABComponents,
                options: {
                    bottomTab: {
                        text: 'Components',
                        icon: iconTab,
                        selectedIcon: iconTabSelected,
                    },
                },
            },
        }, {
            component: {
                id: TABTypography,
                name: TABTypography,
                options: {
                    topBar: {
                        visible: true,
                        title: { text: 'Typography' },
                        subtitle: { text: 'some text for type' },
                        backButton: { visible: true },
                        rightButtons: [{ text: 'Menu' }],
                    },
                    bottomTab: {
                        text: 'Typography',
                        icon: iconTab,
                        selectedIcon: iconTabSelected,
                    },
                },
            },
        }],
    },
};

export default function startApp() {
    registerRoutes();
    // Set defaults
    Navigation.setDefaultOptions(APP_DEFAULT);

    Navigation.events().registerAppLaunchedListener(() => {
        Navigation.setRoot({
            root: {
                stack: {
                    id: APP_ROOT,
                    children: [APP_TABS],
                },
            },
        });
    });
}
