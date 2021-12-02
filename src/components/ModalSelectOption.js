import React, { useContext } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import { AppContext } from '../AppContext.js';
import Text from './SText.js';
import Badge from './Badge.js';
import Touchable from './Touchable.js';

const SIZE = 24;

function ModalSelectOption(props) {
    const {
        text,
        icon,
        disabled,
        badge,
        onPress,
    } = props;
    const { theme, typo } = useContext(AppContext);

    return (
        <Touchable disabled={disabled} onPress={onPress}>
            <View style={[css.row, { padding: typo.padding }, disabled && { opacity: 0.65 }]}>
                <View style={[css.value, { marginLeft: typo.margin, marginRight: icon ? typo.margin: 0 }]}>
                    <Text style={{ flexShrink: 1 }}>{text}</Text>
                    {badge && (
                        <Badge text={badge} />
                    )}
                </View>
                {icon}
            </View>
        </Touchable>
    );
}

const css = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        minHeight: 24,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

ModalSelectOption.INDICATOR_SIZE = SIZE;
export default ModalSelectOption;
