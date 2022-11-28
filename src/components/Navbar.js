import React, { useContext, useState } from 'react';
import {
    LayoutAnimation,
    Modal,
    StyleSheet,
    View,
    Pressable,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Text from './SText.js';
import { AppContext } from '../AppContext.js';
import { TouchHighlight } from './Touchable.js';
import Option from './ModalSelectOption.js';
import Perf from '../utils/Perf.js';
import { goBack } from './Link.js';

const TDATA = [{
    text: '分享',
}, {
    text: '在浏览器打开',
    disabled: true,
    icon: <Icon name="cloud-done" size={20} />,
}, {
    text: '问题反馈',
    icon: <Icon name="checkmark" size={20} />,
}];
const HEIGHT = 48;

/**
 * App navigation bar
 */
function NavbarFC(props) {
    const {
        title,
        rightViews,
        menus = [],
        onMenuPress,
        borderless,
    } = props;
    const { theme, typo } = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

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
            LayoutAnimation.create(250, 'easeOut', 'scaleXY'),
        );
        setVisible(true);
    };

    return (
        <>
            <View style={[css.body, !borderless && { borderColor: theme.borderColor }, { paddingHorizontal: typo.padding }]}>
                <TouchHighlight onPress={goBack} style={{ left: -typo.padding / 2, borderRadius: 6 }}>
                    <View style={css.iconBtn}>
                        <Icon name="chevron-back" size={typo.mSize} color={theme.fontColor} />
                    </View>
                </TouchHighlight>
                <Text style={css.title} numberOfLines={1}>{title}</Text>
                {rightViews}
                {menus.length > 0 && (
                    <TouchHighlight onPress={() => setOpen(true)} style={{ right: -typo.padding / 2, borderRadius: 6 }}>
                        <View style={css.iconBtn}>
                            <Icon name="ellipsis-vertical" size={typo.fontSize + 4} color={theme.fontColor} />
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
                                removeIcon
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
        height: HEIGHT,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: {
        flex: 1,
        flexShrink: 1,
        fontWeight: '600',
    },
    iconBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
    },
    optionsMenu: {
        position: 'absolute',
        right: 8,
        top: 6 + StatusBar.currentHeight,
        padding: 0.1,
        borderRadius: 4,
        elevation: 3,
        zIndex: 1,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});

function areEqual(prevProps, nextProps) {
    if (prevProps.title !== nextProps.title || prevProps.menus !== nextProps.menus) {
        return false;
    }
    return true;
}
const Navbar = React.memo(NavbarFC, areEqual);
Navbar.HEIGHT = HEIGHT;

export default Navbar;
