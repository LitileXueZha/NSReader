import React, { useContext, useState } from 'react';
import {
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { AppContext } from '../AppContext.js';
import MRSS from '../models/RSS.js';
import Perf from '../utils/Perf.js';
import Text from './SText.js';
import { GOLD_RATIO } from '../themes/typography.js';

const loadFailed = {};
const FONT = Platform.select({
    android: 'monospace',
    ios: 'Menlo',
});

function Favicon(props) {
    const { id, size, radius } = props;
    const { theme } = useContext(AppContext);
    const { favicon, rcIdx = 0, title } = MRSS.data[id] || {};
    const [uri, setURI] = useState(favicon);
    const style = {
        width: size,
        height: size,
        borderRadius: radius,
        overflow: 'hidden',
    };
    const onError = (e) => {
        loadFailed[id] = 1;
        setURI(false);
        // Perf.error(e.nativeEvent.error);
    };

    if (uri && !loadFailed[id]) {
        return (
            <FastImage
                source={{ uri }}
                onError={onError}
                resizeMode="contain"
                style={style}
            />
        );
    }
    const letter = title?.[0]?.toUpperCase();
    const letterStyle = {
        fontSize: size * GOLD_RATIO,
        fontFamily: FONT,
        lineHeight: size,
        color: theme.fgOnPaper,
    };
    return (
        <View style={[css.container, style, { backgroundColor: theme.randomColors[rcIdx] }]}>
            <Text style={letterStyle}>{letter}</Text>
        </View>
    );
}

const css = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default React.memo(Favicon);
