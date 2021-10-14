import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { ThemeContext } from '../themes';
import { StyleText } from './Style.js';
import { ORANGE, RED } from '../themes/colors.js';
import { GOLD_RATIO } from '../themes/typography.js';

export default function ReferenceProp(props) {
    const ctx = useContext(ThemeContext);
    const { theme, typo } = ctx;
    const {
        data: {
            id,
            required,
            default: defaultValue,
            type,
            description,
        },
    } = props;
    return (
        <View style={{ marginBottom: typo.margin / GOLD_RATIO }}>
            <View style={css.rcTitle}>
                <StyleText style={{ flex: 1, fontWeight: 'bold' }}>
                    {id}
                    <StyleText style={css.rcDefault}>
                        {' = '}
                        {defaultValue}
                    </StyleText>
                </StyleText>
                {required && (
                    <StyleText style={[css.rcRequired]}>
                        Required
                    </StyleText>
                )}
            </View>
            <StyleText size="small" style={[{ color: theme.fontColorSecond }, css.rcType]}>{type}</StyleText>
            <StyleText size="small" style={css.rcDesc}>{description}</StyleText>
        </View>
    );
}

const css = StyleSheet.create({
    rc: {},
    rcTitle: {
        flexDirection: 'row',
        // alignItems: 'flex-start',
        alignItems: 'flex-end',
    },
    rcDefault: {
        color: ORANGE,
        fontWeight: 'normal',
    },
    rcRequired: {
        color: RED,
        borderWidth: 0.5,
        borderColor: RED,
        borderRadius: 2,
        paddingHorizontal: 6,
        fontSize: 10,
        lineHeight: 18,
    },
    rcType: {
        marginBottom: -2,
    },
    rcDesc: {},
});
