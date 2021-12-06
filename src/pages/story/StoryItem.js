import React, { useContext } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import Text from '../../components/SText.js';
import { AppContext } from '../../AppContext.js';
import Touchable, { TouchHighlight } from '../../components/Touchable.js';

function StoryItem(props) {
    const { data, onPress, hideSummary } = props;
    const { theme, typo } = useContext(AppContext);
    const rowStyles = {
        paddingVertical: typo.padding,
        paddingRight: typo.padding + 4,
        borderColor: theme.borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
    };
    const readStyles = data.read && {
        color: theme.fontColorSecond,
    };

    return (
        <TouchHighlight onPress={onPress}>
            <View style={{ paddingLeft: typo.padding + 4 }} collapsable>
                <View style={rowStyles}>
                    <Text style={[readStyles, { fontSize: typo.h2.fontSize, fontWeight: 'bold' }]}>
                        {data.title}
                    </Text>
                    {!hideSummary && (
                        <Text
                            style={[readStyles, { fontSize: typo.fontSizeSmall, lineHeight: typo.fontSize, marginTop: 4 }]}
                            numberOfLines={3}
                            ellipsizeMode="tail"
                        >
                            {data.description}
                        </Text>
                    )}
                    <View style={css.info}>
                        <Text style={[css.date, { color: theme.fontColorSecond }]}>{new Date(data.date).toLocaleDateString()}</Text>
                        <View style={{ backgroundColor: theme.randomColors[data.rcIdx], width: 12, height: 12 }} />
                    </View>
                </View>
            </View>
        </TouchHighlight>
    );
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
    if (nextProps.hideSummary !== prevProps.hideSummary) {
        return false;
    }
    return true;
}

export default React.memo(StoryItem, areEqual);
