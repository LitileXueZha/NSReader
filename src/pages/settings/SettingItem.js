import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Checkbox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import { AppContext } from '../../AppContext.js';
import Text from '../../components/SText.js';
import Touchable from '../../components/Touchable.js';

/**
 * Setting Item
 * 
 * Supported types: `enum("plain","link","select","checkbox")`, default is "plain".
 */
export default function SettingItem(props) {
    const {
        style,
        type,
        text,
        tips,
        icon,
        value,
        onPress,
        disableTouchEffect,
    } = props;
    const [checked, setChecked] = useState(value);
    const { theme, typo } = useContext(AppContext);
    const tipsStyle = {
        color: theme.fontColorSecond,
        fontSize: typo.fontSizeSmall,
        lineHeight: typo.fontSize,
        marginTop: 4,
    };
    const onItemPress = () => {
        if (type === 'checkbox') {
            setChecked(!checked);
        }
        onPress && onPress();
    };

    return (
        <Touchable onPress={onItemPress} disabled={disableTouchEffect}>
            <View style={[css.row, { paddingVertical: typo.padding }, style]}>
                <View style={[css.body, { paddingHorizontal: typo.padding + 4 }]}>
                    <Text>{text}</Text>
                    {tips && (
                        <Text style={tipsStyle}>
                            {tips}
                        </Text>
                    )}
                </View>
                <View style={[css.action, { marginHorizontal: typo.margin + 4 }]} pointerEvents="none">
                    {value && (
                        <Text style={{ color: theme.fontColorSecond, marginRight: 2 }}>{value}</Text>
                    )}
                    {type === 'checkbox' && (
                        <Checkbox
                            value={checked}
                            onValueChange={onItemPress}
                            tintColors={{ true: theme.primaryColor, false: theme.fontColorSecond }}
                        />
                    )}
                    {(type === 'link' || (type === 'select' && !icon)) && (
                        <Icon name="arrow-right" size={typo.fontSizeSmall} color={theme.fontColorSecond} />
                    )}
                    {icon}
                </View>
            </View>
        </Touchable>
    );
}

const css = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    body: {
        flex: 1,
        flexShrink: 1,
        justifyContent: 'center',
        minHeight: 26,
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: 32,
    },
});
