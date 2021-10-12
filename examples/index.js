import { StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Components from './RNComponents.js';
import API from './API.js';
import Typography from './Typography.js';
import { registerTheme, themes } from './themes';
import iconTab from '../assets/ic_tab.png';
import iconTabSelected from '../assets/ic_tab_selected.png';

Navigation.registerComponent('com', registerTheme(Components), () => Components);
Navigation.registerComponent('api', registerTheme(API), () => API);
Navigation.registerComponent('typ', registerTheme(Typography), () => Typography);
Navigation.setDefaultOptions({
    layout: {
        componentBackgroundColor: themes.main.background,
    },
    bottomTabs: {
        currentTabIndex: 1,
        animate: false,
        animateTabSelection: false,
        tabsAttachMode: 'onSwitchToTab',
        borderColor: themes.dark.borderColor,
        borderWidth: StyleSheet.hairlineWidth,
        preferLargeIcons: true,
    },
    bottomTab: {
        fontSize: themes.main.fontSizeSmall,
        selectedFontSize: themes.main.fontSizeSmall,
        textColor: themes.main.fontColorSecond,
        selectedTextColor: themes.main.fontColor,
    },
});

const routes = {
    bottomTabs: {
        children: [{
            stack: {
                children: [{
                    component: { id: 'api', name: 'api' },
                }],
                options: {
                    topBar: {
                        visible: false,
                    },
                    bottomTab: {
                        text: 'API',
                        icon: iconTab,
                        selectedIcon: iconTabSelected,
                    },
                },
            },
        }, {
            stack: {
                children: [{
                    component: { id: 'com', name: 'com' },
                }],
                options: {
                    topBar: {
                        visible: false,
                    },
                    bottomTab: {
                        text: 'Components',
                        icon: iconTab,
                        selectedIcon: iconTabSelected,
                    },
                },
            },
        }, {
            stack: {
                children: [{
                    component: { id: 'typ', name: 'typ' },
                }],
                options: {
                    topBar: {
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
    Navigation.events().registerAppLaunchedListener(() => {
        Navigation.setRoot({
            root: routes,
        });
    });
}
