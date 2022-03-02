import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    InteractionManager,
} from 'react-native';

import { AppContext } from '../../AppContext.js';
import { BASE_SPACE } from '../../themes/typography.js';
import Text from '../../components/SText.js';
import Notification from '../../utils/notification.js';
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
import Link, { goto } from '../../components/Link.js';
import MRSS from '../../models/RSS.js';
import MStory from '../../models/Story.js';
import Perf from '../../utils/Perf.js';
import { IDStoryDetail } from '../IDSymbols.js';
import ScrollToTop, { setScrollTop } from '../../components/ScrollToTop.js';
import { createPanResponder, AttachFeatures } from './easymode.js';


const ID_ALL = Symbol('all');

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
        this.channels = [
            { id: ID_ALL, text: '全部', badge: 0 },
        ];
        this.channelId = ID_ALL;
        this.lockScrollEnd = false;
        this.featRef = React.createRef();
        this.panResponder = {};
        this.pastId = undefined;
    }

    componentDidMount() {
        this.setup();
        this.panResponder = createPanResponder(this.featRef.current);
    }

    setup = async () => {
        try {
            await MRSS.init();
            await MStory.init();
            this.stories = MStory.data;
            this.setupChannels();

            const stories = this.reFilter();
            this.setState({ stories, status: STATUS_DONE });
        } catch (e) {
            Perf.error(e);
        }
    }

    setupChannels = () => {
        const list = MRSS.countList;
        this.channels = [].concat(this.channels);
        for (const item of list) {
            const { id, title, total } = item;
            this.channels[0].badge += item.total;
            this.channels.push({ id, text: title, badge: total });
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

            this.state.extraData = newExtraData;
            this.setState({
                extraData: newExtraData,
                stories: this.reFilter(),
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

    reFilter = () => {
        const { extraData } = this.state;
        const showAll = this.channelId === ID_ALL;
        const channelStories = showAll
            ? this.stories
            : this.stories.filter((v) => v.pid === this.channelId);
        const stories = doFilter(channelStories, extraData);
        this.pastId = stories.flagPastId;

        return stories;
    }

    onChannelChange = async (channel) => {
        const { id, badge } = channel;
        if (id === this.channelId) return;

        this.channelId = id;
        const stories = this.reFilter();

        if (stories.length === 0 && badge > 0) {
            // Load more
            return this.onEndReached();
        }

        this.setState({ stories });
    }

    onEndReached = async (info) => {
        if (!MStory.more || this.lockScrollEnd) return;

        const { id } = this.stories[this.stories.length - 1];
        // Add a lock for unexpected onEndReached event fired by setState() or bounce
        this.lockScrollEnd = true;
        try {
            await MStory.load(id);
            this.stories = MStory.data;

            const stories = this.reFilter();
            // Progressive display
            this.setState({ stories });
            this.lockScrollEnd = false;
            // Not enough items in one screen, load more
            if (stories.length < 10) {
                return this.onEndReached();
            }
        } catch (e) {
            this.lockScrollEnd = false;
            Perf.error(e);
        }
    }

    onStoryPress = (item) => {
        const { id } = item;
        goto(IDStoryDetail, { id });
    }

    onScrollTop = () => {
        this.scrollRef.current.scrollToOffset({ offset: 0 });
    }

    renderItem = ({ item, index }) => {
        const { extraData } = this.state;
        let flagIndex = index > 0 && index % 20 === 0 && index;
        // pastId is added in `doFilter`
        let flagPast = item.id === this.pastId;
        if (index === 0 && flagPast) {
            flagPast = false;
        } else if ((index > 0 && index % 20 === 0) || flagPast) {
            flagIndex = index;
        }
        return (
            <StoryItem
                key={item.id}
                data={item}
                flagIndex={flagIndex}
                flagPast={flagPast}
                hideSummary={!extraData.summary}
                onPress={this.onStoryPress}
            />
        );
    };

    render() {
        const { theme, typo } = this.context;
        const { status, refreshing, stories, extraData, scrollTop } = this.state;

        return (
            <>
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
                        <View style={{ marginVertical: typo.margin * 2 }}>
                            <Text style={{ fontSize: typo.fontSizeSmall, textAlign: 'center' }} secondary>
                                {MStory.more ? `上拉读取更多\n${this.stories.length}/${this.channels[0].badge}` : '结尾了'}
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
                    {...this.panResponder}
                    /* Performance */
                    // debug
                    windowSize={9}
                    updateCellsBatchingPeriod={50}
                    // Android only
                    endFillColor={theme.background}
                    fadingEdgeLength={10}
                    nestedScrollEnabled={false}
                    overScrollMode="always"
                />
                <Topbar
                    status={status}
                    data={{ filter: extraData, channels: this.channels }}
                    onFilter={this.onFilter}
                    onChannelChange={this.onChannelChange}
                />
                <ScrollToTop visible={scrollTop} onPress={this.onScrollTop} />
                <AttachFeatures ref={this.featRef} />
            </>
        );
    }
}
Story.contextType = AppContext;

const css = StyleSheet.create({
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
