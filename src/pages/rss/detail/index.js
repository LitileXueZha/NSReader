import React, { Component } from 'react';
import {
    Alert,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Checkbox from '@react-native-community/checkbox';

import Navbar from '../../../components/Navbar.js';
import Text from '../../../components/SText.js';
import C from '../../../components/globalCSSStyles.js';
import { AppContext } from '../../../AppContext.js';
import MRSS from '../../../models/RSS.js';
import Touchable from '../../../components/Touchable.js';
import { GOLD_RATIO } from '../../../themes/typography.js';
import Favicon from '../../../components/Favicon.js';
import format from '../../../utils/format.js';
import Perf from '../../../utils/Perf.js';
import { goBack, openLink } from '../../../components/Link.js';
import RowInfo from './RowInfo.js';
import RowAction from './RowAction.js';

class RSSDetail extends Component {
    constructor(props) {
        super();
        this.source = MRSS.data[props.route?.id];
        this.state = {
            alias: '',
            refreshing: false,
        };
        this.MENUS = [{
            id: 'source',
            text: '查看源内容',
        }, {
            id: 'website',
            text: '查看来源网站',
        }, {
            id: 'del',
            text: '删除',
        }];
    }

    componentDidMount() {
        if (!this.source) {
            Alert.alert(null, '未知数据', [{
                text: '返回',
                onPress: goBack,
            }]);
        }
    }

    onMenuPress = (index) => {
        switch (this.MENUS[index].id) {
            case 'source':
                openLink(this.source.url);
                break;
            case 'website':
                openLink(this.source.link);
                break;
            case 'del':
                Alert.alert(this.source.title, '删除已保存的数据', [
                    {
                        text: '确认删除',
                        style: 'destructive',
                        onPress: async () => {
                            await MRSS.delete(this.source.id).catch(Perf.error);
                            goBack();
                        },
                    },
                    {
                        text: '取消',
                        style: 'cancel',
                    },
                ], { cancelable: true });
                break;
            default:
                break;
        }
    }

    onSave = () => {

    }

    onEnabledChange = () => {
    }

    onDailyChange = () => {}

    onRefresh = async () => {
        if (this.source?.id) {
            this.setState({ refreshing: true });
            try {
                await MRSS.fetch(this.source.id);
                this.source = MRSS.data[this.source.id];
                this.setState({ refreshing: false });
            } catch (e) {
                Perf.error(e);
            }
        }
    }

    render() {
        const { theme, typo } = this.context;
        const inputStyle = {
            paddingHorizontal: 8,
            paddingVertical: 4,
            color: theme.fontColor,
            fontSize: typo.fontSize,
            lineHeight: typo.fontHeight,
        };
        const { refreshing } = this.state;

        return (
            <>
                <Navbar
                    title="编辑RSS源"
                    menus={this.MENUS}
                    onMenuPress={this.onMenuPress}
                    rightViews={(
                        <Touchable onPress={this.onSave}>
                            <View style={css.save}>
                                <Text>保存</Text>
                            </View>
                        </Touchable>
                    )}
                />
                <ScrollView
                    style={C.f1}
                    refreshControl={(
                        <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
                    )}
                    // showsVerticalScrollIndicator={false}
                >
                    <View style={{ margin: typo.margin*2, marginVertical: typo.margin * 2 }}>
                        <View style={[css.inputWrapper, { borderColor: theme.borderColor, backgroundColor: theme.bgPaperInset }]}>
                            <TextInput
                                style={inputStyle}
                                placeholder={this.source?.title}
                                placeholderTextColor={theme.fontColorSecond}
                                defaultValue={this.source?.alias}
                            />
                        </View>
                        <Text style={css.tip} secondary>
                            设置RSS源别名（应用内显示的标题）
                        </Text>
                    </View>
                    <RowAction
                        label="启用"
                        defaultValue={this.source?.enabled}
                        type="switch"
                        onPress={this.onEnabledChange}
                    />
                    <RowAction
                        label="每日更新"
                        tip="设置为每日更新的 RSS 源在阅读列表中只查看今天的数据。适用于排行榜等每天更新的源"
                        defaultValue={false}
                        onPress={this.onDailyChange}
                    />
                    {/* TODO: 每日更新，设置为每日更新的 RSS 源在阅读列表中只查看今天的数据。适用于排行榜等每天更新的源 */}
                    <View style={css.area}>
                        <View style={[css.bubble, { backgroundColor: theme.bgStoryFlag }]}>
                            <Text style={{ fontSize: typo.fontSizeSmall }} secondary>详细信息</Text>
                            <View style={[css.corner, { borderTopColor: theme.bgStoryFlag }]} />
                        </View>
                    </View>
                    <View style={css.more}>
                        <RowInfo
                            label="URL"
                            value={decodeURIComponent(this.source?.url)}
                            borderless
                        />
                        <RowInfo label="标题" value={this.source?.title} />
                        <RowInfo label="描述" value={this.source?.description} />
                        <RowInfo label="图标" value={<Favicon id={this.source?.id} size={48} radius={4} />} />
                        <RowInfo label="发布间隔" value={this.source?.ttl ? `${this.source.ttl}分钟` : '无数据'} />
                        <RowInfo label="最后发布于" value={format.date(this.source?.date, true)} />
                        <RowInfo label="源格式" value={this.source?.spec} />
                    </View>
                </ScrollView>
            </>
        );
    }
}
RSSDetail.contextType = AppContext;

const css = StyleSheet.create({
    save: {
        ...C.flex.center,
        width: Navbar.HEIGHT / GOLD_RATIO,
        height: Navbar.HEIGHT,
    },
    inputWrapper: {
        // top: -6,
        // borderBottomWidth: 2,
        // backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 6,
        borderWidth: StyleSheet.hairlineWidth,
    },
    tip: {
        fontSize: 12,
        marginLeft: 8,
    },
    area: {
        flexDirection: 'row',
        marginTop: 60,
    },
    bubble: {
        padding: 4,
        paddingHorizontal: 8,
        marginBottom: 20,
        marginLeft: 20,
        borderRadius: 4,
    },
    corner: {
        position: 'absolute',
        left: '20%',
        bottom: -12,
        borderWidth: 6,
        borderColor: 'transparent',
    },
});

export default RSSDetail;
