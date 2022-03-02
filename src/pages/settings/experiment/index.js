import React, { Component } from 'react';
import {
    View,
    Alert,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../../../AppContext.js';
import Text from '../../../components/SText.js';
import SettingItem from '../SettingItem.js';
import Navbar from '../../../components/Navbar.js';
import { goto } from '../../../components/Link.js';
import Perf from '../../../utils/Perf.js';
import C from '../../../components/globalCSSStyles.js';


class Experiment extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const { theme, typo } = this.context;
        const sectionStyle = {
            backgroundColor: theme.background,
            marginTop: typo.margin,
            // borderRadius: 6,
        };
        const textStyle = {
            flexShrink: 1,
            marginLeft: typo.margin,
            color: theme.dangerColor,
            fontSize: typo.fontSizeSmall,
            lineHeight: typo.fontSizeSmall + 4,
        };

        return (
            <>
                <Navbar title="实验性功能" />
                <ScrollView style={{ flex: 1, backgroundColor: theme.bgPaperInset }}>
                    <View style={[css.area, { backgroundColor: theme.background, padding: typo.padding + 4 }]}>
                        <Icon name="flask" size={typo.mSize} color={theme.dangerColor} style={css.areaIcon} />
                        <Text style={textStyle}>
                            这些都是不稳定的功能，在开发计划中但也可能不会被实现；
                            有些可用，有些并不可用或无法达到预期效果；
                            产生的问题不必提出反馈。
                        </Text>
                    </View>
                    <View style={sectionStyle}>
                        <SettingItem
                            type="link"
                            text="插件"
                            tips="额外的功能，下载后启用。例如 highlight"
                        />
                        <SettingItem
                            type="checkbox"
                            text="RTL"
                            tips="文本布局从右向左"
                        />
                        <SettingItem
                            type="link"
                            text="代理"
                        />
                        <SettingItem
                            text="优化存储"
                            tips="合并已下载的重复数据文件"
                        />
                        <SettingItem
                            type="link"
                            text="WebRTC"
                            tips="本地实时评论系统（需要一个中间协调服务器）"
                            borderless
                        />
                    </View>
                </ScrollView>
            </>
        );
    }
}
Experiment.contextType = AppContext;

const css = StyleSheet.create({
    area: {
        flexDirection: 'row',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    areaIcon: {
        top: 5,
    },
});

export default Experiment;
