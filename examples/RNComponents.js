import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    Pressable,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ThemeContext } from './themes';
import { Icon, StyleText } from './components';
import TYPO from './themes/typography.js';
import RNActivityIndicator from './pages/RNActivityIndicator.js';

const rcList = [
    RNActivityIndicator,
];
const rnVersion = () => {
    const { major, minor, patch } = Platform.constants.reactNativeVersion;
    return `${major}.${minor}.${patch}`;
};

export default function Components(props) {
    const ctx = useContext(ThemeContext);
    const { theme } = ctx;

    const onNavigate = (id) => {
        Navigation.push('root', {
            component: { name: id },
        });
    };
    const renderList = (list) => list.map((item) => {
        const onPress = () => onNavigate(item.ID);
        return (
            <Pressable onPress={onPress} key={item.name}>
                <View style={[{ borderColor: theme.borderColor }, css.rcitem]}>
                    <StyleText style={css.rcitemText}>{item.name.substr(2)}</StyleText>
                    <Icon name="arrowForward" />
                </View>
            </Pressable>
        );
    });
    return (
        <ScrollView>
            <StyleText style={[{ color: theme.fontColorSecond }, css.ver]} size="small">
                ver_{rnVersion()}
            </StyleText>
            <View style={css.global}>
                {renderList(rcList)}
                <Text>Components</Text>
                <Text>{JSON.stringify(theme, null, 4)}</Text>
            </View>
            <View style={{ height: 400 }}></View>
        </ScrollView>
    );
}

const css = StyleSheet.create({
    ver: {
        paddingRight: TYPO.margin,
        textAlign: 'right',
    },
    rcitem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: TYPO.margin / TYPO.goldRatio,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    rcitemText: {
        flex: 1,
    },
});
