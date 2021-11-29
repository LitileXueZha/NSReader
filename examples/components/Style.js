/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import { View, Text } from 'react-native';

import { ThemeContext } from '../themes';

export function StyleView(props) {
    const {
        style,
        children,
        size, ...restProps
    } = props;
    const ctx = useContext(ThemeContext);
    const { margin, padding } = ctx.typo;
    const themeStyles = {
        marginTop: margin,
        marginBottom: margin,
        padding,
    };

    return (
        <View style={[themeStyles, style]} {...restProps}>
            {children}
        </View>
    );
}

/**
 * @param {import('react-native').TextProps} props
 */
export function StyleText(props) {
    const {
        style,
        children,
        size,
        ...restProps
    } = props;
    const ctx = useContext(ThemeContext);
    const { fontColor } = ctx.theme;
    const {
        fontHeight,
        fontSize,
        fontSizeSmall,
    } = ctx.typo;
    const themeStyles = {
        color: fontColor,
        lineHeight: fontHeight,
        fontSize: size === 'small' ? fontSizeSmall : fontSize,
    };

    return (
        <Text style={[themeStyles, style]} {...restProps}>
            {children}
        </Text>
    );
}

function createStyleTextHeader(level) {
    return (props) => {
        const {
            style,
            children,
            ...restProps
        } = props;
        const ctx = useContext(ThemeContext);
        const {
            fontSize,
            fontHeight,
            fontWeight,
            marginBottom,
        } = ctx.typo[level];
        const themeStyles = {
            color: ctx.theme.fontColorHead,
            fontSize,
            lineHeight: fontHeight,
            fontWeight,
            marginBottom,
        };
        return (
            <StyleText style={[themeStyles, style]} {...restProps}>
                {children}
            </StyleText>
        );
    };
}

export const StyleTextH1 = createStyleTextHeader('h1');
export const StyleTextH2 = createStyleTextHeader('h2');
