import React, { Component } from 'react';
import {
    ActivityIndicator,
    Alert,
    LayoutAnimation,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import fs from 'react-native-fs';

import Text from '../../../components/SText.js';
import Navbar from '../../../components/Navbar.js';
import { AppContext } from '../../../AppContext.js';
import $ev from '../../../utils/Event.js';
import Button from '../../../components/Button.js';
import Link from '../../../components/Link.js';
import Logs from './Logs.js';
import parseRSS from '../../../utils/RSSParser.js';
import MRSS, { RSS_ADD_DLP } from '../../../models/RSS.js';

const REQUIRED = ['title', 'date', 'description'];

export default class RSSAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            largeFile: false,
        };
        this.URL = 'https://www.solidot.org/index.rss';
        // this.URL = 'http://www.ruanyifeng.com/blog/atom.xml';
        this.logRef = React.createRef();
        this.error = '';
        this.task = null;
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        // $ev.emit('themechange', 'dark');
    }

    componentWillUnmount() {
        if (this.task) {
            fs.stopDownload(this.task.jobId);
        }
    }

    onURLInput = (text) => {
        this.URL = text.trim();
    }

    onSave = async () => {
        if (this.task) {
            fs.stopDownload(this.task.jobId);
        }
        this.inputRef.current.blur();
        this.logRef.current.clear();
        this.showResult(null);

        if (!this.URL) return;

        await Promise.resolve(); // Wait for clear the logs
        this.logRef.current.write('下载RSS源', true);
        const task = fs.downloadFile({
            // fromUrl: 'https://github.com/',
            fromUrl: this.URL,
            toFile: RSS_ADD_DLP,
            readTimeout: 15000, // 15s
            // begin: (b) => console.log('begin:', b),
            // progress: (p) => console.log('progress:', p),
        });
        this.task = task;
        const res = await task.promise.catch((e) => {
            if (e.message.indexOf('aborted') > -1) {
                // fs.stopDownload called
                return;
            }
            this.error = `请检查输入的URL或当前网络状态后重试。\n\n${e.toString()}`;
            this.logRef.current.write('失败');
            this.showResult({
                success: false,
                detail: true,
            });
        });
        // Page destoryed
        if (!this.logRef.current) return;
        if (res) {
            if (res.statusCode !== 200) {
                this.logRef.current.write(res.statusCode);
                this.showResult({ success: false });
                return;
            }
            this.logRef.current.write('OK');
            this.resolveRSS();
        }
    }

    resolveRSS = async () => {
        this.logRef.current.write('解析源文件格式', true);
        const sourceText = await fs.readFile(RSS_ADD_DLP, 'utf8').catch((e) => {
            // Not a plain-text file, eg: images
        });
        const result = parseRSS(sourceText || '');

        if (result?.ok) {
            const { spec, data } = result;
            const errorMsg = [];

            REQUIRED.forEach((key) => {
                if (key in data) return;
                errorMsg.push(`缺少 ${key}`);
            });
            if (errorMsg.length === 0) {
                this.showResult({ success: true });
                this.logRef.current.write(spec);
                // Finally successful, hu~
                this.save(data);
                return;
            }
            // Not support (required fields cannot be found)
            this.logRef.current.write('暂不支持');
            this.error = errorMsg.join('\n');
            this.showResult({
                success: false,
                detail: true,
                support: true,
            });
            return;
        }
        this.logRef.current.write('失败');
        this.showResult({ success: false });
    }

    save = (data) => {
        MRSS.create(this.URL, data);
    }

    showResult = (result) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ result });
    }

    onDetailPress = () => {
        Alert.alert(null, this.error);
    }

    render() {
        const { theme, typo } = this.context;
        const inputStyles = {
            backgroundColor: theme.bgPaperInset,
            color: theme.fontColor,
            fontSize: typo.fontSize,
            lineHeight: typo.fontHeight,
            borderColor: theme.borderColor,
        };
        const { result } = this.state;

        return (
            <>
                <Navbar title="添加 RSS 源" />
                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={[css.item, { padding: typo.padding }]}>
                        <Text style={css.label}>URL</Text>
                        <TextInput
                            ref={this.inputRef}
                            style={[css.input, inputStyles]}
                            placeholder="粘贴输入到此"
                            placeholderTextColor={theme.fontColorSecond}
                            multiline
                            numberOfLines={6}
                            // textAlign="right"
                            textAlignVertical="top"
                            blurOnSubmit
                            autoCorrect={false}
                            onChangeText={this.onURLInput}
                            keyboardType="url"
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: typo.padding }}>
                        <Button style={{ width: 80 }} onPress={this.onSave}>保存</Button>
                    </View>
                    <View style={{ padding: typo.padding }}>
                        <Logs ref={this.logRef} />
                    </View>
                    {result && (
                        <View style={[css.result, { borderColor: theme.borderColor }]}>
                            <Icon
                                name={result.success ? 'checkmark-circle' : 'sad-outline'}
                                color={result.success ? theme.successColor : theme.dangerColor}
                                size={36}
                            />
                            <Text>{result.success ? '保存成功' : '出了点小问题'}</Text>
                            {result.support && <Link>查看支持的RSS源格式</Link>}
                            {result.detail && (
                                <Button boxStyle={{ marginTop: typo.margin }} onPress={this.onDetailPress} outline>
                                    详细信息
                                </Button>
                            )}
                        </View>
                    )}
                </ScrollView>
            </>
        );
    }
}
RSSAdd.contextType = AppContext;

const css = StyleSheet.create({
    item: {
        flexDirection: 'row',
    },
    label: {
        marginTop: 8,
        width: 80,
    },
    input: {
        flex: 1,
        padding: 8,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
    },
    result: {
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 30,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});
