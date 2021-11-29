import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Button,
    Alert,
    Modal,
    Pressable,
} from 'react-native';
import { ThemeContext } from '../themes';
import { StyleText, StyleTextH2 } from '../components/Style.js';
import Link from '../components/Link.js';
import PageContainer from '../components/PageContainer.js';
import { RED } from '../themes/colors.js';
import { GOLD_RATIO } from '../themes/typography.js';
import ReferenceProp from '../components/ReferenceProp.js';
import { IDActivityIndicator } from '../IDSymbols.js';
import { Navigation } from 'react-native-navigation';

const DATA_PROPS = [{
    id: 'animationType',
    default: '"none"',
    type: 'enum("none", "slide", "fade")',
    description: 'Controls how the modal animates',
}, {
    id: 'onRequestClose',
    required: true,
    default: null,
    type: 'function',
    description: 'Called when the user taps the hardware back button on Android. On iOS, this callback is called when a Modal is being dismissed using a drag gesture when presentationStyle is pageSheet or formSheet',
}, {
    id: 'onShow',
    default: null,
    type: 'function',
    description: 'Allows passing a function that will be called once the modal has been shown.',
}, {
    id: 'transparent',
    default: 'false',
    type: 'boolean',
    description: 'Determines whether your modal will fill the entire view. Setting this to true will render the modal over a transparent background.',
}, {
    id: 'visible',
    default: 'true',
    type: 'boolean',
    description: 'Determines whether your modal is visible.',
}];

export default function RNModal(props) {
    const { theme, typo } = useContext(ThemeContext);
    const [visible, setVisible] = useState(false);
    const [vis1, setVis1] = useState(false);
    const onPress = () => {
        Navigation.showModal({
            stack: {
                children: [{ component: { name: IDActivityIndicator } }],
            },
        });
        // Alert.alert(null, 'Pressed', null, { cancelable: true });
    };

    return (
        <PageContainer title="<Modal />">
            <StyleText>
                The Modal component is a basic way to present content above an enclosing view.
            </StyleText>
            <View style={[css.demo, { backgroundColor: theme.background }]}>
                <Button title="show modal" onPress={() => setVisible(true)} />
                <View style={{ height: typo.baseSpace }} />
                <Button title="enhanced modal" onPress={() => setVis1(true)} color={RED} />
                <View style={{ height: typo.baseSpace }} />
                <Button title="rnn modal" onPress={onPress} color={RED} />
            </View>

            <StyleTextH2>Props Reference</StyleTextH2>
            {DATA_PROPS.map((item) => (
                <ReferenceProp key={item.id} data={item} />
            ))}

            <Modal visible={visible} onRequestClose={() => setVisible(false)}>
                <View style={css.modal}>
                    <Text>A basic modal... so basic</Text>
                </View>
                <Text>Next line</Text>
            </Modal>
            <Modal
                visible={vis1}
                onRequestClose={() => setVis1(false)}
                animationType="fade"
                statusBarTranslucent
                transparent
                hardwareAccelerated
            >
                <Pressable style={[css.modal, { flex: 1 }]} onPress={() => setVis1(false)}>
                    <Pressable style={[css.modalBody, { backgroundColor: theme.background, padding: typo.padding *2 }]}>
                        <StyleTextH2>The title</StyleTextH2>
                        <StyleText>Content</StyleText>
                    </Pressable>
                </Pressable>
            </Modal>
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
    modal: {
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    modalBody: {
        flex: 1,
        marginHorizontal: 24,
        borderRadius: 2,
        elevation: 8,
    },
});
