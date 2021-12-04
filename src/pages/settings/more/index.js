import React, { Component } from 'react';
import {
    View,
    Linking,
    Alert,
    StyleSheet,
    ScrollView,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import { AppContext } from '../../../AppContext.js';
import Text from '../../../components/SText.js';
import SettingItem from '../SettingItem.js';
import Navbar from '../../../components/Navbar.js';

class SettingsMore extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const { theme, typo } = this.context;

        return (
            <>
                <Navbar title="更多设置" />
                <ScrollView style={{ flex: 1, backgroundColor: theme.bgPaperInset }}>
                    <View style={{ backgroundColor: theme.background, marginTop: typo.margin }}>
                        <SettingItem
                            type="link"
                            text="系统设置"
                            tips="打开应用系统设置"
                            onPress={() => Linking.openSettings()}
                        />
                        <SettingItem
                            type="checkbox"
                            text="Chrome 标签页"
                            tips="在内置浏览器中打开链接"
                        />
                        <SettingItem
                            type="link"
                            text="插件"
                            tips="实验性功能"
                            onPress={() => {}}
                        />
                    </View>
                    <View style={{ backgroundColor: theme.background, marginTop: typo.margin }}>
                        <SettingItem
                            type="link"
                            text="备份"
                            tips="选择要保存到的目录"
                            onPress={() => DocumentPicker.pickDirectory().then((value) => Alert.alert(null, JSON.stringify(value)))}
                        />
                        <SettingItem
                            type="link"
                            text="导入"
                            tips="选择历史备份文件 settings.json"
                            onPress={() => DocumentPicker.pickMultiple().then((value) => Alert.alert(null, JSON.stringify(value)))}
                        />
                    </View>
                </ScrollView>
            </>
        );
    }
}
SettingsMore.contextType = AppContext;

const css = StyleSheet.create({
    title: {
        marginTop: 40,
    },
});

export default SettingsMore;
