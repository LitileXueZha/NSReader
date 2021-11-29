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
import { rnVersion } from './utils';
import RNActivityIndicator from './pages/RNActivityIndicator.js';
import RNButton from './pages/RNButton.js';
import RNFlatList from './pages/RNFlatList.js';

const rcList = [
    RNActivityIndicator,
    RNButton,
    RNFlatList,
];

export default function Components(props) {
    const ctx = useContext(ThemeContext);
    const { theme, typo } = ctx;

    const onNavigate = (id) => {
        Navigation.push('root', {
            component: { name: id },
        });
    };
    const renderList = (list) => list.map((item) => {
        const onPress = () => onNavigate(item.ID);
        return (
            <Pressable onPress={onPress} key={item.name}>
                <View
                    style={[
                        { borderColor: theme.borderColor, padding: typo.margin / typo.goldRatio },
                        css.rcitem,
                    ]}
                >
                    <StyleText style={css.rcitemText}>{item.name.substr(2)}</StyleText>
                    <Icon name="arrowForward" />
                </View>
            </Pressable>
        );
    });
    return (
        <ScrollView>
            <StyleText style={[{ color: theme.fontColorSecond, paddingRight: typo.margin }, css.ver]} size="small">
                ver_{rnVersion()}
            </StyleText>
            <View style={css.global}>
                {renderList(rcList)}
                <Text>Components</Text>
                <Text>{JSON.stringify(theme, null, 4)}</Text>
                <Text>{JSON.stringify(typo, null, 4)}</Text>
            </View>
            <View style={{ height: 400 }}></View>
        </ScrollView>
    );
}

const css = StyleSheet.create({
    ver: {
        textAlign: 'right',
    },
    rcitem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    rcitemText: {
        flex: 1,
    },
});
