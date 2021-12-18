import React, { useContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { AppContext } from '../AppContext.js';
import Text from './SText.js';

export default function Empty(props) {
    const { style, more, description, icon } = props;
    const { theme, typo } = useContext(AppContext);
    return (
        <View style={[css.body, style]}>
            {icon || (
                <Image source={theme.imgIcons.empty} resizeMode="contain" style={css.icon} />
            )}
            <Text style={{ color: theme.fontColorSecond, marginTop: 4 }}>
                {description || '空空如也'}
            </Text>
            {more}
        </View>
    );
}

const css = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 128,
        height: 128,
    },
});
