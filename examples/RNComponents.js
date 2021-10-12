import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { ThemeContext } from './themes';

const css = StyleSheet.create({
    global: {
        fontSize: 16,
        color: 'red',

    },
});

export default function Components() {
    const ctx = useContext(ThemeContext);
    return (
        <View style={css.global}>
            <Text>Components</Text>
            <Text>{JSON.stringify(ctx.theme, null, 4)}</Text>
        </View>
    );
}
