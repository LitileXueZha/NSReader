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
import MRSS from '../../models/RSS.js';
import MStory from '../../models/Story.js';
import Perf from '../../utils/Perf.js';
import { IDStoryDetail } from '../IDSymbols.js';
import ScrollToTop, { setScrollTop } from '../../components/ScrollToTop.js';


class Story extends Component {
    constructor() {
        super();
        this.stories = MStory.data;
        this.state = {
            status: MStory.initialized ? STATUS_DONE : STATUS_LOADING,
            // status: STATUS_DONE,
            refreshing: false,
            stories: [],
            extraData: {
                summary: AppSettings.get('story.filter.summary'),
                read: AppSettings.get('story.filter.read'),
                today: AppSettings.get('story.filter.today'),
                last: AppSettings.get('story.sort.last'),
            },
            scrollTop: false,
        };
        this.scrollRef = React.createRef();
        this.onScroll = setScrollTop.bind(this);
        this.state.stories = doFilter(this.stories, this.state.extraData);
    }

    componentDidMount() {
        this.setup();
    }

    setup = async () => {
        if (MStory.initialized) return;

        try {
            await MRSS.init();
            await MStory.init();
            this.stories = MStory.data;

            const { extraData } = this.state;
            const stories = doFilter(this.stories, extraData);
            this.setState({ stories, status: STATUS_DONE });
        } catch (e) {
            Perf.error(e);
        }
    }

    onRefresh = async () => {
        this.setState({ refreshing: true });
        const storyCached = await MStory.existCache();
        // Cache cleared or after backup
        if (!storyCached) {
            await MRSS.init();
            await MRSS.parseLocalStory();
        }
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

        const intValue = +value;
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

    onEndReached = async (info) => {
        if (!MStory.more) return;

        const { id } = this.stories[this.stories.length - 1];
        await MStory.load(id);
        this.stories = MStory.data;
        const { extraData } = this.state;
        const stories = doFilter(this.stories, extraData);
        this.setState({ stories });
    }

    onStoryPress = (item) => {
        const index = this.stories.findIndex((v) => v.id === item.id);
        Navigation.push('root', {
            component: {
                name: IDStoryDetail,
                passProps: { route: { index } },
            },
        });
    }

    onScrollTop = () => {
        this.scrollRef.current.scrollToOffset({ offset: 0 });
    }

    renderItem = ({ item, index }) => {
        const { extraData } = this.state;
        let flagIndex = index > 0 && index % 20 === 0 && index;
        if (index === 0 && item.flagPast) {
            // flagPast is added in `doFilter`
            delete item.flagPast;
        } else if ((index > 0 && index % 20 === 0) || item.flagPast) {
            flagIndex = index;
        }
        return (
            <StoryItem
                key={item.id}
                data={item}
                flagIndex={flagIndex}
                hideSummary={!extraData.summary}
                onPress={this.onStoryPress}
            />
        );
    };

    render() {
        const { theme, typo } = this.context;
        const { status, refreshing, stories, extraData, scrollTop } = this.state;

        return (
            <View style={css.container}>
                <FlatList
                    ref={this.scrollRef}
                    onScroll={this.onScroll}
                    data={stories}
                    extraData={extraData}
                    renderItem={this.renderItem}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    progressViewOffset={TOPBAR_SPACE}
                    onEndReached={this.onEndReached}
                    contentContainerStyle={[css.list, stories.length === 0 && { flex: 1 }]}
                    ListFooterComponent={stories.length > 0 && (
                        <View style={{ padding: typo.padding + 4, marginTop: typo.margin * 2 }}>
                            <Text style={{ fontSize: typo.fontSizeSmall, textAlign: 'center' }} secondary>
                                {MStory.more ? '正在读取更多\n...' : '结尾了'}
                            </Text>
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
                <ScrollToTop visible={scrollTop} onPress={this.onScrollTop} />
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
