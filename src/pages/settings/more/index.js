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
                    ToastAndroid.show('??????????????????', ToastAndroid.SHORT);
                    return;
                }
                ToastAndroid.show('???????????????', ToastAndroid.SHORT);
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
                    ToastAndroid.show('?????????', ToastAndroid.SHORT);
                    return;
                }
                ToastAndroid.show('???????????????', ToastAndroid.SHORT);
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
                <Navbar title="????????????" />
                <ScrollView style={{ flex: 1, backgroundColor: theme.bgPaperInset }}>
                    <View style={sectionStyle}>
                        <SettingItem
                            type="link"
                            text="??????"
                            tips="??????????????????"
                            onPress={this.goStorage}
                        />
                        <SettingItem
                            type="checkbox"
                            text="Chrome ?????????"
                            tips="?????????????????????????????????"
                        />
                        <SettingItem
                            type="link"
                            text="????????????"
                            tips="????????????????????????"
                            borderless
                            onPress={this.goSystemSettings}
                        />
                    </View>
                    <View style={sectionStyle}>
                        <SettingItem
                            type="link"
                            text="??????"
                            tips="???????????????????????????"
                            onPress={this.onBackup}
                            loading={baking}
                        />
                        <SettingItem
                            type="link"
                            text="??????"
                            tips={`???????????????????????? ${NAME}`}
                            borderless
                            onPress={this.onRecovery}
                            loading={recing}
                        />
                    </View>
                    {this.isAndroid && (
                        <View style={[css.bkTip, { paddingHorizontal: typo.padding }]}>
                            <Text style={C.fs12} secondary>* ??????????????????????????????</Text>
                        </View>
                    )}
                    <View style={sectionStyle}>
                        <SettingItem
                            type="link"
                            text="???????????????"
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
