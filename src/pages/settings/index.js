import React, { Component } from 'react';
import {
    View,
    I18nManager,
    StyleSheet,
    ScrollView,
    Alert,
    BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../../AppContext.js';
import Text from '../../components/SText.js';
import SettingItem from './SettingItem.js';
import { IDAbout, IDSettingsMore, IDStorage } from '../IDSymbols.js';
import ModalTheme, { THEME_LIST } from './ModalTheme.js';
import aps from '../../AppSettings.js';
import { goto } from '../../components/Link.js';
import C from '../../components/globalCSSStyles.js';

class Settings extends Component {
    constructor() {
        super();
        this.state = {
            theme: false,
            themeName: THEME_LIST.find((item) => item.id === aps.get('theme'))?.text,
            lang: false,
            langName: '中文',
        };
        this.easymode = Boolean(aps.get('settings.easymode'));
    }

    onThemeOpen = () => {
        this.setState({ theme: true });
    }

    onThemeClose = (index) => {
        this.setState({
            theme: false,
            themeName: THEME_LIST[index].text,
        });
    }

    onEasymodeChange = (value) => {
        Alert.alert('注意', '重启后生效', [{
            text: '稍后',
        }, {
            text: '立即退出',
            onPress: () => BackHandler.exitApp(),
        }], { cancelable: true });
        aps.store('settings.easymode', +value);
    }

    goMore = () => goto(IDSettingsMore)

    goAbout = () => goto(IDAbout)

    render() {
        const { theme, typo } = this.context;
        const {
            theme: themeVisible,
            themeName,
            lang,
        } = this.state;
        const sectionStyle = {
            marginBottom: typo.margin,
            backgroundColor: theme.background,
        };

        return (
            <>
                <ScrollView style={{ flex: 1, backgroundColor: theme.bgPaperInset }}>
                    <View style={[css.head, { backgroundColor: theme.background, padding: typo.padding }]}>
                        <View style={[css.logo, { backgroundColor: theme.primaryColor, padding: typo.padding }]}>
                            <Text style={css.logoText}>₯</Text>
                        </View>
                    </View>
                    <View style={sectionStyle}>
                        <SettingItem
                            type="select"
                            text={(
                                <View style={css.lang}>
                                    <Text>语言</Text>
                                    <Icon
                                        name="globe-outline"
                                        size={typo.fontHeight}
                                        color={theme.fontColor}
                                        style={C.margin.l4}
                                    />
                                </View>
                            )}
                            value="中文"
                            onPress={() => {}}
                            // icon={<Icon name="globe-outline" size={typo.fontHeight} color={theme.fontColorSecond} />}
                        />
                        <SettingItem
                            type="select"
                            text="主题"
                            // tips="控制应用颜色"
                            value={themeName}
                            borderless
                            onPress={this.onThemeOpen}
                            // icon={<Icon name="color-palette-outline" size={typo.mSize} color={theme.fontColorSecond} />}
                        />
                    </View>
                    <View style={sectionStyle}>
                        <SettingItem
                            type="checkbox"
                            text="减少通知"
                            tips="订阅源发布过于频繁时建议开启"
                        />
                        <SettingItem
                            type="checkbox"
                            text="轻简模式"
                            tips="专注于阅读"
                            value={this.easymode}
                            onPress={this.onEasymodeChange}
                        />
                        <SettingItem
                            type="link"
                            text="更多设置"
                            tips="更复杂的配置，如果不熟悉的话不建议修改这些"
                            borderless
                            onPress={this.goMore}
                        />
                    </View>
                    <View style={[sectionStyle, { marginTop: typo.margin }]}>
                        <SettingItem
                            type="link"
                            text="关于"
                            borderless
                            onPress={this.goAbout}
                        />
                    </View>

                    {/* <Text>{JSON.stringify(I18nManager.getConstants(),null,2)}</Text> */}
                </ScrollView>
                <ModalTheme visible={themeVisible} onClose={this.onThemeClose} />
            </>
        );
    }
}
Settings.contextType = AppContext;

const css = StyleSheet.create({
    title: {
        marginTop: 40,
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginLeft: 4,
        borderRadius: 6,
    },
    logoText: {
        color: '#fff',
        // light.shadow.medium
        textShadowColor: 'rgba(140,149,159,0.3)',
        textShadowOffset: { height: 3 },
        textShadowRadius: 6,
    },
    lang: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Settings;
