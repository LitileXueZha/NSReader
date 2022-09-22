import React, {
    useContext, useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import {
    Animated,
    Modal,
    PanResponder,
    Pressable,
    StatusBar,
    StyleSheet,
    View,
    Vibration,
    TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../../AppContext.js';
import aps from '../../AppSettings.js';
import Button from '../../components/Button.js';
import C from '../../components/globalCSSStyles.js';
import { goto } from '../../components/Link.js';
import Text from '../../components/SText.js';
import Touchable from '../../components/Touchable.js';
import { TABRSS, TABSettings } from '../IDSymbols.js';
import { TOPBAR_SPACE } from './Topbar.js';

const KEY = 'settings.easymode';

/**
 * PanResponder
 * @link https://reactnative.dev/docs/gesture-responder-system
 * @link https://reactnative.dev/docs/panresponder
 * @link https://reactnative.dev/docs/animations#panresponder-with-animated-event-example
 */

export function createPanResponder(featInstance) {
    if (!aps.get(KEY)) {
        return {};
    }

    let panning = false;
    const panRes = PanResponder.create({
        onStartShouldSetPanResponder() {
            return aps.get(KEY);
        },
        onMoveShouldSetPanResponder(e, gestureState) {
            const { dx } = gestureState;
            // Maybe a touch action
            if (Math.abs(dx) < 5) {
                return false;
            }
            panning = true;
            return true;
        },
        onPanResponderGrant() {},
        onPanResponderMove(e, gestureState) {
            const { dx, vx } = gestureState;
            // console.log(dx, panning);
            if (dx < -25 && panning) {
                panning = false;
                Vibration.vibrate(20);
                featInstance.setVisible(true);
            }
        },
        onPanResponderRelease() {
            panning = false;
        },
    });

    return panRes.panHandlers;
}

/**
 * Only attached in easy mode
 */
function AttachFeaturesFC(props, ref) {
    if (!aps.get(KEY)) {
        return null;
    }

    const [visible, setVisible] = useState(false);
    const { theme, typo } = useContext(AppContext);
    const padStyle = {
        paddingHorizontal: typo.padding + 4,
        paddingTop: typo.padding + TOPBAR_SPACE + StatusBar.currentHeight,
    };

    useImperativeHandle(ref, () => ({
        setVisible,
    }), []);
    const opacity = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(120)).current;
    const onShow = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }),
        ]).start();
    };
    const onHide = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(translateX, {
                toValue: 120,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setVisible(false);
        });
    };
    const onClick = (routeId) => {
        goto(routeId);
        onHide();
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={onHide}
            onShow={onShow}
            transparent
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={onHide}>
                <Animated.View style={[css.overlay, padStyle, { opacity }]}>
                    <TabButton onPress={() => onClick(TABRSS)} icon="albums-outline" anim={translateX}>
                        RSS源
                    </TabButton>
                    <TabButton onPress={() => onClick(TABSettings)} icon="settings-outline" anim={translateX}>
                        设置
                    </TabButton>
                    <View style={{ padding: typo.padding - 4 }}>
                        <Icon name="close" size={typo.mSize} color={theme.fontColor} style={css.textShadow} />
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
function areEqual() {
    return true;
}
export const AttachFeatures = React.memo(React.forwardRef(AttachFeaturesFC), areEqual);

function TabButton(props) {
    const {
        onPress, icon, anim, children,
    } = props;
    const { theme, typo } = useContext(AppContext);
    const btnStyle = {
        backgroundColor: theme.bgModalBody,
        padding: typo.padding - 4,
        marginBottom: typo.margin,
        transform: [{ translateX: anim }],
    };

    return (
        <Touchable onPress={onPress}>
            <Animated.View style={[css.btn, btnStyle]}>
                <Icon
                    name={icon}
                    size={typo.mSize}
                    color={theme.fontColor}
                    style={{ marginLeft: typo.padding }}
                />
                <Text>{children}</Text>
            </Animated.View>
        </Touchable>
    );
}

const css = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    btn: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        // justifyContent: 'space-between',
        width: 120,
        borderRadius: 6,
        elevation: 4,
    },
    textShadow: {
        textShadowColor: 'rgba(140,149,159,0.3)',
        textShadowOffset: { height: 3 },
        textShadowRadius: 6,
    },
});
