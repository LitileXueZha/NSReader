import React, { useContext } from 'react';
import { View } from 'react-native';

import { AppContext } from '../AppContext.js';
import Text from './SText.js';

export default function Badge(props) {
    const { text } = props;
    const { theme, typo } = useContext(AppContext);
    const styles = {
        marginLeft: 4,
        borderRadius: 100,
        overflow: 'hidden',
    };
    const textStyles = {
        backgroundColor: theme.fontColorSecond,
        fontSize: typo.fontSizeSmall,
        color: theme.background,
        paddingHorizontal: 4,
    };

    return (
        <View style={styles}>
            <Text style={textStyles}>{text}</Text>
        </View>
    );
}
