import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons.js';

import { TABRSS, TABSettings, TABStory } from './pages/IDSymbols.js';
import icTab from '../assets/ic_tab.png';
import icTabSelected from '../assets/ic_tab_selected.png';
import registerRoutes from './routes.js';
import { APP_DEFAULT } from './options.js';
import { themes } from './themes';

const theme = themes.main;
const iconStory = Icon.getImageSourceSync('reader-outline', 128);
const iconStoryEd = Icon.getImageSourceSync('reader', 128);
const iconRss = Icon.getImageSourceSync('albums-outline', 128);
const iconRssEd = Icon.getImageSourceSync('albums', 128);
const iconSettings = Icon.getImageSourceSync('settings-outline', 128);
const iconSettingsEd = Icon.getImageSourceSync('settings', 128);

/** @type {import('react-native-navigation').LayoutTabsChildren} */
const TAB_STORY = {
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
/** @type {import('react-native-navigation').LayoutTabsChildren} */
const TAB_RSS = {
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
/** @type {import('react-native-navigation').LayoutTabsChildren} */
const TAB_SETTINGS = {
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

/** @type {import('react-native-navigation').LayoutRoot} */
const ROOT = {
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

export default function launchApp() {
    registerRoutes();
    Navigation.setDefaultOptions(APP_DEFAULT);
    Navigation.events().registerAppLaunchedListener(() => {
        Navigation.setRoot(ROOT);
    });
}
