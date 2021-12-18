import React, { Component } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    Alert,
    RefreshControl,
    Button,
    FlatList,
    InteractionManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

import { AppContext } from '../../AppContext.js';
import { BASE_SPACE } from '../../themes/typography.js';
import Text from '../../components/SText.js';
import Notification from '../../utils/notification.js';
import Touchable from '../../components/Touchable.js';
import Topbar, {
    STATUS_LOADING,
    STATUS_UPDATING,
    STATUS_DONE,
    TOPBAR_SPACE,
} from './Topbar.js';
import AppSettings from '../../AppSettings.js';
import { getRandomStories } from '../../utils/randomize.js';
import StoryItem from './StoryItem.js';
import { doFilter } from './useFilter.js';
import Empty from '../../components/Empty.js';
import Link from '../../components/Link.js';


class Story extends Component {
    constructor() {
        super();
        this.stories = getRandomStories(0);
        this.state = {
            status: STATUS_LOADING,
            // status: STATUS_DONE,
            refreshing: false,
            stories: [],
            extraData: {
                summary: AppSettings.get('story.filter.summary'),
                read: AppSettings.get('story.filter.read'),
                today: AppSettings.get('story.filter.today'),
                last: AppSettings.get('story.sort.last'),
            },
        };
        this.state.stories = doFilter(this.stories, this.state.extraData);
    }

    componentDidMount() {
        setTimeout(() => this.setState({ status: STATUS_DONE }), 1500);
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        setTimeout(() => {
            this.stories = getRandomStories(500);
            this.setState({
                refreshing: false,
                status: STATUS_DONE,
                stories: this.stories,
            });
        }, 1000);
    }

    sendNotification = () => {
        new Notification('新消息来了', {
            body: '根据权威专家指明，某东西存在问题需要群众谨慎对待',
            data: 'data',
        });
    };

    onFilter = (type, value) => {
        // Make sure not blocked ui thread
        requestAnimationFrame(() => {
            const { extraData } = this.state;
            const newExtraData = {
                ...extraData,
                [type]: value,
            };

            this.setState({
                extraData: newExtraData,
                stories: doFilter(this.stories, newExtraData),
            });
        });

        const intValue = value ? 1 : 0;
        switch (type) {
            case 'summary':
                AppSettings.store('story.filter.summary', intValue);
                break;
            case 'read':
                AppSettings.store('story.filter.read', intValue);
                break;
            case 'today':
                AppSettings.store('story.filter.today', intValue);
                break;
            case 'last':
                AppSettings.store('story.sort.last', intValue);
                break;
            default:
                break;
        }
    }

    renderItem = ({ item, index }) => {
        const { extraData } = this.state;
        return (
            <StoryItem
                key={item.title}
                data={item}
                hideSummary={!extraData.summary}
                onPress={() => Navigation.push('root',{component:{name:'settings'}})}
            />
        );
    };

    render() {
        const { theme, typo } = this.context;
        const { status, refreshing, stories, extraData } = this.state;

        return (
            <View style={css.container}>
                <FlatList
                    data={stories}
                    extraData={extraData}
                    renderItem={this.renderItem}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    progressViewOffset={TOPBAR_SPACE}
                    contentContainerStyle={[css.list, stories.length === 0 && { flex: 1 }]}
                    ListFooterComponent={stories.length > 0 && (
                        <View style={{ padding: typo.padding }}>
                            <Text>Story</Text>
                            <View>
                                <Text>{JSON.stringify(this.context, null ,2)}</Text>
                            </View>
                            <TouchableHighlight onPress={() => Alert.alert('1')}>
                                <View style={{ elevation: 1,borderWidth:0, padding: typo.padding, backgroundColor: '#dddddd' }}>
                                    <Text>touchable</Text>
                                </View>
                            </TouchableHighlight>
                            <Touchable onPress={this.sendNotification}>
                                <View style={{ padding: typo.padding }}>
                                    <Text>发送通知</Text>
                                </View>
                            </Touchable>
                            <Button title="第二个页面" onPress={() => Navigation.push('root',{component:{name:'settings'}})} />
                        </View>
                    )}
                    ListEmptyComponent={(
                        <Empty
                            style={{ position: 'relative', top: -typo.padding }}
                            more={(
                                <>
                                    <Text style={{ marginTop: typo.margin }}>试试下拉刷新</Text>
                                    <Text>或者<Link to="rss">去添加一个RSS源</Link></Text>
                                </>
                            )}
                        />
                    )}
                    /* Performance */
                    // debug
                    windowSize={9}
                    updateCellsBatchingPeriod={50}
                    disableScrollViewPanResponder
                    // Android only
                    endFillColor={theme.background}
                    fadingEdgeLength={10}
                    nestedScrollEnabled={false}
                    overScrollMode="always"
                />
                <Topbar status={status} data={{ filter: extraData }} onFilter={this.onFilter} />
            </View>
        );
    }
}
Story.contextType = AppContext;

const css = StyleSheet.create({
    container: {
        flex: 1,
    },
    topbar: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: BASE_SPACE,
        height: 48,
        elevation: 4,
        borderRadius: 4,
        overflow: 'hidden',
    },
    list: {
        // flex: 1,
        paddingTop: TOPBAR_SPACE,
    },
});

export default Story;
