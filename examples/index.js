import { StyleSheet, Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Components from './RNComponents.js';
import API from './API.js';
import Typography from './Typography.js';
import { registerTheme, themes } from './themes';
import iconTab from '../assets/ic_tab.png';
import iconTabSelected from '../assets/ic_tab_selected.png';
import './pages/RNActivityIndicator.js';

Navigation.registerComponent('com', registerTheme(Components), () => Components);
Navigation.registerComponent('api', registerTheme(API), () => API);
Navigation.registerComponent('typ', registerTheme(Typography), () => Typography);
Navigation.setDefaultOptions({
    topBar: { visible: false },
    layout: {
        componentBackgroundColor: themes.main.background,
    },
    bottomTabs: {
        currentTabIndex: 1,
        animate: false,
        animateTabSelection: false,
        tabsAttachMode: 'onSwitchToTab',
        borderColor: themes.main.borderColor,
        borderWidth: StyleSheet.hairlineWidth,
        preferLargeIcons: true,
    },
    bottomTab: {
        fontSize: themes.main.fontSizeSmall,
        selectedFontSize: themes.main.fontSizeSmall,
        textColor: themes.main.fontColorSecond,
        selectedTextColor: themes.main.fontColor,
    },
    animations: {
        push: {
            content: {
                translationX: {
                    from: Dimensions.get('window').width,
                    to: 0,
                    duration: 200,
                },
            },
        },
        pop: {
            content: {
                translationX: {
                    from: 0,
                    to: Dimensions.get('window').width,
                    duration: 200,
                },
            },
        },
    },
});

const tabs = {
    bottomTabs: {
        children: [{
            component: {
                id: 'api',
                name: 'api',
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
                id: 'com',
                name: 'com',
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
                id: 'typ',
                name: 'typ',
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
    Navigation.events().registerAppLaunchedListener(() => {
        Navigation.setRoot({
            root: {
                stack: {
                    id: 'root',
                    children: [tabs],
                },
            },
        });
    });
}
