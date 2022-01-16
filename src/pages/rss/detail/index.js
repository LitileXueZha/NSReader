import React, { Component } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Checkbox from '@react-native-community/checkbox';
import { Navigation } from 'react-native-navigation';

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
import { openLink } from '../../../components/Link.js';

class RSSDetail extends Component {
    constructor(props) {
        super();
        this.source = MRSS.data[props.route?.id];
        this.state = {
            alias: '',
            enabled: !!this.source?.enabled,
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
                onPress: () => {
                    Navigation.pop('root');
                },
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
                            Navigation.pop('root');
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
        this.setState({
            enabled: !this.state.enabled,
        });
    }

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
        const titleStyles = {
            marginTop: typo.margin,
            padding: typo.padding,
            paddingBottom: 4,
            fontSize: typo.fontSizeSmall,
        };
        const rowStyles = [css.row, {
            padding: typo.padding,
            paddingVertical: typo.padding + 2,
        }];
        const rowBorderStyles = {
            marginLeft: typo.padding,
            paddingLeft: 0,
            borderColor: theme.borderColor,
            borderBottomWidth: StyleSheet.hairlineWidth,
        };
        const urlRowStyles = {
            marginBottom: typo.margin,
            borderColor: theme.borderColor,
            borderBottomWidth: StyleSheet.hairlineWidth,
        };
        const labelStyles = {
            width: typo.fontSize * 6,
        };
        const valueStyles = [css.value, {
            color: theme.fontColorSecond,
        }];
        const inputStyles = {
            // marginRight: typo.padding,
            paddingHorizontal: 8,
            paddingVertical: 4,
            color: theme.fontColor,
            fontSize: typo.fontSize,
            lineHeight: typo.fontHeight,
        };
        const { alias, enabled, refreshing } = this.state;

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
                    style={[C.f1, { backgroundColor: theme.bgPaperInset }]}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />}
                >
                    <View style={[css.editable, { backgroundColor: theme.background, marginTop: typo.margin }]}>
                        <View style={[rowStyles, urlRowStyles]}>
                            <Text style={labelStyles}>URL</Text>
                            <Text style={[valueStyles, { opacity: 0.45 }]} selectable>
                                {decodeURIComponent(this.source?.url)}
                            </Text>
                        </View>
                        <View style={[rowStyles, { paddingVertical: 0, marginBottom: 4 }]}>
                            <Text style={labelStyles}>别名：</Text>
                            <View style={[css.value, css.inputWrapper, { borderColor: theme.borderColor, backgroundColor: theme.bgPaperInset }]}>
                                <TextInput
                                    style={inputStyles}
                                    placeholder="更改RSS源标题"
                                    placeholderTextColor={theme.fontColorSecond}
                                    textAlign="right"
                                />
                            </View>
                        </View>
                        <Touchable onPress={this.onEnabledChange}>
                            <View style={[rowStyles, { justifyContent: 'space-between' }]}>
                                <Text style={labelStyles}>启用</Text>
                                <Checkbox
                                    value={enabled}
                                    onValueChange={this.onEnabledChange}
                                    tintColors={{
                                        false: theme.fontColorSecond,
                                        true: theme.primaryColor,
                                    }}
                                    style={{ height: typo.mSize }}
                                />
                            </View>
                        </Touchable>
                        {/* TODO: 每日更新，设置为每日更新的 rss 源在阅读列表中只查看今天的数据。适用于排行榜等每天更新的源 */}
                    </View>
                    <Text style={titleStyles} secondary>详细信息</Text>
                    <View style={[css.more, { backgroundColor: theme.background }]}>
                        <View style={[rowStyles, rowBorderStyles]}>
                            <Text style={[labelStyles, { alignSelf: 'flex-start' }]}>标题</Text>
                            <Text style={valueStyles} selectable>
                                {this.source?.title}
                            </Text>
                        </View>
                        <View style={[rowStyles, rowBorderStyles]}>
                            <Text style={[labelStyles, { alignSelf: 'flex-start' }]}>描述</Text>
                            <Text style={valueStyles} selectable>
                                {this.source?.description}
                            </Text>
                        </View>
                        <View style={[rowStyles, rowBorderStyles, css.rowImg]}>
                            <Text style={labelStyles}>图标</Text>
                            <Favicon id={this.source?.id} size={78} radius={6} />
                        </View>
                        <View style={[rowStyles, rowBorderStyles]}>
                            <Text style={labelStyles}>发布间隔</Text>
                            <Text style={valueStyles} selectable>
                                {
                                    this.source?.ttl
                                        ? `${this.source.ttl}分钟`
                                        : '无数据'
                                }
                            </Text>
                        </View>
                        <View style={[rowStyles, rowBorderStyles]}>
                            <Text style={labelStyles}>最后发布于</Text>
                            <Text style={valueStyles} selectable>
                                {format.date(this.source?.date, true)}
                            </Text>
                        </View>
                        <View style={rowStyles}>
                            <Text style={labelStyles}>源格式</Text>
                            <Text style={valueStyles} selectable>
                                {this.source?.spec}
                            </Text>
                        </View>

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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        flex: 1,
        flexShrink: 1,
        textAlign: 'right',
    },
    rowImg: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    inputWrapper: {
        // top: -6,
        // borderBottomWidth: 2,
        // backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 6,
        borderWidth: StyleSheet.hairlineWidth,
    },
});

export default RSSDetail;
