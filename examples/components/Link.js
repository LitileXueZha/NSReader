/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import { Navigation } from 'react-native-navigation';

import {} from '../IDSymbols.js';
import { ThemeContext } from '../themes';
import { StyleText } from './Style.js';

export default function Link(props) {
    const {
        style,
        children,
        to,
        ...restProps
    } = props;
    const ctx = useContext(ThemeContext);
    const { linkColor } = ctx.theme;
    const themeStyles = {
        color: linkColor,
    };
    const onNavigate = () => {
        if (to) {
            Navigation.push('root', {
                component: { name: to },
            });
        }
    };
    return (
        <StyleText style={[themeStyles, style]} onPress={onNavigate} {...restProps}>
            {children}
        </StyleText>
    );
}
