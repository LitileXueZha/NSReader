import { AppRegistry, Platform, UIManager, LogBox } from 'react-native';
import { Navigation } from 'react-native-navigation';

import registerRoutes from './routes.js';
import { getDefaultOptions, DEFAULT_ROOT } from './options.js';
import { configureNotification } from './utils/notification.js';
import AppSettings from './AppSettings.js';


export default function launchApp() {
    registerRoutes();
    Navigation.events().registerAppLaunchedListener(async () => {
        await AppSettings.init();

        console.log('launched!');
        Navigation.setDefaultOptions(getDefaultOptions());
        Navigation.setRoot(DEFAULT_ROOT);

        // Configure app notification
        configureNotification((data) => {
            console.log(data);
        });
    });

    // Enable layout animations on android
    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    if (__DEV__) {
        LogBox.ignoreLogs(['NativeEventEmitter']);
    }
}
