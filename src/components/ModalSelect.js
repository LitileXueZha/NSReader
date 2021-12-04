import React, { useState, useContext } from 'react';
import {
    View,
    Modal,
    StyleSheet,
    Alert,
    Pressable,
    useWindowDimensions,
    ScrollView,
    TouchableWithoutFeedback,
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
    text: 'Solidot.org',
    badge: 12,
    icon: <Ionicon name="checkmark" size={24} />,
}, {
    text: '已禁用',
    disabled: true,
    icon: <Ionicon name="cloud-done" size={24} />,
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
    const cssTitle = {
        marginBottom: typo.padding,
        marginLeft: 4,
        paddingHorizontal: typo.padding,
        color: theme.fontColorSecond,
        fontSize: typo.fontSizeSmall,
    };

    const onRequestClose = () => {
        onClose(activeIdx);
    };
    const { height } = useWindowDimensions();
    const maxHeightBody = height * GOLD_RATIO - 48;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            statusBarTranslucent
            hardwareAccelerated
            onRequestClose={onRequestClose}
        >
            {/**
             * Why use a separate overlay?
             * 
             * Put ScrollView in a touchable view will cause it lag,
             * maybe RN need to handle touch events, so sometimes the
             * scroll behaviour is not responsed.
             * 
             * This is a hack...
             */}
            <Pressable style={css.overlay} onPress={onRequestClose} />
            <View style={css.container}>
                <View style={[css.body, { backgroundColor: theme.bgModalBody, paddingVertical: typo.padding }]}>
                    <Text style={cssTitle} numberOfLines={1}>{title}</Text>
                    <ScrollView style={{ maxHeight: maxHeightBody }} disableScrollViewPanResponder>
                        {datalist.map((item, index) => (
                            <Option
                                {...item}
                                key={item.text}
                                onPress={() => {
                                    setActiveIdx(index);
                                    onClose(index);
                                }}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const css = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    body: {
        marginHorizontal: 32,
        maxWidth: 680,
        borderRadius: 2,
        elevation: 12,
    },
});

export default ModalSelect;
