import React, { useEffect, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '../../../components/SText.js';

const TDATA = [
    '下载RSS源',
    'Not Found',
    '解析源文件格式',
    'Atom 1.0',
    'RSS 2.0',
];
let timerDotLoading = null;

function Logs(props, ref) {
    const [data, setData] = useState([]);
    const [dot, setDot] = useState('');

    useImperativeHandle(ref, () => ({
        write: (text, showLoading = false) => {
            clearInterval(timerDotLoading);
            setData([...data, text]);
            setDot('');
            if (showLoading) {
                let fixClosureDot = '';
                timerDotLoading = setInterval(() => {
                    if (fixClosureDot.length > 2) {
                        fixClosureDot = '';
                        setDot('');
                        return;
                    }
                    fixClosureDot += '.';
                    setDot(fixClosureDot);
                }, 1000);
            }
        },
        clear: () => {
            clearInterval(timerDotLoading);
            setData([]);
            setDot('');
        },
    }), [data]);
    useEffect(() => () => {
        clearInterval(timerDotLoading);
    }, []);

    return data.map((log, index) => (
        <Text key={log} style={css.log} secondary>
            {log}
            {index === data.length - 1 && dot}
        </Text>
    ));
}

const css = StyleSheet.create({
    log: {
        fontSize: 12,
        textAlign: 'right',
        lineHeight: 16,
    },
});

export default React.forwardRef(Logs);
