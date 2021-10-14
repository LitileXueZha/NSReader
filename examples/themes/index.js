import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import {
    WHITE,
    BLACK,
    BORDER,
    BLACK_BRIGHT,
    WHITE_DARK,
    BLACK_DARK,
    BLUE,
    BLUE_BRIGHT,
} from './colors.js';
import TYPO from './typography.js';
import $ev from '../utils/Event.js';

/**
 * Support types: `main`, `dark`
 */
export const themes = {
    main: {
        id: 'main',
        background: WHITE,
        fontColor: BLACK,
        borderColor: BORDER,
        fontColorSecond: BLACK_BRIGHT,
        fontColorHead: BLACK_DARK,
        linkColor: BLUE,
    },
    dark: {
        id: 'dark',
        background: BLACK,
        fontColor: WHITE,
        borderColor: BORDER,
        fontColorSecond: WHITE_DARK,
        fontColorHead: WHITE,
        linkColor: BLUE_BRIGHT,
    },
};
export const ThemeContext = React.createContext({
    theme: themes.main,
    typo: TYPO.normal,
});

/** Current theme type of APP */
const AppTheme = {
    current: 'main',
};

export default class ThemeProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: themes[props.type],
            typo: TYPO.normal,
        };
    }

    componentDidMount() {
        if (this.props.type !== AppTheme.current) {
            this.setTheme(AppTheme.current);
        }
        $ev.on('themechange', this.setTheme);
    }

    componentWillUnmount() {
        $ev.off('themechange', this.setTheme);
    }

    setTheme = (type) => {
        const { componentId } = this.props;
        const theme = themes[type];
        const { background } = theme;

        this.setState({ theme }, () => {
            // 更新当前组件
            Navigation.mergeOptions(componentId, {
                layout: { componentBackgroundColor: background },
            });
            AppTheme.current = type;
        });
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
            <ThemeProvider type="main" {...props}>
                <ScreenComponent {...props} />
            </ThemeProvider>
        );
    };
}
