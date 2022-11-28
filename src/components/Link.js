import React, { useContext } from 'react';
import { Text, Linking, TouchableWithoutFeedback } from 'react-native';
import { Navigation } from 'react-native-navigation';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import { AppContext } from '../AppContext.js';
import { TouchHighlight } from './Touchable.js';
import { tabIDs } from '../pages/IDSymbols.js';
import aps from '../AppSettings.js';
import { themes } from '../themes/index.js';
import Perf from '../utils/Perf.js';


/**
 * Open link in app
 *
 * 1. switch tab
 * 2. in-app route
 * 3. web url which starts with `http`
 *
 * In others case, call `Linking.openURL` directly.
 *
 * @param {import('react-native').TextProps} props
 */
export default function Link(props) {
    const {
        children,
        style,
        to,
        underline,
        data = {},
    } = props;
    const { typo, theme } = useContext(AppContext);
    const linkStyles = {
        color: theme.linkColor,
        fontSize: typo.fontSize,
        lineHeight: typo.fontHeight,
        textDecorationLine: underline ? 'underline' : 'none',
    };
    const onPress = () => {
        if (!to) return;
        const inApp = goto(to, data);
        if (!inApp) {
            // Open web url
            if (to.startsWith('http')) {
                openLink(to).catch(Perf.error);
            }
        }
    };

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Text style={[linkStyles, style]}>{children}</Text>
        </TouchableWithoutFeedback>
    );
}

/**
 * Open a link (with settings configured)
 *
 * @param {string} url
 */
export function openLink(url) {
    const chromeTab = aps.get('settings.chrometab');

    if (chromeTab) {
        const theme = aps.get('theme');
        const { background } = themes[theme];

        return InAppBrowser.open(url, {
            showTitle: true,
            showInRecents: false,
            toolbarColor: background,
        });
    }
    return Linking.openURL(url);
}

/**
 * Navigate to a app page
 *
 * @param {symbol|string} to app's route id
 * @param {object} data passed data at `props.route`
 * @returns {boolean} is in-app page
 */
export function goto(to, data = {}) {
    // Switch tab
    if (tabIDs.indexOf(to) > -1) {
        // On easy mode, tabs are hidden. Navigate to pure page
        if (aps.get('settings.easymode')) {
            pushToRoot();
            return true;
        }
        Navigation.mergeOptions('id_bottomTabs', {
            bottomTabs: { currentTabId: to },
        });
        return true;
    }
    // Navigate to app's route
    if (typeof to === 'symbol') {
        pushToRoot();
        return true;
    }
    return false;

    function pushToRoot() {
        Navigation.push('root', {
            component: {
                name: to,
                passProps: {
                    route: data,
                },
            },
        }).catch(Perf.error);
    }
}

/**
 * Navigate back to previous page
 */
export function goBack() {
    Navigation.pop('root').catch(Perf.error);
}
