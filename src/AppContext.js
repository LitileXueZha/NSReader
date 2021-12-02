import React from 'react';

import $ev from './utils/Event.js';
import { themes } from './themes';
import TYPO from './themes/typography.js';
import aps from './AppSettings.js';

const defaultValue = {
    theme: themes.main,
    typo: TYPO.normal,
    lang: 'zh',
};
export const AppContext = React.createContext(defaultValue);

export default class App extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            lang: aps.get('lang') || defaultValue.lang,
            theme: themes[aps.get('theme')] || defaultValue.theme,
            typo: defaultValue.typo,
        };
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export function registerAppContext(Screen) {
    return () => (props) => (
        <App>
            <Screen {...props} />
        </App>
    );
}
