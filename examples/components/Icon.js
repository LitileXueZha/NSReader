import React, { useContext } from 'react';
import { Image } from 'react-native';
import { ThemeContext } from '../themes';

const DIR = '../../assets/ionicons';
const ICONS = {
    main: {
        arrowForward: require(`${DIR}/ios-arrow-forward.png`),
    },
    dark: {
        arrowForward: require(`${DIR}/ios-arrow-forward_dark.png`),
    },
};

export default function Icon(props) {
    const ctx = useContext(ThemeContext);
    const iconSets = ICONS[ctx.theme.id];
    const {
        name,
        size = 20,
    } = props;

    return (
        <Image
            source={iconSets[name]}
            style={{ width: size, height: size }}
        />
    );
}
