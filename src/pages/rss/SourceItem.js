import React, { useContext, useMemo, useState } from 'react';
import { Button, View, StyleSheet, Alert } from 'react-native';

import { TouchHighlight } from '../../components/Touchable.js';
import Text from '../../components/SText.js';
import { AppContext } from '../../AppContext.js';
import format from '../../utils/format.js';
import Favicon from '../../components/Favicon.js';
import C from '../../components/globalCSSStyles.js';

function SourceItem(props) {
    const { data, onPress, onToggleEnabled } = props;
    const { theme, typo } = useContext(AppContext);
    const memoStyles = useMemo(() => ({
        touch: {
            margin: typo.margin,
            marginTop: 0,
            borderColor: theme.borderColor,
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: 6,
        },
        container: {
            padding: typo.padding,
        },
        title: {
            fontSize: typo.h2.fontSize,
            fontWeight: 'bold',
        },
        desc: {
            lineHeight: typo.fontSize * 1.15,
        },
    }), [theme, typo]);
    const [enabled, setEnabled] = useState(data.enabled);
    const disabledStyle = !enabled && {
        color: theme.fontColorSecond,
    };
    const onItemPress = () => {
        onPress?.();
    };
    const onItemLongPress = () => {
        const { title } = data;
        const message = !enabled
            ? '启用更新'
            : '关闭此 RSS 源内容更新';
        Alert.alert(title, message, [
            {
                text: !enabled ? '好的' : '确认',
                onPress: () => {
                    setEnabled(!enabled);
                    onToggleEnabled(!enabled, data);
                },
            },
            {
                text: '取消',
                style: 'cancel',
            },
        ], { cancelable: true });
    };

    return (
        <TouchHighlight onPress={onItemPress} onLongPress={onItemLongPress} style={memoStyles.touch}>
            <View style={memoStyles.container}>
                <View style={css.info}>
                    <View style={css.richText}>
                        <Text style={[disabledStyle, memoStyles.title]}>{data.title}</Text>
                        <View style={css.hint}>
                            <Text style={C.fs12} secondary>
                                {format.date(data.date)}
                            </Text>
                            {!enabled && (
                                <View style={[css.badge, { backgroundColor: theme.dangerColor }]}>
                                    <Text style={[css.notEnabled, { color: theme.fgOnPaper }]}>未启用</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <Favicon id={data.id} size={48} radius={4} />
                </View>
                <Text style={[disabledStyle, memoStyles.desc]} numberOfLines={3}>
                    {data.description}
                </Text>
                {/* <View style={{ flexDirection: 'row' }}>
                    <Button title="启用" />
                    <Button title="disable" />
                </View> */}
            </View>
        </TouchHighlight>
    );
}

const css = StyleSheet.create({
    info: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    richText: {
        flex: 1,
        paddingTop: 4,
        marginRight: 4,
    },
    hint: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        marginLeft: 8,
        borderRadius: 2,
        padding: 2,
        paddingHorizontal: 4,
    },
    notEnabled: {
        fontSize: 10,
        lineHeight: 12,
    },
});

function areEqual(prevProps, nextProps) {
    // Nothing need to re-rendered after the first render
    return true;
}

export default React.memo(SourceItem, areEqual);
// export default SourceItem;
