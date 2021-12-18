import React, { useContext } from 'react';
import { Text, Linking, TouchableWithoutFeedback } from 'react-native';
import { Navigation } from 'react-native-navigation';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import { AppContext } from '../AppContext.js';
import { TouchHighlight } from './Touchable.js';
import { tabIDs } from '../pages/IDSymbols.js';
import aps from '../AppSettings.js';
import { themes } from '../themes/index.js';


/**
 * Open link in app
 * 
 * 1. switch tab
 * 2. in-app route
 * 3. web url which starts with `http`
 * 
 * In others case, call `Linking.openURL` directly.
 */
export default function Link(props) {
    const { children, style, to, data = {} } = props;
    const { typo, theme } = useContext(AppContext);
    const linkStyles = {
        color: theme.linkColor,
        fontSize: typo.fontSize,
        lineHeight: typo.fontHeight,
    };
    const onPress = () => {
        // Switch tab
        if (tabIDs.indexOf(to) > -1) {
            Navigation.mergeOptions(tabIDs[0], {
                bottomTabs: { currentTabId: to },
            });
            return;
        }
        if (to) {
            // Navigate to app's route
            if (typeof to === 'symbol') {
                Navigation.push('root', {
                    component: {
                        name: to,
                        passProps: {
                            route: data,
                        },
                    },
                });
                return;
            }
            // Open web url
            if (to.startsWith('http')) {
                openLink(to);
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

        InAppBrowser.open(url, {
            showTitle: true,
            showInRecents: false,
            toolbarColor: background,
        });
        return;
    }
    Linking.openURL(url);
}
