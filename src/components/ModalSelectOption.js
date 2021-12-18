import React, { useContext, useEffect, useMemo } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../AppContext.js';
import Text from './SText.js';
import Badge from './Badge.js';
import Touchable from './Touchable.js';


function ModalSelectOption(props) {
    const {
        data,
        onPress,
        active,
        border,
    } = props;
    const { theme, typo } = useContext(AppContext);
    const memoStyles = useMemo(() => ({
        row: [
            css.row,
            { padding: typo.padding },
            data.disabled && { opacity: 0.65 },
            data.border && { borderColor: theme.borderColor, borderBottomWidth: StyleSheet.hairlineWidth },
        ],
        value: [css.value, { marginRight: data.icon ? typo.margin : 0 }],
    }), [typo, data, border]);
    const onItemPress = () => {
        onPress && requestAnimationFrame(onPress);
    };

    return (
        <Touchable disabled={data.disabled} onPress={onItemPress}>
            <View style={memoStyles.row}>
                <View style={memoStyles.value}>
                    <Text style={css.text}>{data.text}</Text>
                    {data.badge && (
                        <Badge text={data.badge} />
                    )}
                </View>
                {data.icon}
                {!data.icon && active && (
                    <Icon name="checkmark" size={typo.mSize} color={theme.fontColor} />
                )}
            </View>
        </Touchable>
    );
}

const css = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    value: {
        marginLeft: 4,
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 26,
    },
    text: {
        flexShrink: 1,
    },
});

export default ModalSelectOption;
