import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { ThemeContext } from '../themes';
import { StyleText } from './Style.js';
import { ORANGE } from '../themes/colors.js';
import { GOLD_RATIO } from '../themes/typography.js';

export default function ReferenceProp(props) {
    const ctx = useContext(ThemeContext);
    const { theme, typo } = ctx;
    const {
        data: {
            id,
            default: defaultValue,
            type,
            description,
        },
    } = props;
    return (
        <View style={{ marginBottom: typo.margin / GOLD_RATIO }}>
            <StyleText style={css.rcTitle}>
                {id}
                <StyleText style={css.rcDefault}>
                    {' = '}
                    {defaultValue}
                </StyleText>
            </StyleText>
            <StyleText size="small" style={[{ color: theme.fontColorSecond }, css.rcType]}>{type}</StyleText>
            <StyleText size="small" style={css.rcDesc}>{description}</StyleText>
        </View>
    );
}

const css = StyleSheet.create({
    rc: {},
    rcTitle: {
        fontWeight: 'bold',
    },
    rcDefault: {
        color: ORANGE,
        fontWeight: 'normal',
    },
    rcType: {
        marginBottom: -2,
    },
    rcDesc: {},
});
