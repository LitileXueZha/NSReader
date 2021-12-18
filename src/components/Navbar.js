import React, { useContext, useState } from 'react';
import {
    LayoutAnimation,
    Modal,
    StyleSheet,
    View,
    Pressable,
    StatusBar,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

import Text from './SText.js';
import { AppContext } from '../AppContext.js';
import { TouchHighlight } from './Touchable.js';
import Option from './ModalSelectOption.js';

const TDATA = [{
    text: '分享',
}, {
    text: '在浏览器打开',
    disabled: true,
    icon: <Ionicon name="cloud-done" size={20} />,
}, {
    text: '问题反馈',
    icon: <Ionicon name="checkmark" size={20} />,
}];

/**
 * App navigation bar
 */
export default function Navbar(props) {
    const {
        title,
        rightViews,
        menus = TDATA,
        onMenuPress,
        borderless,
    } = props;
    const { theme, typo } = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const onBackPress = () => {
        Navigation.pop('root').catch((e) => {
            if (__DEV__) {
                console.warn(e);
            }
        });
    };
    const onRequestClose = () => {
        setVisible(false);
        setOpen(false);
    };
    const onOptionPress = (index) => {
        onRequestClose();
        onMenuPress && onMenuPress(index);
    };
    const onModalShow = () => {
        LayoutAnimation.configureNext(
            LayoutAnimation.create(250, 'easeOut', 'opacity'),
        );
        setVisible(true);
    };

    return (
        <>
            <View style={[css.body, !borderless && { borderColor: theme.borderColor }]}>
                <TouchHighlight onPress={onBackPress}>
                    <View style={[css.back, { padding: typo.padding }]}>
                        <SimpleLineIcon name="arrow-left" size={typo.fontSize} color={theme.fontColor} />
                    </View>
                </TouchHighlight>
                <Text style={css.title}>{title}</Text>
                {rightViews}
                {menus.length > 0 && (
                    <TouchHighlight onPress={() => setOpen(true)}>
                        <View style={[css.options, { padding: typo.padding }]}>
                            <Ionicon name="ellipsis-vertical" size={typo.fontSize + 4} color={theme.fontColor} />
                        </View>
                    </TouchHighlight>
                )}
            </View>
            {menus.length > 0 && (
                <Modal
                    visible={open}
                    onRequestClose={onRequestClose}
                    onShow={onModalShow}
                    transparent
                    statusBarTranslucent
                >
                    <Pressable onPress={onRequestClose} style={css.overlay} />
                    <View style={[css.optionsMenu, { backgroundColor: theme.bgModalBody }]}>
                        {visible && menus.map((item, index) => (
                            <Option
                                key={item.text}
                                data={item}
                                onPress={() => onOptionPress(index)}
                            />
                        ))}
                    </View>
                </Modal>
            )}
        </>
    );
}

const css = StyleSheet.create({
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: {
        flex: 1,
        flexShrink: 1,
    },
    optionsMenu: {
        position: 'absolute',
        right: 6,
        top: 6 + StatusBar.currentHeight,
        padding: 0.1,
        borderRadius: 2,
        elevation: 6,
        zIndex: 1,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});
