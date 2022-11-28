import React, {
    useContext, useEffect, useRef, useState,
} from 'react';
import {
    StyleSheet,
    Animated,
    Easing,
    LayoutAnimation,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../AppContext.js';

import Touchable from './Touchable.js';

function ScrollToTop(props) {
    const { theme, typo } = useContext(AppContext);
    const { visible, onPress, style } = props;
    const scale = useRef(new Animated.Value(visible ? 1 : 0)).current;
    // const [right, setRight] = useState(visible ? 24 : -48);

    useEffect(() => {
        // https://reactnative.dev/docs/animations#caveats
        Animated.timing(scale, {
            toValue: visible ? 1 : 0,
            duration: 250,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            isInteraction: false,
        }).start();
    }, [visible]);

    return (
        <Touchable onPress={onPress}>
            <Animated.View style={[css.btn, { backgroundColor: theme.bgModalBody, transform: [{ scale }] }, style]}>
                <Icon name="chevron-up" size={typo.mSize} color={theme.fontColorSecond} />
            </Animated.View>
        </Touchable>
    );
}
const css = StyleSheet.create({
    btn: {
        position: 'absolute',
        right: 24,
        bottom: 48,
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        elevation: 10,
        overflow: 'hidden',
    },
});

/**
 * Define how to show the button
 *
 * Bind in the class constructor,
 * eg: `this.onScroll = setScrollTop.bind(this)`
 * @param {any} e
 */
export function setScrollTop(e) {
    const { contentOffset, velocity } = e.nativeEvent;
    const { y } = contentOffset;
    const { scrollTop } = this.state;

    if (scrollTop && velocity.y > 0) {
        this.setState({ scrollTop: false });
    } else if (!scrollTop && velocity.y < -5 && y > 375) {
        this.setState({ scrollTop: true });
    }
}

function areEqual(prevProps, nextProps) {
    if (prevProps.visible !== nextProps.visible) {
        return false;
    }
    return true;
}

export default React.memo(ScrollToTop, areEqual);
