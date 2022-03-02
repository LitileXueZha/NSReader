import React, { useContext } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import { AppContext } from '../../../AppContext.js';
import Text from '../../../components/SText.js';

function LicenseCard(props) {
    const { theme, typo } = useContext(AppContext);
    const { name, type, children } = props;
    const containerStyle = {
        padding: typo.padding,
        borderColor: theme.borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
    };
    const txtStyle = {
        marginTop: typo.margin,
        fontSize: typo.fontSizeSmall,
        lineHeight: typo.fontSizeSmall,
        color: theme.fontColorSecond,
    };
    return (
        <View style={containerStyle}>
            <View style={css.row}>
                <Text style={css.name}>{name}</Text>
                {Boolean(type) && (
                    <View style={[css.badge, { backgroundColor: theme.successColor }]}>
                        <Text style={{ color: theme.fgOnPaper, fontSize: typo.fontSizeSmall }}>
                            {type}
                        </Text>
                    </View>
                )}
            </View>
            <Text style={txtStyle} selectable>
                {children}
            </Text>
        </View>
    );
}

const css = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    badge: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    name: {
        flexShrink: 1,
        fontWeight: 'bold',
    },
});

export default LicenseCard;
