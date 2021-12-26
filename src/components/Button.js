import React, { useContext } from 'react';
import {
    Text,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from '../AppContext.js';
import Touchable from './Touchable.js';
import { buttons } from '../themes';

const RADIUS = 2;
const HEIGHT = 32;

function Button(props) {
    const {
        type = 'default', // primary
        outline,
        size = 'normal', // TODO: small, large
        boxStyle,
        style,
        onPress,
        children,
    } = props;
    const { theme, typo } = useContext(AppContext);
    const themeButton = buttons[theme.id][type];

    const borderRadius = style?.borderRadius !== undefined ? style?.borderRadius : RADIUS;
    const buttonStyles = {
        borderRadius,
        borderWidth: 1,
        borderColor: themeButton.borderColor || theme.borderColor,
    };
    const textStyles = {
        color: themeButton.color,
        fontSize: typo.fontSizeSmall,
        lineHeight: HEIGHT,
        textAlign: 'center',
        paddingHorizontal: typo.padding,
    };
    let ButtonWrapper = LinearGradient;
    let gradientProps = {
        colors: themeButton.bg,
        style: { borderRadius },
    };

    // Outlined button
    if (outline) {
        ButtonWrapper = React.Fragment;
        gradientProps = {};
        buttonStyles.borderColor = theme.borderColor;
        textStyles.color = theme.fontColor;
    }

    return (
        <ButtonWrapper {...gradientProps}>
            <Touchable onPress={onPress}>
                <View style={[buttonStyles, boxStyle]}>
                    <Text style={[textStyles, style]}>
                        {children}
                    </Text>
                </View>
            </Touchable>
        </ButtonWrapper>
    );
}

export default Button;
