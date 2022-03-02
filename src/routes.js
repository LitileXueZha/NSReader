import React from 'react';
import { Navigation } from 'react-native-navigation';

import { withAppContext } from './AppContext.js';
import {
    TABStory,
    TABRSS,
    TABSettings,
    IDAbout,
    IDStorage,
    IDSettingsMore,
    IDRSSAdd,
    IDSupportSpecs,
    IDRSSDetail,
    IDStoryDetail,
    IDCopyrights,
    IDExperiment,
} from './pages/IDSymbols.js';
import Story from './pages/story';
import RSS from './pages/rss';
import Settings from './pages/settings';
import About from './pages/about';
import Storage from './pages/settings/storage';
import SettingsMore from './pages/settings/more';
import RSSAdd from './pages/rss/add';
import SupportSpecs from './pages/rss/support-specs';
import RSSDetail from './pages/rss/detail';
import StoryDetail from './pages/story/detail';
import Copyrights from './pages/about/copyrights';
import Experiment from './pages/settings/experiment';

const ROUTES = {
    [IDAbout]: About,
    [IDStorage]: Storage,
    [IDSettingsMore]: SettingsMore,
    [IDRSSAdd]: RSSAdd,
    [IDSupportSpecs]: SupportSpecs,
    [IDRSSDetail]: RSSDetail,
    [IDStoryDetail]: StoryDetail,
    [IDCopyrights]: Copyrights,
    [IDExperiment]: Experiment,
};

export default function registerRoutes() {
    register(TABStory, Story);
    register(TABRSS, RSS);
    register(TABSettings, Settings);
    Navigation.setLazyComponentRegistrator((id) => {
        if (id in ROUTES) {
            register(id, ROUTES[id]);
        }
    });
}

/** Simply register (reduce code) */
function register(name, Route) {
    Navigation.registerComponent(
        name,
        withAppContext(Route),
        () => Route,
    );

    // eslint-disable-next-line no-param-reassign
    Route.ID = name;
}
