import React, { useContext, useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import Text from '../../components/SText.js';
import { AppContext } from '../../AppContext.js';
import Touchable, { TouchHighlight } from '../../components/Touchable.js';
import format from '../../utils/format.js';
import Favicon from '../../components/Favicon.js';
import C from '../../components/globalCSSStyles.js';
import MStory from '../../models/Story.js';

function StoryItem(props) {
    const {
        data,
        onPress,
        hideSummary,
        flagIndex,
        flagPast,
    } = props;
    const [read, setRead] = useState(data.read);
    const { theme, typo } = useContext(AppContext);
    const memoStyles = useMemo(() => ({
        wrapper: {
            paddingLeft: typo.padding + 4,
        },
        row: {
            paddingVertical: typo.padding,
            paddingRight: typo.padding + 4,
            borderColor: theme.borderColor,
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
        flag: [css.flag, {
            backgroundColor: theme.bgStoryFlag,
            color: theme.fontColorSecond,
        }],
        title: {
            fontSize: typo.h2.fontSize,
            fontWeight: 'bold',
        },
        desc: {
            marginTop: 4,
            fontSize: typo.fontSizeSmall,
            lineHeight: typo.fontSize,
        },
    }), [theme, typo]);
    const readStyle = read && {
        color: theme.fontColorSecond,
    };
    const onItemPress = () => {
        onPress?.(data);
        if (!read) {
            setRead(true);
            MStory.update(data.id, { read: 1 });
        }
    };

    return (
        <TouchHighlight onPress={onItemPress}>
            <View style={memoStyles.wrapper} collapsable>
                <View style={memoStyles.row}>
                    <View style={css.flagRow}>
                        {flagIndex && (
                            <Text style={memoStyles.flag}>{`#${flagIndex}`}</Text>
                        )}
                        {flagPast && (
                            <Text style={memoStyles.flag}>更早以前</Text>
                        )}
                    </View>
                    <Text style={[readStyle, memoStyles.title]}>
                        {prettyText(data.title)}
                    </Text>
                    {!hideSummary && (
                        <Text
                            style={[readStyle, memoStyles.desc]}
                            numberOfLines={3}
                            ellipsizeMode="tail"
                        >
                            {prettyText(data.desc)}
                        </Text>
                    )}
                    <View style={css.info}>
                        <Text style={css.date} secondary>{format.date(data.date)}</Text>
                        <Favicon id={data.pid} size={12} radius={12} />
                    </View>
                </View>
            </View>
        </TouchHighlight>
    );
}

const REG_SPACE = /\s*(\n|\s{2,})/gm;
export function prettyText(str = '') {
    return str.replace(REG_SPACE, ' ');
}

const css = StyleSheet.create({
    info: {
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        marginRight: 4,
        fontSize: 12,
        lineHeight: 16,
    },
    flagRow: {
        flexDirection: 'row',
        // justifyContent: 'flex-end',
        top: -4,
    },
    flag: {
        marginRight: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        fontSize: 12,
        lineHeight: 14,
        borderRadius: 4,
    },
});

/**
 * Decide the story item should update
 * 
 * This is a big optimization for FlatList!!!
 * Don't use `React.PureComponent` or `React.memo` separately.
 * 
 * The side effect is that you must specify the props
 * manually when updated.
 */
function areEqual(prevProps, nextProps) {
    if (
        nextProps.hideSummary !== prevProps.hideSummary
        || nextProps.flagIndex !== prevProps.flagIndex
        || nextProps.flagPast !== prevProps.flagPast
    ) {
        return false;
    }
    return true;
}

export default React.memo(StoryItem, areEqual);
