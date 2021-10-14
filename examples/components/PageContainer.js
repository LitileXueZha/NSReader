import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StyleTextH1 } from './Style.js';
import { ThemeContext } from '../themes';

export default function PageContainer(props) {
    const ctx = useContext(ThemeContext);
    const { theme, typo } = ctx;
    const {
        title,
        style,
        children, ...restProps
    } = props;
    return (
        <View style={css.container}>
            <StyleTextH1
                style={[{
                    padding: typo.padding,
                    borderColor: theme.borderColor,
                }, css.head]}
            >
                {title}
            </StyleTextH1>
            <ScrollView style={[{ padding: typo.padding }, css.body, style]} {...restProps}>
                {children}
            </ScrollView>
        </View>
    );
}

const css = StyleSheet.create({
    container: {
        flex: 1,
    },
    head: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 0,
    },
    body: {
        flex: 1,
    },
});
