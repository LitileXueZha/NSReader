import React from 'react';
import { Text } from 'react-native';

import $ev from './utils/Event.js';
import { themes } from './themes';
import TYPO from './themes/typography.js';

const defaultValue = {
    theme: themes.main,
    typo: TYPO.normal,
    lang: 'zh',
};
export const AppContext = React.createContext(defaultValue);

export default class App extends React.PureComponent {
    constructor() {
        super();
        this.state = defaultValue;
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
