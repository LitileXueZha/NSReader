import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    InteractionManager,
    BackHandler,
    Alert,
    Pressable,
    ToastAndroid,
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
import ModalSelect from '../../components/ModalSelect.js';
import $ev from '../../utils/Event.js';
import { debounce, throttle } from '../../utils/index.js';


const initChannels = () => [{ id: 'all', text: '全部', badge: 0 }];

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
            visible: false,
        };
        this.scrollRef = React.createRef();
        this.channels = initChannels();
        this.channelIdx = 0;
        this.lockScrollEnd = false;
        this.featRef = React.createRef();
        this.panResponder = {};
        this.pastId = undefined;
    }

    componentDidMount() {
        this.setup();
        this.panResponder = createPanResponder(this.featRef.current);
        $ev.on('rsschange', this.update);
        $ev.on('storychange', this.update);
    }

    componentWillUnmount() {
        $ev.off('rsschange', this.update);
        $ev.off('storychange', this.update);
    }

    // eslint-disable-next-line react/sort-comp
    setup = async () => {
        try {
            await MRSS.init();
            await MStory.init();
            const storyCached = await MStory.existCache();
            // Cache cleared or after backup
            if (!storyCached) {
                await MRSS.parseLocalStory();
                BackHandler.addEventListener('hardwareBackPress', this.tasksExitWarning);
            }
            this.update();
            this.setState({ status: STATUS_DONE });
            setTimeout(() => {
                this.scrollRef.current.scrollToIndex({
                    animated: false,
                    index: 3,
                    viewOffset: TOPBAR_SPACE,
                });
            }, 1000);
        } catch (e) {
            Perf.error(e);
        }
    }

    // eslint-disable-next-line react/sort-comp
    update = debounce(() => {
        this.stories = MStory.data;
        this.setupChannels();
        const stories = this.filter();
        this.setState({ stories });
    })

    setupChannels = () => {
        const list = MRSS.countList;
        this.channels = initChannels();
        for (const item of list) {
            const {
                id, title, alias, total,
            } = item;
            this.channels[0].badge += item.total;
            this.channels.push({ id, text: alias || title, badge: total });
        }
    }

    onRefresh = async () => {
        if (this.state.extraData.last) {
            this.setState({ refreshing: true });
            await this.load();
            this.setState({ refreshing: false });
        }
    }

    tasksExitWarning = () => {
        if (MStory._cacheWriting) {
            Alert.alert('稍等', '后台任务仍在进行中', [{
                text: '退出',
                style: 'destructive',
                onPress: () => {
                    BackHandler.removeEventListener('hardwareBackPress', this.tasksExitWarning);
                    BackHandler.exitApp();
                },
            }], { cancelable: true });
            return true;
        }
        BackHandler.removeEventListener('hardwareBackPress', this.tasksExitWarning);
        return false;
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
                stories: this.filter(),
            });
        });

        const intValue = +value;
        switch (type) {
            case 'summary':
            case 'read':
            case 'today':
                AppSettings.store(`story.filter.${type}`, intValue);
                break;
            case 'last':
                AppSettings.store(`story.sort.${type}`, intValue);
                break;
            default:
                break;
        }
    }

    filter = () => {
        const { extraData } = this.state;
        const showAll = this.channelIdx === 0;
        const { id } = this.channels[this.channelIdx];
        const channelStories = showAll
            ? this.stories
            : this.stories.filter((v) => v.pid === id);
        const stories = doFilter(channelStories, extraData);
        this.pastId = stories.flagPastId;

        return stories;
    }

    onTopbarPress = () => {
        this.setState({ visible: true });
    }

    onChannelChange = async (index) => {
        this.setState({ visible: false });
        if (index === this.channelIdx) {
            return;
        }

        requestAnimationFrame(() => {
            this.channelIdx = index;
            const stories = this.filter();
            const { badge: total } = this.channels[index];

            if (stories.length === 0 && total > 0) {
                // Load more
                this.load();
            }
            this.setState({ stories });
        });
    }

    onEndReached = async (info) => {
        if (!this.state.extraData.last) {
            this.load();
        }
    }

    load = async () => {
        if (!MStory.more || this.lockScrollEnd) return;

        // Add a lock for unexpected onEndReached event fired by setState() or bounce
        this.lockScrollEnd = true;
        try {
            const { id } = this.stories[this.stories.length - 1];

            await MStory.load(id);
            this.stories = MStory.data;

            const stories = this.filter();
            const fixedLastOfCurrentIndex = stories.length - this.state.stories.length;
            // Progressive display
            this.setState({ stories });
            this.lockScrollEnd = false;
            const { badge: total } = this.channels[this.channelIdx];
            // Not enough items in one screen, load more
            if (stories.length < 10 && stories.length < total) {
                requestAnimationFrame(this.load);
                return;
                // return this.onEndReached();
            }

            // When older stories are list on the top, we need to show the current
            // instead of the top
            if (this.state.extraData.last && fixedLastOfCurrentIndex > 0) {
                this.scrollRef.current.scrollToIndex({
                    animated: false,
                    index: fixedLastOfCurrentIndex,
                    viewOffset: 20,
                });
            }
        } catch (e) {
            this.lockScrollEnd = false;
            Perf.error(e);
        }
    }

    onTopReached = () => {
        if (this.state.extraData.last) {
            console.log('update lastID');
        }
    };

    topReachedScroll = throttle((y, vy) => {
        if (vy < 0 && y < 50) {
            this.onTopReached();
        }
    });

    onStoryPress = (item) => {
        const { id } = item;
        goto(IDStoryDetail, { id });
    }

    onScroll = (e) => {
        const { contentOffset, velocity } = e.nativeEvent;
        const { y } = contentOffset;

        this.topReachedScroll(y)(y, velocity.y);
        setScrollTop.call(this, e);
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
        const footerStyle = {
            paddingVertical: typo.margin * 2,
            fontSize: typo.fontSizeSmall,
            color: theme.fontColorSecond,
            textAlign: 'center',
        };
        const {
            status, refreshing, stories, extraData, scrollTop, visible,
        } = this.state;

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
                        extraData.last ? (
                            <Text style={footerStyle}>结尾了</Text>
                        ) : (
                            <Pressable onPress={this.load}>
                                <Text style={footerStyle}>
                                    {MStory.more ? `正在读取更多\n${this.stories.length}/${this.channels[0].badge}` : '结尾了'}
                                </Text>
                            </Pressable>
                        )
                    )}
                    ListEmptyComponent={(
                        <Empty
                            style={{ position: 'relative', top: -typo.padding }}
                            more={(
                                <>
                                    <Text>{'\n试试下拉刷新'}</Text>
                                    <Text>
                                        或者
                                        <Link to="rss">去添加一个RSS源</Link>
                                    </Text>
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
                    data={{ filter: extraData, channel: this.channels[this.channelIdx] }}
                    onFilter={this.onFilter}
                    onPress={this.onTopbarPress}
                />
                <ModalSelect
                    title="选择RSS源"
                    datalist={this.channels}
                    visible={visible}
                    onClose={this.onChannelChange}
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
