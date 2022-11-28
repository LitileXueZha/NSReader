import { Platform } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';

import Notification from './utils/notification.js';

const INTERVAL_DATA_FETCH = 24 * 60; // 1 day
let configured = false;
/**
 * Background tasks
 *
 * There are much differences with unix-cron:
 * + it not works when app is cleaned by user (especially on Android, used to release the memory)
 * + only 30s can be run on iOS
 * + less headless
 * + strange behaviours
 *
 * Conclusion: try to let user be sticky with app, then could
 * do better tasks rather than in background.
 *
 * ```shell
 * adb logcat *:S ReactNative:V ReactNativeJS:V TSBackgroundFetch:V
 * adb shell cmd jobscheduler run -f com.nsreader 999
 * adb shell am broadcast -a com.nsreader.event.BACKGROUND_FETCH
 * ```
 */
export default function configureBackgroundTasks() {
    if (configured) {
        return;
    }

    configured = true;
    BackgroundFetch.configure({
        minimumFetchInterval: 15,
        // minimumFetchInterval: INTERVAL_DATA_FETCH,
        // Android
        enableHeadless: true,
        stopOnTerminate: false, // important for headless task
    }, onTaskStart, onTimeout);
    // Android background
    if (Platform.OS === 'android') {
        BackgroundFetch.registerHeadlessTask(async ({ taskId, timeout }) => {
            if (timeout) {
                onTimeout(taskId);
                return;
            }
            onTaskStart(taskId);
        });
    }
}

async function onTimeout(taskId) {
    BackgroundFetch.finish(taskId);
}

async function onTaskStart(taskId) {
    await rssUpdateTask();
    BackgroundFetch.finish(taskId);
}

async function rssUpdateTask() {
    new Notification('后台任务', { body: '更新中...' });
}
