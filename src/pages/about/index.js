import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../../AppContext.js';
import Text from '../../components/SText.js';
import { TouchHighlight } from '../../components/Touchable.js';
import SettingItem from '../settings/SettingItem.js';
import Navbar from '../../components/Navbar.js';
import { openLink } from '../../components/Link.js';

class About extends Component {
    constructor() {
        super();
        this.state = {};
    }

    shareApp = () => {
        Share.share({
            message: '快来使用这个APP',
            url: '',
            title: 'NSReader',
        });
    }

    goFeedback = () => {
        openLink('https://github.com/LitileXueZha/NSReader/issues');
    }

    render() {
        const { theme, typo } = this.context;

        return (
            <>
                <Navbar
                    title="关于"
                    rightViews={(
                        <TouchHighlight onPress={this.shareApp}>
                            <View style={{ padding: typo.padding }}>
                                <Icon name="share-social" size={typo.fontHeight} color={theme.fontColor} />
                            </View>
                        </TouchHighlight>
                    )}
                />
                <ScrollView style={{ flex: 1, backgroundColor: theme.bgPaperInset }}>
                    <View style={{ backgroundColor: theme.background, marginTop: typo.margin }}>
                        <SettingItem
                            text="版本"
                            tips={__BUILD__}
                            value={__VERSION__}
                            disableTouchEffect
                        />
                        <SettingItem
                            text="开发者"
                            value="@litilexuezha"
                            disableTouchEffect
                        />
                    </View>
                    <View style={{ backgroundColor: theme.background, marginTop: typo.margin }}>
                        <SettingItem
                            text="检查更新"
                            icon={<ActivityIndicator />}
                        />
                        <SettingItem
                            type="link"
                            text="问题与反馈"
                            tips="去 Github 上创建 issue"
                            onPress={this.goFeedback}
                        />
                        <SettingItem
                            text="捐赠"
                            tips="盼君兮敢吾羞以～"
                        />
                    </View>
                    <View style={{ backgroundColor: theme.background, marginTop: typo.margin }}>
                        <SettingItem
                            type="link"
                            text="开源许可"
                        />
                        <SettingItem
                            text="其它贡献者"
                            tips="没有他们也就没有此应用"
                            value="thanks"
                            icon={<Icon name="ribbon" size={typo.mSize} color={theme.fontColorSecond} />}
                            disableTouchEffect
                        />
                    </View>
                </ScrollView>
            </>
        );
    }
}
About.contextType = AppContext;

const css = StyleSheet.create({
    title: {
        marginTop: 40,
    },
});

export default About;
