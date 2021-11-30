import React from 'react';
import { Navigation } from 'react-native-navigation';

import App from './AppContext.js';
import {
    TABStory,
    TABRSS,
    TABSettings,
} from './pages/IDSymbols.js';
import Story from './pages/story';
import RSS from './pages/rss';
import Settings from './pages/settings';

export default function registerRoutes() {
    register(TABStory, Story);
    register(TABRSS, RSS);
    register(TABSettings, Settings);
}

/** Simply register (reduce code) */
function register(name, Route) {
    Navigation.registerComponent(
        name,
        () => (props) => (
            <App>
                <Route {...props} />
            </App>
        ),
        () => Route,
    );

    // eslint-disable-next-line no-param-reassign
    Route.ID = name;
}
