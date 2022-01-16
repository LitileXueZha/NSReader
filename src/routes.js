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

export default function registerRoutes() {
    register(TABStory, Story);
    register(TABRSS, RSS);
    register(TABSettings, Settings);
    register(IDAbout, About);
    register(IDStorage, Storage);
    register(IDSettingsMore, SettingsMore);
    register(IDRSSAdd, RSSAdd);
    register(IDSupportSpecs, SupportSpecs);
    register(IDRSSDetail, RSSDetail);
    register(IDStoryDetail, StoryDetail);
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
