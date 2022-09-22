import React, { useContext } from 'react';
import { Text } from 'react-native';

import { AppContext } from '../AppContext.js';

/**
 * Text with styles
 *
 * @param {import('react-native').TextProps} props
 */
function SText(props) {
    const {
        style,
        children,
        secondary,
        ...restProps
    } = props;
    const { theme, typo } = useContext(AppContext);
    const textStyle = {
        color: theme.fontColor,
        fontSize: typo.fontSize,
        lineHeight: typo.fontHeight,
    };

    if (secondary) {
        textStyle.color = theme.fontColorSecond;
    }

    return (
        <Text style={[textStyle, style]} {...restProps}>
            {children}
        </Text>
    );
}

// export default React.memo(SText);
export default SText;
