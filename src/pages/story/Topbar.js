import React, { useContext, useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    LayoutAnimation,
    Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { BASE_SPACE, GOLD_RATIO } from '../../themes/typography.js';
import { AppContext } from '../../AppContext.js';
import Text from '../../components/SText.js';
import Badge from '../../components/Badge.js';
import Touchable, { TouchHighlight } from '../../components/Touchable.js';
import useFilter from './useFilter.js';
import TopbarCheckboxRow from './TopbarCheckboxRow.js';
import C from '../../components/globalCSSStyles.js';

export const STATUS_LOADING = 0;
export const STATUS_UPDATING = 1;
export const STATUS_DONE = 2;

const TEXT_LOADING = '加载本地文件...';
const TEXT_UPDATING = '更新RSS源...';
const STATUS_TEXT = [TEXT_LOADING, TEXT_UPDATING];
const SIZE = 24; // icon size, checkbox height...

function Topbar(props) {
    const {
        status, data, onFilter, onPress,
    } = props;
    const { theme, typo } = useContext(AppContext);
    const cssTopbar = {
        left: typo.margin,
        right: typo.margin,
        backgroundColor: theme.bgModalBody,
    };
    const cssFilterTitle = {
        color: theme.fontColorSecond,
        paddingLeft: SIZE + typo.padding * 2,
    };
    const loaded = status === STATUS_DONE;
    const [open, setOpen] = useState(false);
    const openFilterMenu = () => {
        LayoutAnimation.configureNext(
            LayoutAnimation.create(250, 'easeInEaseOut', 'opacity'),
        );
        setOpen(!open);
    };
    const [filter, setFilter] = useFilter(data?.filter);
    const onFilterPress = (type) => {
        setFilter(type, !filter[type]);
        onFilter?.(type, !filter[type]);
    };
    const onSummaryChange = () => onFilterPress('summary');
    const onReadChange = () => onFilterPress('read');
    const onTodayChange = () => onFilterPress('today');
    const onLastChange = () => onFilterPress('last');

    return (
        <>
            {open && <Pressable style={css.backdrop} onPress={openFilterMenu} />}
            <View style={[css.topbar, cssTopbar]}>
                <View style={css.body}>
                    {loaded
                        ? (
                            <Touchable onPress={onPress} style={C.f1}>
                                <View style={css.channel}>
                                    <Icon name="list" size={SIZE} color={theme.fontColor} style={{ marginHorizontal: typo.padding }} />
                                    <View style={css.channelTitle}>
                                        <Text numberOfLines={1} ellipsizeMode="middle" style={{ flexShrink: 1 }}>
                                            {data.channel?.text}
                                        </Text>
                                        <Badge text={data.channel?.badge} />
                                    </View>
                                </View>
                            </Touchable>
                        )
                        : (
                            <>
                                <ActivityIndicator style={{ marginHorizontal: typo.margin }} />
                                <Text style={C.f1}>{STATUS_TEXT[status]}</Text>
                            </>
                        )}
                    <TouchHighlight onPress={openFilterMenu}>
                        <View style={[css.filter, { paddingHorizontal: typo.padding }]}>
                            <Icon name={open ? 'chevron-up-circle' : 'funnel-outline'} size={SIZE} color={theme.fontColor} />
                        </View>
                    </TouchHighlight>
                </View>

                {loaded && open && (
                    <View style={[css.filterBody, { borderColor: theme.borderColor }]}>
                        <View style={{ flex: 1, paddingVertical: typo.padding }}>
                            <Text style={[css.filterTitle, cssFilterTitle]}>筛选</Text>
                            <TopbarCheckboxRow
                                label="显示摘要"
                                value={filter.summary}
                                onChange={onSummaryChange}
                            />
                            <TopbarCheckboxRow
                                label="显示已读"
                                value={filter.read}
                                onChange={onReadChange}
                            />
                            <TopbarCheckboxRow
                                label="仅看今天"
                                value={filter.today}
                                onChange={onTodayChange}
                            />
                        </View>
                        <View style={{ flex: 1, padding: typo.padding }}>
                            <Text style={[css.filterTitle, cssFilterTitle]}>排序</Text>
                            <TopbarCheckboxRow
                                label="旧的优先"
                                value={filter.last}
                                onChange={onLastChange}
                            />
                        </View>
                    </View>
                )}
            </View>
        </>
    );
}

const css = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
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
});
export const TOPBAR_SPACE = 48 + BASE_SPACE * 2;

function areEqual(prevProps, nextProps) {
    if (
        prevProps.status !== nextProps.status
        || prevProps.data.filter !== nextProps.data.filter
        || prevProps.data.channel !== nextProps.data.channel
    ) {
        return false;
    }
    return true;
}

export default React.memo(Topbar, areEqual);
