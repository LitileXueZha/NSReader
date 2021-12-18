import React, { useMemo } from 'react';

import ModalSelect from '../../components/ModalSelect.js';
import aps from '../../AppSettings.js';
import $ev from '../../utils/Event.js';

export const THEME_LIST = [{
    id: 'main',
    text: '默认',
    border: true,
}, {
    id: 'dark',
    text: 'dark',
}];


export default function ModalTheme(props) {
    const { visible, onClose } = props;
    const currIndex = useMemo(() => THEME_LIST.findIndex((item) => item.id === aps.get('theme')), []);
    const onModalClose = (index) => {
        onClose(index);
        const { id } = THEME_LIST[index];
        // Only set the theme when changes
        if (id !== aps.get('theme')) {
            $ev.emit('themechange', id);
        }
    };

    return (
        <ModalSelect
            visible={visible}
            onClose={onModalClose}
            datalist={THEME_LIST}
            currIndex={currIndex}
        />
    );
}
