import React from 'react';
import { Text, Pressable, DevSettings } from 'react-native';

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
    constructor(props) {
        super(props);
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
                <DevReloadButton />
            </AppContext.Provider>
        );
    }
}

function DevReloadButton() {
    if (__DEV__) {
        const styles = {
            position: 'absolute',
            right: 20,
            bottom: 20,
            padding: 10,
            backgroundColor: defaultValue.theme.primaryColor,
            borderRadius: 50,
            opacity: 0.75,
            elevation: 2,
            zIndex: 99,
        };
        return (
            <Pressable style={styles} onPress={() => DevSettings.reload()}>
                <Text style={{ color: '#fff', fontSize: 12 }}>DevReload</Text>
            </Pressable>
        );
    }
    return null;
}

export function withAppContext(Screen) {
    return () => (props) => (
        <App componentId={props.componentId}>
            <Screen {...props} />
        </App>
    );
}
