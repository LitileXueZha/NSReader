import React, { Component } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    View,
    InteractionManager,
} from 'react-native';
import WebView from 'react-native-webview';

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
import { openLink } from '../../../components/Link.js';
import themeStyles from './themeStyles.js';
import { GOLD_RATIO } from '../../../themes/typography.js';

const KEY = '__HTML_STORY__';
const KEY_CSS = '/*!__CSS_THEME__*/';
const WHITELIST = ['*'];

class StoryDetail extends Component {
    constructor(props) {
        super();
        this.state = {
            html: null,
            height: 0,
            scrollTop: false,
        };
        this.onScroll = setScrollTop.bind(this);
        this.data = MStory.data[props.route?.index];
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

    onMessage = (e) => {
        const { data } = e.nativeEvent;
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

    render() {
        const { theme, typo } = this.context;
        const { html, height, scrollTop } = this.state;

        return (
            <>
                <Navbar title="详情" menus={this.MENUS} />
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
                                {this.rss.title}
                            </Text>
                        </View>
                        <Text style={[typo.h1, css.title, { lineHeight: typo.h1.fontSize * 1.15, marginTop: typo.margin }]}>
                            {prettyText(this.data.title)}
                        </Text>
                        <View style={C.flex.row}>
                            <Text style={C.fs12} secondary>{format.date(this.data.date)}</Text>
                            {this.data.author && (
                                <Text style={[C.fs12, C.margin.l4]}>{this.data.author}</Text>
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
                </ScrollView>
                <ScrollToTop visible={scrollTop} onPress={this.onScrollTop} />
            </>
        );
    }
}
StoryDetail.contextType = AppContext;

const css = StyleSheet.create({
    rssRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        padding: 6,
        paddingHorizontal: 6 / GOLD_RATIO,
    },
    rssTitle: {
        marginLeft: 4,
        flex: 1,
        flexShrink: 1,
    },
    title: {
        marginBottom: 4,
    },
});

// Remove scripts and links opened in new window
const REG_SANITIZE = /(target="_blank"|<script.*?>.*?<\/script>)/gm;
function sanitize(html) {
    return html.replace(REG_SANITIZE, '');
}

export default StoryDetail;
