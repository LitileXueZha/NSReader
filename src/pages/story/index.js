import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';

import { AppContext } from '../../AppContext.js';

class Story extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <Text style={{ color: this.context.theme.fontColor }}>Story</Text>
            </ScrollView>
        );
    }
}
Story.contextType = AppContext;

export default Story;
