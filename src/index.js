import Perf from './utils/Perf.js';
import React from 'react';
import { AppRegistry, Platform, UIManager, LogBox } from 'react-native';
import { Navigation } from 'react-native-navigation';

import registerRoutes from './routes.js';
import { getDefaultOptions, DEFAULT_ROOT, loadTabIcons } from './options.js';
import { configureNotification } from './utils/notification.js';
import AppSettings from './AppSettings.js';
import configureBackgroundTasks from './BackgroundTasks.js';


export default function launchApp() {
    registerRoutes();
    Navigation.events().registerAppLaunchedListener(async () => {
        await AppSettings.init();

        Navigation.setDefaultOptions(getDefaultOptions());
        Navigation.setRoot(DEFAULT_ROOT);
        Perf.info('Launched!');

        loadTabIcons();
        // Configure app notification
        configureNotification((data) => {
            console.log(data);
        });
    });
    configureBackgroundTasks();

    // Enable layout animations on android
    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    if (__DEV__) {
        LogBox.ignoreLogs(['NativeEventEmitter']);
        // require('@welldone-software/why-did-you-render')(React, {
        //     trackAllPureComponents: true,
        //     trackHooks: false, // Some issues when fast refresh, disabled
        //     // exclude: [/FlatList/],
        // });
    }
}
