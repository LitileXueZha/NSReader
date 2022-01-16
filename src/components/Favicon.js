import React, { useContext, useState } from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { AppContext } from '../AppContext.js';
import MRSS from '../models/RSS.js';
import Perf from '../utils/Perf.js';

const loadFailed = {};

function Favicon(props) {
    const { id, size, radius } = props;
    const { theme } = useContext(AppContext);
    const { favicon, rcIdx = 0 } = MRSS.data[id] || {};
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
    return <View style={[style, { backgroundColor: theme.randomColors[rcIdx] }]} />;
}

export default React.memo(Favicon);
