import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import {
    WHITE,
    BLACK,
    BORDER,
    BLACK_BRIGHT,
    WHITE_DARK,
} from './colors.js';
import typo from './typography.js';
import $ev from '../utils/Event.js';

/**
 * Support types: `main`, `dark`
 */
export const themes = {
    main: {
        ...typo,
        background: WHITE,
        fontColor: BLACK,
        borderColor: BORDER,
        fontColorSecond: BLACK_BRIGHT,
    },
    dark: {
        ...typo,
        background: BLACK,
        fontColor: WHITE,
        borderColor: BORDER,
        fontColorSecond: WHITE_DARK,
    },
};
export const ThemeContext = React.createContext({
    theme: themes.main,
    setTheme: () => {},
});

export default class ThemeProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: themes[props.type],
            setTheme: this.setTheme,
        };
    }

    componentDidMount() {
        $ev.on('themechange', this.setTheme);
    }

    componentWillUnmount() {
        $ev.off('themechange', this.setTheme);
    }

    setTheme = (type) => {
        const theme = themes[type];
        const { background } = theme;
        // 更新当前组件
        Navigation.mergeOptions('api', {
            layout: { componentBackgroundColor: background },
        });
        // 设置全局（对当前组件无效）
        Navigation.setDefaultOptions({
            layout: { componentBackgroundColor: background },
        });
        this.setState({ theme });
    }

    render() {
        return (
            <ThemeContext.Provider value={this.state}>
                {this.props.children}
            </ThemeContext.Provider>
        );
    }
}

export function registerTheme(ScreenComponent) {
    // eslint-disable-next-line arrow-body-style
    return () => (props) => {
        return (
            <ThemeProvider type="main">
                <ScreenComponent {...props} />
            </ThemeProvider>
        );
    };
}
