import React, { Component } from 'react';
import { View, I18nManager } from 'react-native';

import Text from '../../components/SText.js';

class Settings extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <View>
                <Text>Settings</Text>
                <Text>{JSON.stringify(I18nManager.getConstants(),null,2)}</Text>
            </View>
        );
    }
}

export default Settings;
