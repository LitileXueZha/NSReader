/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import { View, Text } from 'react-native';

import { ThemeContext } from '../themes';

export default function Style(props) {
    const {
        component: C,
        style,
        children,
        ...restProps
    } = props;
    const ctx = useContext(ThemeContext);

    return (
        <C style={[ctx.theme, style]} {...restProps}>
            {children}
        </C>
    );
}

function HOC(Component) {
    return (props) => <Style component={Component} {...props} />;
}

// export const StyleView = HOC(View);
export function StyleView(props) {
    const {
        style,
        children,
        size, ...restProps
    } = props;
    const ctx = useContext(ThemeContext);
    const { margin, padding } = ctx.theme;
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

export function StyleText(props) {
    const {
        style,
        children,
        size,
        ...restProps
    } = props;
    const ctx = useContext(ThemeContext);
    const {
        fontColor,
        fontHeight,
        fontSize,
        fontSizeSmall,
    } = ctx.theme;
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
        } = ctx.theme[level];
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
