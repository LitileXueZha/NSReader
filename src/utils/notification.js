import { Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { Importance } from 'react-native-push-notification';

const channelId = 'app_default_channel';
let _configured = false;

/**
 * @param {function} fnNotify
 */
export function configureNotification(fnNotify) {
    // RNN registerAppLaunched to receive initial notification
    PushNotification.popInitialNotification((notification) => {
        if (!notification) return;

        const { payload } = notification.data;
        fnNotify(payload);
    });

    // Configure only once
    if (_configured) return;
    if (Platform.OS === 'android') {
        PushNotification.channelExists(channelId, (exists) => {
            if (exists) {
                return;
            }

            PushNotification.createChannel({
                channelId,
                channelName: 'Default',
                playSound: true,
                importance: Importance.DEFAULT,
                vibrate: false,
            });
        });
    }
    // PushNotification.getChannels((ids) => console.log(ids));
    PushNotification.configure({
        onNotification(notification) {
            const { payload } = notification.data;
            fnNotify(payload);
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        popInitialNotification: false,
        requestPermissions: Platform.OS === 'ios',
    });
    _configured = true;
}

/**
 * Create a notification for user
 *
 * Make sure `configureNotification` has been called.
 * Follow the HTML5 Notification API.
 *
 * @type {Notification}
 */
export default function Notification(title, options) {
    const { body, data } = options;
    PushNotification.localNotification({
        channelId,
        title,
        message: body,
        playSound: false,
        userInfo: { payload: data },
    });
}
