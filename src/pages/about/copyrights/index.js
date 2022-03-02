import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Platform,
} from 'react-native';

import { AppContext } from '../../../AppContext.js';
import Navbar from '../../../components/Navbar.js';
import C from '../../../components/globalCSSStyles.js';
import LicenseCard from './LicenseCard.js';
import Builds from './Builds.js'; // Auto generated

class Copyrights extends Component {
    constructor() {
        super();
        this.state = {};
        this.isAndroid = Platform.OS === 'android';
    }

    render() {
        const { theme, typo } = this.context;

        return (
            <>
                <Navbar title="开源许可" />
                <ScrollView style={C.f1}>
                    {this.isAndroid && (
                        <LicenseCard name="Android" type="Apache-2.0">
                            The Android Open Source Project
                        </LicenseCard>
                    )}
                    <LicenseCard name="WebView">
                        The system WebView
                    </LicenseCard>
                    <Builds />
                </ScrollView>
            </>
        );
    }
}
Copyrights.contextType = AppContext;

export default Copyrights;
