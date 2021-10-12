import React, { useContext } from 'react';
import {
    View,
    Text,
    Button,
    ScrollView,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ThemeContext } from './themes';
import $ev from './utils/Event.js';

let theme = true;
export default function API(props) {
    const ctx = useContext(ThemeContext);
    const onChange = () => {
        $ev.emit('themechange', theme ? 'dark' : 'main');
        theme = !theme;
        // ctx.setTheme('dark');
    };
    const onBackgroundChange = () => {
        Navigation.mergeOptions('api', {
            layout: { componentBackgroundColor: 'orange' },
        });
    };
    return (
        <ScrollView>
            <Text>API</Text>
            <Button title="主题" onPress={onChange} />
            <Text>{JSON.stringify(ctx.theme, null, 4)}</Text>
            <Button title="背景" onPress={onBackgroundChange} />
        </ScrollView>
    );
}
