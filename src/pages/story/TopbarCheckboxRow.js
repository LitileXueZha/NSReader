import React, { useContext } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
} from 'react-native';
import Checkbox from '@react-native-community/checkbox';

import { AppContext } from '../../AppContext.js';
import Text from '../../components/SText.js';


const SIZE = 24; // icon size, checkbox height...

function TopbarCheckboxRow(props) {
    const { label, value, onChange } = props;
    const { theme, typo } = useContext(AppContext);
    const wrapperStyle = {
        width: SIZE + typo.padding * 2,
        alignItems: 'flex-end',
    };

    return (
        <Pressable style={css.row} onPress={onChange}>
            <View style={wrapperStyle}>
                <Checkbox
                    style={{ height: SIZE }}
                    tintColors={{
                        false: theme.fontColorSecond,
                        true: theme.primaryColor,
                    }}
                    value={value}
                    onValueChange={onChange}
                />
            </View>
            <Text>{label}</Text>
        </Pressable>
    );
}

const css = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default TopbarCheckboxRow;
