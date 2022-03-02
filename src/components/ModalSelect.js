import React, { useState, useContext, useRef } from 'react';
import {
    View,
    Modal,
    StyleSheet,
    Alert,
    Pressable,
    useWindowDimensions,
    ScrollView,
    TouchableWithoutFeedback,
    Animated,
    Easing,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../AppContext.js';
import Text from './SText.js';
import Option from './ModalSelectOption.js';
import { GOLD_RATIO } from '../themes/typography.js';

const TDATA = [{
    text: '全部',
    badge: 234,
}, {
    text: '已禁用',
    disabled: true,
    icon: <Ionicon name="cloud-done" size={24} />,
}, {
    text: 'Solidot.org',
    badge: 12,
    icon: <Ionicon name="checkmark" size={24} />,
}];

// Alert.alert('来源');
function ModalSelect(props) {
    const {
        title,
        datalist = TDATA,
        currIndex,
        visible,
        children,
        onClose,
    } = props;
    const [activeIdx, setActiveIdx] = useState(currIndex || 0);
    const { theme, typo } = useContext(AppContext);
    const titleStyle = {
        marginLeft: 4,
        padding: typo.padding,
        color: theme.fontColorSecond,
        fontSize: typo.fontSizeSmall,
    };

    const onRequestClose = () => {
        onHide(activeIdx);
    };
    const { height } = useWindowDimensions();
    const maxHeightBody = height * GOLD_RATIO - 48;
    const opacity = useRef(new Animated.Value(0)).current;
    const onShow = () => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };
    const onHide = (index) => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => {
            onClose(index);
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            statusBarTranslucent
            hardwareAccelerated
            onRequestClose={onRequestClose}
            onShow={onShow}
        >
            {/**
             * Why use a separate overlay?
             * 
             * Put ScrollView in a touchable view will cause it lag,
             * maybe RN need to handle touch events, so sometimes the
             * scroll behaviour is not responsed.
             * 
             * This is a hack... (Seems only appear in Hermes)
             */}
            {/* <Pressable style={css.overlay} onPress={onRequestClose} /> */}
            <TouchableWithoutFeedback onPress={onRequestClose}>
                <Animated.View style={[css.overlay, { opacity }]}>
                    <View style={[css.body, { backgroundColor: theme.bgModalBody }]}>
                        {title && (
                            <Text style={titleStyle}>{title}</Text>
                        )}
                        <ScrollView style={{ maxHeight: maxHeightBody }} disableScrollViewPanResponder>
                            {datalist.map((item, index) => (
                                <Option
                                    key={item.text}
                                    data={item}
                                    active={index === activeIdx}
                                    onPress={() => {
                                        setActiveIdx(index);
                                        onHide(index);
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const css = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    body: {
        top: -10,
        width: '100%',
        maxWidth: 360,
        borderRadius: 4,
        elevation: 12,
    },
});

export default ModalSelect;
