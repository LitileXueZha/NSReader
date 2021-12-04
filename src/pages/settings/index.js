import React, { Component } from 'react';
import {
    View,
    I18nManager,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../../AppContext.js';
import Text from '../../components/SText.js';
import SettingItem from './SettingItem.js';
import { IDAbout, IDSettingsMore, IDStorage } from '../IDSymbols.js';

class Settings extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const { theme, typo } = this.context;

        return (
            <ScrollView style={{ flex: 1, backgroundColor: theme.bgPaperInset }}>
                <View style={{ backgroundColor: theme.background, height: typo.mSize }} />
                <View style={{ backgroundColor: theme.background }}>
                    <SettingItem
                        type="select"
                        text="语言"
                        value="中文"
                        onPress={() => {}}
                        icon={<Icon name="earth" size={typo.fontSize} color={theme.fontColorSecond} />}
                    />
                    <SettingItem
                        type="select"
                        text="主题"
                        tips="控制应用颜色"
                        value="默认"
                        icon={<Icon name="color-palette-outline" size={typo.fontSize} color={theme.fontColorSecond} />}
                    />
                </View>
                <View style={{ backgroundColor: theme.background, marginTop: typo.margin }}>
                    <SettingItem
                        type="checkbox"
                        text="减少通知"
                        tips="订阅源发布过于频繁时建议开启"
                    />
                    <SettingItem
                        type="link"
                        text="存储"
                        tips="管理数据文件"
                        onPress={() => Navigation.push('root', {
                            component: { name: IDStorage },
                        })}
                    />
                    <SettingItem
                        type="link"
                        text="更多设置"
                        tips="更复杂的配置，如果不熟悉的话不建议修改这些"
                        onPress={() => Navigation.push('root', {
                            component: { name: IDSettingsMore },
                        })}
                    />
                </View>
                <View style={{ backgroundColor: theme.background, marginTop: typo.mSize }}>
                    <SettingItem
                        type="link"
                        text="关于"
                        onPress={() => Navigation.push('root', {
                            component: { name: IDAbout },
                        })}
                    />
                </View>

                <View style={{ padding: typo.padding }}>
                    <Text>Settings</Text>
                    <Text>{JSON.stringify(I18nManager.getConstants(),null,2)}</Text>
                </View>
            </ScrollView>
        );
    }
}
Settings.contextType = AppContext;

const css = StyleSheet.create({
    title: {
        marginTop: 40,
    },
});

export default Settings;
