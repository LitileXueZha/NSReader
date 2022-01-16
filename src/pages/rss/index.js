import React, { Component } from 'react';
import {
    Alert,
    FlatList,
    LayoutAnimation,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../../AppContext.js';
import Text from '../../components/SText.js';
import SourceItem from './SourceItem.js';
import { getRandomSources } from '../../utils/randomize.js';
import Empty from '../../components/Empty.js';
import Button from '../../components/Button.js';
import { IDRSSAdd, IDRSSDetail } from '../IDSymbols.js';
import Touchable from '../../components/Touchable.js';
import MRSS from '../../models/RSS.js';
import format from '../../utils/format.js';

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
    }

    componentDidMount() {
        // setTimeout(() => {
        //     this.setState({ sources: getRandomSources(20) });
        // }, 1000);
        if (!MRSS.initialized) {
            MRSS.init().then(() => this.setState({
                sources: Object.values(MRSS.data),
            }));
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        setTimeout(() => {
            this.setState({ refreshing: false, sources: getRandomSources(200) });
        }, 1000);
    }

    onSourceAdd = () => {
        Navigation.push('root', {
            component: { name: IDRSSAdd },
        });
    };

    onSourcePress = (index) => {
        const { sources } = this.state;
        const { id } = sources[index];
        Navigation.push('root', {
            component: {
                name: IDRSSDetail,
                passProps: {
                    route: { id },
                },
            },
        });
    }

    onToggleEnabled = (enabled, item) => {
        console.log(enabled, item);
    }

    onTutorialPress = () => {
        Alert.alert('TODO', 'Somethings...');
    }

    renderItem = ({ item, index }) => (
        <SourceItem
            key={item.title}
            data={item}
            onPress={() => this.onSourcePress(index)}
            onToggleEnabled={this.onToggleEnabled}
        />
    )

    render() {
        const { theme, typo } = this.context;
        const helpStyles = {
            padding: typo.padding,
            margin: typo.margin,
            backgroundColor: theme.bgRSSHelp,
        };
        const { refreshing, sources } = this.state;

        return (
            <View style={css.flex1}>
                <FlatList
                    style={css.flex1}
                    data={sources}
                    renderItem={this.renderItem}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    contentContainerStyle={{ minHeight: '100%' }}
                    ListEmptyComponent={<Empty />}
                    ListHeaderComponent={(
                        <View style={{ paddingHorizontal: typo.padding, marginBottom: typo.margin }}>
                            <View style={{ marginVertical: typo.margin }}>
                                <Text style={[css.update, { color: theme.fontColorSecond }]}>最后更新于</Text>
                                <Text style={[css.update, { color: theme.fontColorSecond }]}>
                                    {format.date(new Date(), true)}
                                </Text>
                            </View>
                            <View style={css.info}>
                                <Text secondary>{`共 ${sources.length} 项`}</Text>
                                <Button type="primary" onPress={this.onSourceAdd}>添加 RSS 源</Button>
                            </View>
                        </View>
                    )}
                    ListFooterComponent={(
                        <>
                            <View style={[css.helpLink, helpStyles]}>
                                <Icon name="help-circle-outline" color={theme.linkColor} size={typo.mSize} />
                                <Text style={{ color: theme.linkColor, marginLeft: 4 }}>了解如何添加RSS源</Text>
                            </View>
                            <Touchable onPress={this.onTutorialPress}>
                                <View style={[css.helpLink, helpStyles, { marginTop: 0 }]}>
                                    <Icon name="happy-outline" color={theme.fontColor} size={typo.mSize} />
                                    <Text style={{ marginLeft: 4 }}>开始使用</Text>
                                </View>
                            </Touchable>
                        </>
                    )}
                    ListFooterComponentStyle={[sources.length > 0 && css.flex1, { justifyContent: 'flex-end' }]}
                />
            </View>
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
    flex1: { flex: 1 },
});

export default RSS;
