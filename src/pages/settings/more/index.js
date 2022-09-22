import React, { Component } from 'react';
import {
    View,
    Linking,
    Alert,
    StyleSheet,
    ScrollView,
    PermissionsAndroid,
    Platform,
    ToastAndroid,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import fs from 'react-native-fs';

import { AppContext } from '../../../AppContext.js';
import Text from '../../../components/SText.js';
import SettingItem from '../SettingItem.js';
import Navbar from '../../../components/Navbar.js';
import { goto } from '../../../components/Link.js';
import { IDExperiment, IDStorage } from '../../IDSymbols.js';
import Perf from '../../../utils/Perf.js';
import { zar, unzar } from '../../../utils/zarfile.js';
import aps from '../../../AppSettings.js';
import C from '../../../components/globalCSSStyles.js';


const NAME = 'NSReader.bak';

class SettingsMore extends Component {
    constructor() {
        super();
        this.state = {
            baking: false,
            recing: false,
        };
        const DP = fs.DocumentDirectoryPath;
        this.BK_FILES = [
            `${DP}/settings.json`,
            `${DP}/data`,
        ];
        const REG_FILE = /(?:files)\/(settings.json$|data\/.+$)/;
        let samePkg;
        this.writePath = (filePath) => {
            if (samePkg !== false) {
                if (samePkg) {
                    return filePath;
                }
                samePkg = filePath.startsWith(DP);
            }
            const matched = filePath.match(REG_FILE);
            if (matched) {
                return `${DP}/${matched[1]}`;
            }
            return filePath;
        };
        this.isAndroid = Platform.OS === 'android';
    }

    onBackup = async () => {
        this.setState({ baking: true });
        try {
            if (this.isAndroid) {
                /**
                 * react-native-fs support limited content URI access, currently
                 * save to Download.
                 */
                const path = `${fs.DownloadDirectoryPath}/${NAME}`;
                const grant = await PermissionsAndroid.request('android.permission.WRITE_EXTERNAL_STORAGE');
                if (grant === PermissionsAndroid.RESULTS.GRANTED) {
                    await fs.unlink(path).catch(() => {});
                    await zar(this.BK_FILES, path);
                    ToastAndroid.show('已保存到下载', ToastAndroid.SHORT);
                    return;
                }
                ToastAndroid.show('未获得权限', ToastAndroid.SHORT);
            } else {
                // TODO: iOS
                const res = await DocumentPicker.pickDirectory();
                // Alert.alert(null, JSON.stringify(res));
                await fs.writeFile(`${res.uri}/${NAME}`, 'world');
            }
        } catch (e) {
            Perf.log(e);
        } finally {
            this.setState({ baking: false });
        }
    }

    onRecovery = async () => {
        this.setState({ recing: true });
        try {
            if (this.isAndroid) {
                const path = `${fs.DownloadDirectoryPath}/${NAME}`;
                const grant = await PermissionsAndroid.request('android.permission.READ_EXTERNAL_STORAGE');
                if (grant === PermissionsAndroid.RESULTS.GRANTED) {
                    await unzar(path, {
                        // Cross app package id
                        writePath: this.writePath,
                        overwritePaths: [this.BK_FILES[0]],
                    });
                    await aps.init(true);
                    ToastAndroid.show('已导入', ToastAndroid.SHORT);
                    return;
                }
                ToastAndroid.show('未获得权限', ToastAndroid.SHORT);
            }
            // const res = await DocumentPicker.pickMultiple();
            // Alert.alert(null, JSON.stringify(res));
        } catch (e) {
            // File not exist
            if (e.message.indexOf('not exist') > 0) {
                Alert.alert(e.message, `${fs.DownloadDirectoryPath}/${NAME}`);
            }
            Perf.error(e);
        } finally {
            this.setState({ recing: false });
        }
    }

    goStorage = () => goto(IDStorage)

    goExperiment = () => goto(IDExperiment)

    goSystemSettings = () => Linking.openSettings()

    render() {
        const { theme, typo } = this.context;
        const { baking, recing } = this.state;
        const sectionStyle = {
            backgroundColor: theme.background,
            marginTop: typo.margin,
        };

        return (
            <>
                <Navbar title="更多设置" />
                <ScrollView style={{ flex: 1, backgroundColor: theme.bgPaperInset }}>
                    <View style={sectionStyle}>
                        <SettingItem
                            type="link"
                            text="存储"
                            tips="管理数据文件"
                            onPress={this.goStorage}
                        />
                        <SettingItem
                            type="checkbox"
                            text="Chrome 标签页"
                            tips="在内置浏览器中打开链接"
                        />
                        <SettingItem
                            type="link"
                            text="系统设置"
                            tips="打开应用系统设置"
                            borderless
                            onPress={this.goSystemSettings}
                        />
                    </View>
                    <View style={sectionStyle}>
                        <SettingItem
                            type="link"
                            text="备份"
                            tips="选择要保存到的目录"
                            onPress={this.onBackup}
                            loading={baking}
                        />
                        <SettingItem
                            type="link"
                            text="导入"
                            tips={`选择历史备份文件 ${NAME}`}
                            borderless
                            onPress={this.onRecovery}
                            loading={recing}
                        />
                    </View>
                    {this.isAndroid && (
                        <View style={[css.bkTip, { paddingHorizontal: typo.padding }]}>
                            <Text style={C.fs12} secondary>* 安卓暂只支持下载目录</Text>
                        </View>
                    )}
                    <View style={sectionStyle}>
                        <SettingItem
                            type="link"
                            text="实验性功能"
                            borderless
                            onPress={this.goExperiment}
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
    bkTip: {
        marginVertical: 4,
        left: -4,
    },
});

export default SettingsMore;
