import React, { useContext, useState } from 'react';
import {
    StyleSheet,
    Switch,
    View,
} from 'react-native';
import Checkbox from '@react-native-community/checkbox';

import Text from '../../../components/SText.js';
import Touchable from '../../../components/Touchable.js';
import C from '../../../components/globalCSSStyles.js';
import { AppContext } from '../../../AppContext.js';

export default function RowAction(props) {
    const {
        label,
        tip,
        type = 'checkbox',
        defaultValue,
        onPress,
    } = props;
    const { theme, typo } = useContext(AppContext);
    const rowStyle = {
        padding: typo.padding,
        borderColor: theme.borderColor,
    };
    const tipStyle = {
        marginTop: 4,
        fontSize: typo.fontSizeSmall,
        lineHeight: typo.fontSize,
    };
    const [value, setValue] = useState(Boolean(defaultValue));
    const onValueChange = () => {
        setValue(!value);
        onPress?.(!value);
    };

    return (
        <Touchable onPress={onValueChange}>
            <View style={{ paddingLeft: typo.margin }}>
                <View style={[css.row, rowStyle]}>
                    <View style={css.rowLabel}>
                        <Text>{label}</Text>
                        {tip && (
                            <Text style={tipStyle} secondary>{tip}</Text>
                        )}
                    </View>
                    {type === 'checkbox' && (
                        <Checkbox
                            value={value}
                            onValueChange={onValueChange}
                            tintColors={{
                                false: theme.fontColorSecond,
                                true: theme.primaryColor,
                            }}
                            style={{ height: typo.mSize }}
                        />
                    )}
                    {type === 'switch' && (
                        <Switch
                            value={value}
                            onValueChange={onValueChange}
                            trackColor={{
                                false: theme.fontColorSecond,
                                true: theme.bgStoryFlag,
                            }}
                            thumbColor={value ? theme.primaryColor : '#f4f3f4'}
                        />
                    )}
                </View>
            </View>
        </Touchable>
    );
}

const css = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 0,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    rowLabel: {
        flex: 1,
        marginRight: 20,
    },
});
