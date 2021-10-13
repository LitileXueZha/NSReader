import { Platform } from 'react-native';

export { default as Event } from './Event.js';

export function rnVersion() {
    const { major, minor, patch } = Platform.constants.reactNativeVersion;
    return `${major}.${minor}.${patch}`;
}
