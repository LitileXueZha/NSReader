import React, { useContext } from 'react';
import { Text } from 'react-native';

import { AppContext } from '../AppContext.js';

/**
 * Text with styles
 * 
 * @param {import('react-native').TextProps} props
 */
function SText(props) {
    const { style, children, ...restProps } = props;
    const { theme, typo } = useContext(AppContext);
    const themeStyles = {
        color: theme.fontColor,
        fontSize: typo.fontSize,
        lineHeight: typo.fontHeight,
    };

    return (
        <Text style={[themeStyles, style]} {...restProps}>
            {children}
        </Text>
    );
}

export default React.memo(SText);
