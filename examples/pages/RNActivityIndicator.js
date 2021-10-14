import React, { useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { ThemeContext } from '../themes';
import { StyleText, StyleTextH2 } from '../components/Style.js';
import PageContainer from '../components/PageContainer.js';
import { ORANGE } from '../themes/colors.js';
import { GOLD_RATIO } from '../themes/typography.js';
import ReferenceProp from '../components/ReferenceProp.js';

const DATA_PROPS = [{
    id: 'animating',
    default: 'true',
    type: 'boolean',
    description: 'Whether to show the indicator (true) or hide it (false).',
}, {
    id: 'color',
    default: null,
    type: 'color',
    description: 'The foreground color of the spinner.',
}, {
    id: 'size',
    default: '"small"',
    type: 'emum("small","large")',
    description: 'Size of the indicator.',
}];

export default function RNActivityIndicator(props) {
    const { theme, typo } = useContext(ThemeContext);

    return (
        <PageContainer title="<ActivityIndicator />">
            <StyleText>Displays a circular loading indicator.</StyleText>
            <View style={[css.demo, { backgroundColor: theme.background }]}>
                <ActivityIndicator />
                <ActivityIndicator size="large" />
                <ActivityIndicator size="large" color={ORANGE} />
                <ActivityIndicator animating={false} />
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
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 10,
        borderRadius: 2,
        minHeight: (Dimensions.get('screen').width - 20) * GOLD_RATIO,
    },
});
