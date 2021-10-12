import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { registerTheme } from '../themes';
import { StyleText } from '../components/Style.js';

const ID = Symbol('RNActivityIndicator');

export default function RNActivityIndicator(props) {
    return (
        <View>
            <StyleText>ActivityIndicator</StyleText>
        </View>
    );
}
RNActivityIndicator.ID = ID;

Navigation.registerComponent(ID, registerTheme(RNActivityIndicator), () => RNActivityIndicator);
