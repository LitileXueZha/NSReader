import React, { useContext } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import Text from '../../../components/SText.js';
import C from '../../../components/globalCSSStyles.js';
import { AppContext } from '../../../AppContext.js';

export default function RowInfo(props) {
    const { label, value, borderless } = props;
    const { theme, typo } = useContext(AppContext);
    const rowStyle = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: typo.padding,
        paddingVertical: typo.padding + 2,
    };
    const borderStyle = borderless || {
        borderColor: theme.borderColor,
        borderTopWidth: StyleSheet.hairlineWidth,
    };
    const width = typo.fontSize * 6; // word length

    return (
        <View style={[rowStyle, borderStyle]}>
            <Text style={{ width }} secondary>{label}</Text>
            {
                typeof value === 'string'
                    ? (
                        <Text style={css.value} selectable>
                            {value}
                        </Text>
                    )
                    : value
            }
        </View>
    );
}

const css = StyleSheet.create({
    value: {
        flex: 1,
        flexShrink: 1,
        textAlign: 'right',
    },
});
