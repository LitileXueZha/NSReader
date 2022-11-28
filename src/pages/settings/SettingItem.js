import React, { useContext, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
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
        loading = false,
        borderless,
    } = props;
    const [checked, setChecked] = useState(value);
    const { theme, typo } = useContext(AppContext);
    const tipsStyle = {
        color: theme.fontColorSecond,
        fontSize: typo.fontSizeSmall,
        lineHeight: typo.fontSize,
        marginTop: 4,
    };
    const borderStyle = borderless || {
        borderColor: theme.borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
    };
    const space = typo.margin + typo.padding / 2;
    const onItemPress = () => {
        if (type === 'checkbox') {
            setChecked(!checked);
        }
        onPress?.(!checked);
    };

    return (
        <Touchable onPress={onItemPress} disabled={disableTouchEffect}>
            <View style={{ paddingLeft: space }}>
                <View style={[css.row, { paddingVertical: typo.padding }, style, borderStyle]}>
                    <View style={css.body}>
                        <Text>{text}</Text>
                        {tips && (
                            <Text style={tipsStyle}>
                                {tips}
                            </Text>
                        )}
                    </View>
                    <View style={[css.action, { marginHorizontal: space }]} pointerEvents="none">
                        {loading && <ActivityIndicator style={css.icLoad} />}
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
    icLoad: {
        marginRight: 6,
    },
});
