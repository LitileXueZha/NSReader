import React, { Component } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    View,
    InteractionManager,
    Alert,
    Share,
} from 'react-native';
import WebView from 'react-native-webview';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import fs from 'react-native-fs';

import { AppContext } from '../../../AppContext.js';
import C from '../../../components/globalCSSStyles.js';
import Navbar from '../../../components/Navbar.js';
import Text from '../../../components/SText.js';
import Perf from '../../../utils/Perf.js';
import loadTemplate from './loadTemplate.js';
import MRSS from '../../../models/RSS.js';
import MStory from '../../../models/Story.js';
import Favicon from '../../../components/Favicon.js';
import format from '../../../utils/format.js';
import { prettyText } from '../StoryItem.js';
import ScrollToTop, { setScrollTop } from '../../../components/ScrollToTop.js';
import { goBack, openLink } from '../../../components/Link.js';
import themeStyles from './themeStyles.js';
import { GOLD_RATIO } from '../../../themes/typography.js';

const KEY = '__HTML_STORY__';
const KEY_CSS = '/*!__CSS_THEME__*/';
const WHITELIST = ['*'];
const REG_NAME_EMAIL = /\s<.+>/; // name <email@e.com>

class StoryDetail extends Component {
    constructor(props) {
        super();
        this.state = {
            html: null,
            height: 0,
            scrollTop: false,
        };
        this.onScroll = setScrollTop.bind(this);
        this.data = MStory.data.find((v) => v.id === props.route?.id);
        this.rss = MRSS.data[this.data?.pid];
        this.MENUS = [{
            id: 'share',
            text: '分享',
        }, {
            id: 'open',
            text: '在浏览器中打开',
        }, {
            id: 'feedback',
            text: '反馈',
        }];
        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        if (!this.data) {
            Alert.alert(null, '未知数据', [{
                text: '返回',
                onPress: goBack,
            }]);
            return;
        }
        InteractionManager.runAfterInteractions(this.setup);
        // this.setup();
    }

    setup = async () => {
        Perf.start();
        const tpl = await loadTemplate();
        const storyHtml = await MStory.loadHtml(this.data.id);
        const storySanitized = sanitize(storyHtml);
        const themeCSS = themeStyles(this.context);
        const html = tpl.replace(KEY_CSS, themeCSS).replace(KEY, storySanitized);

        this.setState({ html });
    }

    onLoadEnd = () => {
        Perf.info('WebView loadEnd');
    }

    onMessage = (ev) => {
        const { data } = ev.nativeEvent;
        try {
            const { height } = JSON.parse(data);
            this.setState({ height });
        } catch (e) {}
    }

    onShouldStartLoadWithRequest = (req) => {
        const { url } = req;
        if (url.startsWith('http') || url.startsWith('rss')) {
            openLink(url);
        }
        return false;
    }

    onScrollTop = () => {
        this.scrollRef.current.scrollTo({ y: 0 });
    }

    onMenuPress = (index) => {
        const { title, link } = this.data;
        switch (this.MENUS[index].id) {
            case 'share':
                Share.share({
                    message: `${title} - NSReader`,
                    title: this.rss.title,
                    url: link,
                });
                break;
            case 'open':
                link && openLink(link);
                break;
            case 'feedback':
                openLink('https://github.com/LitileXueZha/NSReader/issues');
                break;
            default:
                break;
        }
    }

    render() {
        const { theme, typo } = this.context;
        const { html, height, scrollTop } = this.state;

        if (!this.data) {
            return null;
        }
        const { title, date, author } = this.data;
        const titleStyle = [typo.h1, {
            marginTop: typo.margin,
            marginBottom: 4,
            lineHeight: typo.h1.fontSize * 1.15,
        }];
        return (
            <>
                <Navbar title="详情" menus={this.MENUS} onMenuPress={this.onMenuPress} />
                <ScrollView
                    style={C.f1}
                    ref={this.scrollRef}
                    nestedScrollEnabled={false}
                    onScroll={this.onScroll}
                >
                    <View style={{ padding: typo.padding }}>
                        <View style={[css.rssRow, { backgroundColor: theme.bgStoryDetailOnRSS }]}>
                            <Favicon id={this.rss.id} size={typo.mSize} radius={typo.mSize} />
                            <Text style={[css.rssTitle, { fontSize: typo.fontSizeSmall }]} numberOfLines={1} secondary>
                                {this.rss.alias || this.rss.title}
                            </Text>
                        </View>
                        <Text style={titleStyle} selectable>{prettyText(title)}</Text>
                        <View style={C.flex.row}>
                            <Text style={C.fs12} secondary>{format.date(date)}</Text>
                            {author && (
                                <Text style={css.author} numberOfLines={1}>
                                    {author.replace(REG_NAME_EMAIL, '')}
                                </Text>
                            )}
                        </View>
                    </View>
                    {html && (
                        <WebView
                            style={{ height, backgroundColor: 'transparent' }}
                            source={{ html }}
                            onError={Perf.error}
                            originWhitelist={WHITELIST}
                            onMessage={this.onMessage}
                            onLoadEnd={this.onLoadEnd}
                            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                            // Disable scroll behaviors
                            overScrollMode="never"
                            scrollEnabled={false}
                            nestedScrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />
                    )}
                    {height === 0 && (
                        <View style={css.loading}>
                            {/* <ActivityIndicator color={theme.primaryColor} size="large" /> */}
                            <SimpleLineIcon name="direction" size={32} color={theme.fontColorSecond} />
                            <Text style={{ fontSize: typo.fontSizeSmall }} secondary>正在加载</Text>
                        </View>
                    )}
                </ScrollView>
                <ScrollToTop visible={scrollTop} onPress={this.onScrollTop} />
            </>
        );
    }
}
StoryDetail.contextType = AppContext;
/** @type {import('react-native-navigation').Options} */
// StoryDetail.options = {
//     topBar: {
//         visible: true,
//         title: { text: '详情' },
//         rightButtons: [{
//             id: 'share',
//             text: '分享',
//             showAsAction: 'never',
//         }, {
//             id: 'open',
//             text: '在浏览器中打开',
//             showAsAction: 'never',
//         }, {
//             id: 'feedback',
//             text: '反馈',
//             showAsAction: 'never',
//         }],
//     },
// };

const css = StyleSheet.create({
    rssRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        padding: 6,
        paddingHorizontal: 6 / GOLD_RATIO,
    },
    rssTitle: {
        marginLeft: 6,
        flex: 1,
        flexShrink: 1,
    },
    loading: {
        alignItems: 'center',
        marginTop: 56,
    },
    author: {
        flexShrink: 1,
        marginLeft: 4,
        fontSize: 12,
    },
});

// Remove scripts and links opened in new window
const REG_SANITIZE = /(target="_blank"|<script.*?>.*?<\/script>)/gm;
function sanitize(html) {
    return html.replace(REG_SANITIZE, '');
}

export default StoryDetail;
