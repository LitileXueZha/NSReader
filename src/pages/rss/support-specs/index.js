import React, { Component } from 'react';
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../../../AppContext.js';
import Navbar from '../../../components/Navbar.js';
import Text from '../../../components/SText.js';
import C from '../../../components/globalCSSStyles.js';
import { TouchHighlight } from '../../../components/Touchable.js';
import { SPECIFICATIONS } from '../../../utils/RSSParser.js';
import Link from '../../../components/Link.js';

const select = (key) => ({
    title: SPECIFICATIONS[key].maps.title,
    date: SPECIFICATIONS[key].maps.date,
    description: SPECIFICATIONS[key].maps.description,
});
function getList() {
    const list = [];
    for (const key in SPECIFICATIONS) {
        if (key !== 'ATOM' && key !== 'RSS') {
            list.push(SPECIFICATIONS[key].name);
        }
    }
    return list;
}
const codeFont = Platform.select({
    android: 'monospace',
    ios: 'Menlo',
});

class SupportSpecs extends Component {
    constructor() {
        super();
        this.state = {
            expandIndex: -1,
        };
        this.ATOMString = JSON.stringify(select('ATOM'), null, 2);
        this.RSSString = JSON.stringify(select('RSS'), null, 2);
        const thirdList = getList();
        this.THIRDString = thirdList.length > 0 ? thirdList.join('\n') : '暂无';
    }

    toggleExpand = (index) => {
        const { expandIndex } = this.state;
        let displayIndex = -1;
        if (expandIndex === -1) {
            displayIndex = index;
        } else if (expandIndex !== index) {
            displayIndex = index;
        } else {
            displayIndex = -1;
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expandIndex: displayIndex });
    };

    iconName = (index) => {
        const { expandIndex } = this.state;
        if (expandIndex === index) {
            return 'caret-down';
        }
        return 'caret-forward';
    }

    render() {
        const { theme, typo } = this.context;
        const titleStyles = {
            marginTop: typo.margin * 2,
            marginBottom: 4,
            paddingHorizontal: typo.padding,
            fontSize: typo.fontSizeSmall,
        };
        const rowStyles = {
            padding: typo.padding,
        };
        const dividerStyles = {
            marginLeft: typo.padding,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: theme.borderColor,
        };
        const codeStyles = {
            padding: typo.padding,
            paddingTop: 0,
            fontSize: typo.fontSizeSmall,
            fontFamily: codeFont,
            lineHeight: typo.fontSize,
            // color: theme.fontColorSecond,
        };
        const { expandIndex } = this.state;

        return (
            <>
                <Navbar title="支持的RSS源格式" />
                <ScrollView style={[C.f1, { backgroundColor: theme.bgPaperInset }]}>
                    <Text style={titleStyles} secondary>标准</Text>
                    <View style={{ backgroundColor: theme.background, overflow: 'hidden' }}>
                        <TouchHighlight onPress={() => this.toggleExpand(0)}>
                            <View style={rowStyles}>
                                <View style={[C.flex.row, css.row]} pointerEvents="none">
                                    <Text>Atom 1.0</Text>
                                    <Icon name={this.iconName(0)} color={theme.fontColorSecond} size={typo.mSize} />
                                </View>
                            </View>
                        </TouchHighlight>
                        {expandIndex === 0 && (
                            <ScrollView horizontal>
                                <Text style={codeStyles} selectable>
                                    {this.ATOMString}
                                </Text>
                            </ScrollView>
                        )}
                        <View style={dividerStyles} />
                        <TouchHighlight onPress={() => this.toggleExpand(1)}>
                            <View style={rowStyles}>
                                <View style={[C.flex.row, css.row]} pointerEvents="none">
                                    <Text>RSS 2.0</Text>
                                    <Icon name={this.iconName(1)} color={theme.fontColorSecond} size={typo.mSize} />
                                </View>
                            </View>
                        </TouchHighlight>
                        {expandIndex === 1 && (
                            <ScrollView horizontal>
                                <Text style={codeStyles} selectable>
                                    {this.RSSString}
                                </Text>
                            </ScrollView>
                        )}
                    </View>
                    <Text style={titleStyles} secondary>第三方</Text>
                    <View style={{ backgroundColor: theme.background, padding: typo.padding }}>
                        <Text>{this.THIRDString}</Text>
                    </View>
                    <Link
                        style={[C.text.R, { padding: typo.padding }]}
                        to="https://github.com/LitileXueZha/NSReader/issues"
                        underline
                    >
                        帮助我们支持更多的RSS源
                    </Link>
                </ScrollView>
            </>
        );
    }
}
SupportSpecs.contextType = AppContext;

const css = StyleSheet.create({
    row: {
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

export default SupportSpecs;
