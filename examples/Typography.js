import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
} from 'react-native';
import {
    StyleView,
    StyleText,
    StyleTextH1,
    StyleTextH2,
} from './components/Style.js';
import { ThemeContext } from './themes';

/**
 * Test typography in this component
 * 
 * @see https://getbootstrap.com/docs/5.0/content/typography/
 */
export default class Typography extends Component {
    render() {
        const { theme, typo } = this.context;
        const {
            fontSizeSmall,
            fontColorSecond,
        } = theme;
        const { goldRatio, margin } = typo;
        return (
            <ScrollView>
                <StyleView style={{ marginTop: 0 }}>
                    <StyleTextH1>Typography Header H1.</StyleTextH1>
                    <StyleTextH2>Typography Header H2.</StyleTextH2>
                    <StyleText style={{ fontSize: fontSizeSmall, color: fontColorSecond }}>
                        2021/10/12
                    </StyleText>
                    <StyleText style={{ marginTop: margin * goldRatio }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Possimus qui nemo molestiae incidunt beatae numquam explicabo culpa, vitae corporis omnis?
                        Quas soluta iste culpa molestiae, veniam nam id molestias a?
                    </StyleText>
                    <StyleText style={{ marginTop: margin * goldRatio }}>
                        React Native 将原生开发的最佳部分与 React 相结合， 致力于成为构建用户界面的顶尖 JavaScript 框架。
                        酌量添加，多少随意。随时都可以把 React Native 无缝集成到你已有的 Android 或 iOS 项目，当然也可以完全从头焕然一新地重写。
                    </StyleText>
                </StyleView>
            </ScrollView>
        );
    }
}

Typography.contextType = ThemeContext;
