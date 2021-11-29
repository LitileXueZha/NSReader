import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Button,
    Alert,
} from 'react-native';
import { ThemeContext } from '../themes';
import { StyleText, StyleTextH2 } from '../components/Style.js';
import Link from '../components/Link.js';
import PageContainer from '../components/PageContainer.js';
import { RED } from '../themes/colors.js';
import { GOLD_RATIO } from '../themes/typography.js';
import ReferenceProp from '../components/ReferenceProp.js';
import { IDActivityIndicator } from '../IDSymbols.js';

const DATA_PROPS = [{
    id: 'onPress',
    required: true,
    default: null,
    type: '({ nativeEvent: PressEvent })',
    description: 'Handler to be called when the user taps the button.',
}, {
    id: 'title',
    required: true,
    default: null,
    type: 'string',
    description: 'Text to display inside the button. On Android the given title will be converted to the uppercased form.',
}, {
    id: 'color',
    default: 'blue',
    type: 'color',
    description: 'Color of the text (iOS), or background color of the button (Android).',
}, {
    id: 'disabled',
    default: 'false',
    type: 'boolean',
    description: 'If true, disable all interactions for this component.',
}];

export default function RNFlatList(props) {
    const { theme, typo } = useContext(ThemeContext);
    const onPress = () => {
        Alert.alert(null, 'Pressed', null, { cancelable: true });
    };

    return (
        <PageContainer title="<Button />">
            <StyleText>
                If this button doesn't look right for your app, you can build your own
                button using:
            </StyleText>
            <Link to={IDActivityIndicator}>TouchableOpacity</Link>
            <Link>TouchableWithoutFeedback</Link>
            <View style={[css.demo, { backgroundColor: theme.background }]}>
                <Button title="title" onPress={onPress} />
                <View style={{ height: typo.baseSpace }} />
                <Button title="title" onPress={onPress} color={RED} />
                <View style={{ height: typo.baseSpace }} />
                <Button title="disabled" onPress={onPress} color={RED} disabled />
            </View>

            <StyleTextH2>Props Reference</StyleTextH2>
            {DATA_PROPS.map((item) => (
                <ReferenceProp key={item.id} data={item} />
            ))}
        </PageContainer>
    );
}

const css = StyleSheet.create({
    demo: {
        justifyContent: 'center',
        marginVertical: 10,
        borderRadius: 2,
        minHeight: (Dimensions.get('screen').width - 20) * GOLD_RATIO,
    },
});
