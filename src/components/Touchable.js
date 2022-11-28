import React, { useContext, useMemo } from 'react';
import {
    TouchableHighlight,
    TouchableNativeFeedback,
    Platform,
} from 'react-native';

import { AppContext } from '../AppContext.js';

/**
 * @param {import('react-native').TouchableHighlightProps} props
 */
export function TouchHighlight(props) {
    const { theme } = useContext(AppContext);
    return (
        <TouchableHighlight
            underlayColor={theme.touchHighlight}
            activeOpacity={1}
            {...props}
        />
    );
}

/**
 * @param {import('react-native').TouchableNativeFeedbackProps} props
 */
function NativeFeedback(props) {
    const { theme: { touchFeedback } } = useContext(AppContext);
    const background = useMemo(() => touchFeedback
        && TouchableNativeFeedback.Ripple(touchFeedback, false),
    [touchFeedback]);
    return (
        <TouchableNativeFeedback background={background} {...props} />
    );
}

/**
 * Touchable
 *
 * Use native feedback on Android, highlight on iOS.
 */
export default Platform.select({
    android: NativeFeedback,
    ios: TouchHighlight,
});
