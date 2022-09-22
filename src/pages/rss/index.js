import React, { Component } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../../AppContext.js';
import { pages } from '../../themes';
import Text from '../../components/SText.js';
import SourceItem from './SourceItem.js';
import { getRandomSources } from '../../utils/randomize.js';
import Empty from '../../components/Empty.js';
import Button from '../../components/Button.js';
import { IDRSSAdd, IDRSSDetail } from '../IDSymbols.js';
import Touchable from '../../components/Touchable.js';
import MRSS from '../../models/RSS.js';
import format from '../../utils/format.js';
import { goto } from '../../components/Link.js';
import C from '../../components/globalCSSStyles.js';
import Navbar from '../../components/Navbar.js';
import aps from '../../AppSettings.js';
import $ev from '../../utils/Event.js';
import { debounce } from '../../utils/index.js';

const TDATA = [
    { title: '奇客Solidot–传递最新科技情报', date: new Date(), description: '奇客的知识，重要的东西。', rcIdx: 2, enabled: true },
    { title: '阮一峰的网络日志', date: new Date(), description: 'Ruan YiFeng\'s Blog', rcIdx: 4, enabled: true },
    { title: '程序师', date: new Date(), description: '程序员、编程语言、软件开发、编程技术', rcIdx: 4 },
];

class RSS extends Component {
    constructor() {
        super();
        this.state = {
            sources: Object.values(MRSS.data),
            refreshing: false,
        };
        this.easymode = Boolean(aps.get('settings.easymode'));
    }

    componentDidMount() {
        // setTimeout(() => {
        //     this.setState({ sources: getRandomSources(20) });
        // }, 1000);
        if (!MRSS.initialized) {
            MRSS.init().then(this.update);
        }
        $ev.on('rsschange', this.update);
    }

    componentWillUnmount() {
        $ev.off('rsschange', this.update);
    }

    // eslint-disable-next-line
    update = debounce(() => {
        // this.forceUpdate();
        this.setState({ sources: Object.values(MRSS.data) });
    });

    onRefresh = async () => {
        this.setState({ refreshing: true });
        await MRSS.fetchAll();
        this.update();
        this.setState({ refreshing: false });
    }

    onSourceAdd = () => {
        goto(IDRSSAdd);
    };

    onSourcePress = (item) => {
        const { id } = item;
        goto(IDRSSDetail, { id });
    }

    onToggleEnabled = (item, index) => {
        const { title, enabled } = item;
        const message = enabled ? '关闭此 RSS 源内容更新' : '启用更新';

        Alert.alert(title, message, [{
            text: !enabled ? '好的' : '确认',
            onPress: () => {
                const sources = this.state.sources.map((value, i) => {
                    // Only one update
                    if (i === index) {
                        return { ...value, enabled: !enabled };
                    }
                    return value;
                });
                this.setState({ sources });
                MRSS.update(item.id, { enabled: +(!enabled) });
            },
        }, {
            text: '取消',
            style: 'cancel',
        }], { cancelable: true });
    }

    onTutorialPress = () => {
        Alert.alert('TODO', 'Somethings...');
    }

    renderItem = ({ item, index }) => (
        <SourceItem
            key={item.title}
            data={item}
            onPress={() => this.onSourcePress(item)}
            onToggleEnabled={() => this.onToggleEnabled(item, index)}
        />
    )

    render() {
        const { theme, typo } = this.context;
        const themePage = pages[theme.id].rss;
        const totalStyle = {
            backgroundColor: themePage.bgTotal,
            paddingHorizontal: typo.padding,
            paddingVertical: 4,
            borderRadius: 50,
        };
        const helpStyle = {
            padding: typo.padding,
            margin: typo.margin,
            backgroundColor: theme.bgRSSHelp,
        };
        const { refreshing, sources } = this.state;

        return (
            <>
                {this.easymode && <Navbar title="RSS源" />}
                <FlatList
                    style={C.f1}
                    data={sources}
                    renderItem={this.renderItem}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    contentContainerStyle={css.minH100}
                    ListEmptyComponent={Empty}
                    ListHeaderComponent={(
                        <View style={{ paddingHorizontal: typo.padding, marginBottom: typo.margin }}>
                            <View style={{ marginVertical: typo.margin }}>
                                <Text style={css.update} secondary>最后更新于</Text>
                                <Text style={css.update} secondary>
                                    {format.date(new Date(), true)}
                                </Text>
                            </View>
                            <View style={css.info}>
                                <View style={totalStyle}>
                                    <Text style={{ fontSize: typo.fontSizeSmall }}>
                                        {`共 ${sources.length} 项`}
                                    </Text>
                                </View>
                                <Button type="primary" onPress={this.onSourceAdd}>添加 RSS 源</Button>
                            </View>
                        </View>
                    )}
                    ListFooterComponent={(
                        <>
                            <View style={[css.helpLink, helpStyle]}>
                                <Icon name="help-circle-outline" color={theme.linkColor} size={typo.mSize} />
                                <Text style={[C.margin.l4, { color: theme.linkColor }]}>了解如何添加RSS源</Text>
                            </View>
                            <Touchable onPress={this.onTutorialPress}>
                                <View style={[css.helpLink, helpStyle, { marginTop: 0 }]}>
                                    <Icon name="happy-outline" color={theme.fontColor} size={typo.mSize} />
                                    <Text style={C.margin.l4}>开始使用</Text>
                                </View>
                            </Touchable>
                        </>
                    )}
                    ListFooterComponentStyle={[sources.length > 0 && C.f1, { justifyContent: 'flex-end' }]}
                />
            </>
        );
    }
}
RSS.contextType = AppContext;

const css = StyleSheet.create({
    update: {
        fontSize: 12,
        lineHeight: 12,
        textAlign: 'center',
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    helpLink: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
    },
    minH100: { minHeight: '100%' },
});

export default RSS;
