import React, { Component } from 'react';
import {
    View,
    Alert,
    StyleSheet,
    ScrollView,
    Platform,
} from 'react-native';
import fs from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';

import format from '../../../utils/format.js';
import { AppContext } from '../../../AppContext.js';
import Text from '../../../components/SText.js';
import SettingItem from '../SettingItem.js';
import Navbar from '../../../components/Navbar.js';
import MRSS from '../../../models/RSS.js';
import MStory from '../../../models/Story.js';
import aps from '../../../AppSettings.js';

class Storage extends Component {
    constructor() {
        super();
        this.state = {
            fsInfo: {
                percent: 0,
                free: '-G',
                total: '-G',
            },
            cache: 0,
            dataSource: 0,
            setting: aps.bytes,
        };
    }

    componentDidMount() {
        fs.getFSInfo().then((res) => {
            this.setState({
                fsInfo: {
                    free: format.bytes(res.freeSpace),
                    total: format.bytes(res.totalSpace),
                    percent: 1 - res.freeSpace / res.totalSpace,
                },
            });
        });
        MRSS.diskUsage().then((res) => {
            this.setState({
                dataSource: res.bytes + this.state.dataSource,
                setting: res.index + this.state.setting,
            });
        });
        MStory.diskUsage().then((res) => {
            this.setState({
                cache: res.bytes + this.state.cache,
            });
            this.diskUsageOfRNFI().then((bytes) => {
                this.setState({ cache: bytes + this.state.cache });
            });
        }).catch((e) => {});
    }

    /**
     * Cache of `react-native-fast-image`
     * 
     * Currently found in 'cache/image_manager_disk_cache' on Android
     */
    // eslint-disable-next-line
    async diskUsageOfRNFI() {
        const dir = Platform.select({
            android: `${fs.CachesDirectoryPath}/image_manager_disk_cache`,
        });
        let bytes = 0;
        const files = await fs.readDir(dir);
        for (const file of files) {
            bytes += file.size;
        }
        return bytes;
    }

    onCacheDrop = async () => {
        FastImage.clearDiskCache();
        await MStory.clearDisk();
        this.setState({ cache: 0 });
    }

    onDataClear = () => {
        Alert.alert(
            '注意',
            '数据文件删除后将无法找回',
            [{
                text: '确认删除',
                style: 'destructive',
                onPress: async () => {
                    await MRSS.clearDisk();
                    this.setState({ dataSource: 0 });
                },
            }, {
                text: '取消',
                style: 'cancel',
            }],
            { cancelable: true },
        );
    }

    render() {
        const { theme, typo } = this.context;
        const { fsInfo, cache, dataSource, setting } = this.state;
        const progressStyle = {
            backgroundColor: theme.successColor,
            height: '100%',
            width: `${fsInfo.percent * 100}%`,
        };

        return (
            <>
                <Navbar title="存储" />
                <ScrollView style={{ flex: 1, backgroundColor: theme.bgPaperInset }}>
                    <View style={{ backgroundColor: theme.background, marginTop: typo.margin }}>
                        <View style={[css.overview, { padding: typo.padding + 4, marginBottom: typo.margin }]}>
                            <Text>空间</Text>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ color: theme.fontColorSecond }}>
                                    可用 {fsInfo.free} /
                                    总计 {fsInfo.total}
                                </Text>
                                <View style={[css.bar, { backgroundColor: theme.bgPaperInset }]}>
                                    <View style={progressStyle} />
                                </View>
                            </View>
                        </View>
                        <SettingItem
                            text="缓存"
                            tips="内容缓存，图片缓存等"
                            value={format.bytes(cache)}
                            disableTouchEffect
                        />
                        <SettingItem
                            text="数据文件"
                            tips="已下载的 RSS 源文件"
                            value={format.bytes(dataSource)}
                            disableTouchEffect
                        />
                        <SettingItem
                            text="应用配置"
                            tips="保存的 RSS 源列表，应用设置"
                            value={format.bytes(setting)}
                            disableTouchEffect
                        />
                    </View>
                    <View style={{ backgroundColor: theme.background, marginTop: typo.margin }}>
                        <SettingItem
                            text="清空缓存"
                            onPress={this.onCacheDrop}
                        />
                        <SettingItem
                            text="清空数据文件"
                            tips="删除数据文件将导致阅读列表为空，且无法再查看更早以前的 RSS 源内容"
                            icon={<Icon name="warning" size={typo.mSize} color={theme.dangerColor} />}
                            onPress={this.onDataClear}
                        />

                    </View>
                </ScrollView>
            </>
        );
    }
}
Storage.contextType = AppContext;

const css = StyleSheet.create({
    overview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bar: {
        marginTop: 4,
        width: 180,
        height: 4,
        borderRadius: 4,
        overflow: 'hidden',
    },
});

export default Storage;
