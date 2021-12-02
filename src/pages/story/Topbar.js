import React, { useContext, useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Checkbox from '@react-native-community/checkbox';

import { BASE_SPACE, GOLD_RATIO } from '../../themes/typography.js';
import { AppContext } from '../../AppContext.js';
import Text from '../../components/SText.js';
import ModalSelect from '../../components/ModalSelect.js';
import Badge from '../../components/Badge.js';
import Touchable, { TouchHighlight } from '../../components/Touchable.js';

export const STATUS_LOADING = 0;
export const STATUS_UPDATING = 1;
export const STATUS_DONE = 2;

const TEXT_LOADING = '加载本地文件...';
const TEXT_UPDATING = '更新RSS源...';
const STATUS_TEXT = [TEXT_LOADING, TEXT_UPDATING];
const SIZE = 24; // icon size, checkbox height...

function Topbar(props) {
    const { status, data, onFilter } = props;
    const { theme, typo } = useContext(AppContext);
    const cssTopbar = {
        left: typo.margin,
        right: typo.margin,
        backgroundColor: theme.bgStoryTopbar,
    };
    const cssFilterTitle = {
        color: theme.fontColorSecond,
        paddingLeft: SIZE + typo.padding * 2,
    };
    const cssCheckbox = {
        width: SIZE + typo.padding * 2,
        alignItems: 'flex-end',
    };
    const ppCheckbox = {
        style: { height: SIZE },
        tintColors: {
            false: theme.fontColorSecond,
            true: theme.primaryColor,
        },
    };
    const loaded = status === STATUS_DONE;
    const [filterOpen, setFilterOpen] = useState(false);
    const openFilterMenu = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFilterOpen(!filterOpen);
    };
    const [pickVisible, setPickVisible] = useState(false);
    const openChannelPicker = () => {
        setPickVisible(true);
    };
    const onPickClose = (idx) => {
        setPickVisible(false);
        console.log(idx);
    };

    return (
        <View style={[css.topbar, cssTopbar]}>
            <View style={css.body}>
                {!loaded && (
                    <>
                        <ActivityIndicator style={{ marginHorizontal: typo.margin }} />
                        <Text>{STATUS_TEXT[status]}</Text>
                    </>
                )}
                {loaded && (
                    <>
                        <Touchable onPress={openChannelPicker}>
                            <View style={css.channel}>
                                <Icon name="list" size={SIZE} color={theme.fontColor} style={{ marginHorizontal: typo.padding }} />
                                <View style={css.channelTitle}>
                                    <Text numberOfLines={1} ellipsizeMode="middle" style={{ flexShrink: 1 }}>
                                        全部
                                        {/* Lorem ipsum dolor sit amet consectetur adipisicing elit */}
                                    </Text>
                                    <Badge text="546" />
                                </View>
                            </View>
                        </Touchable>
                        <TouchHighlight onPress={openFilterMenu}>
                            <View style={[css.filter, { paddingHorizontal: typo.padding }]}>
                                <Icon name={filterOpen ? 'chevron-up-circle' : 'funnel-outline'} size={SIZE} color={theme.fontColor} />
                            </View>
                        </TouchHighlight>
                    </>
                )}
            </View>
            <ModalSelect title="选择RSS源" visible={pickVisible} onClose={onPickClose} />

            {loaded && filterOpen && (
                <View style={[css.filterBody, { borderColor: theme.borderColor }]}>
                    <View style={{ flex: 1, paddingVertical: typo.padding }}>
                        <Text style={[css.filterTitle, cssFilterTitle]}>筛选</Text>
                        <View style={css.filterRow}>
                            <View style={cssCheckbox}>
                                <Checkbox {...ppCheckbox} />
                            </View>
                            <Text style={css.filterLabel}>显示摘要</Text>
                        </View>
                        <View style={css.filterRow}>
                            <View style={cssCheckbox}>
                                <Checkbox value {...ppCheckbox} />
                            </View>
                            <Text style={css.filterLabel}>显示已读</Text>
                        </View>
                        <View style={css.filterRow}>
                            <View style={cssCheckbox}>
                                <Checkbox {...ppCheckbox} />
                            </View>
                            <Text style={css.filterLabel}>仅显示今天</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, padding: typo.padding }}>
                        <Text style={[css.filterTitle, cssFilterTitle]}>排序</Text>
                        <View style={css.filterRow}>
                            <View style={cssCheckbox}>
                                <Checkbox {...ppCheckbox} />
                            </View>
                            <Text style={css.filterLabel}>最新优先</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const css = StyleSheet.create({
    topbar: {
        position: 'absolute',
        top: BASE_SPACE,
        zIndex: 1,
        elevation: 4,
        borderRadius: 4,
        overflow: 'hidden',
    },
    body: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
    },
    channel: {
        height: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    channelTitle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    filter: {
        height: 48,
        justifyContent: 'center',
    },
    filterBody: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
export const TOPBAR_SPACE = 48 + BASE_SPACE * 2;

export default Topbar;
