import { Navigation } from 'react-native-navigation';
import { registerTheme } from './themes/';
import {
    TABAPI,
    TABComponents,
    TABTypography,
    IDActivityIndicator,
    IDButton,
} from './IDSymbols.js';
import API from './API.js';
import Components from './RNComponents.js';
import Typography from './Typography.js';
import RNActivityIndicator from './pages/RNActivityIndicator.js';
import RNButton from './pages/RNButton.js';

export default function registerRoutes() {
    register(TABAPI, API);
    register(TABComponents, Components);
    register(TABTypography, Typography);
    register(IDActivityIndicator, RNActivityIndicator);
    register(IDButton, RNButton);
}

/** Simply register. (reduce code) */
function register(id, Route) {
    Navigation.registerComponent(
        id,
        registerTheme(Route),
        () => Route,
    );
    /**
     * Assign the registered name to Component
     * 
     * Sometimes used handy: `RNActivityIndicator.ID`, and no need
     * to import the symbols file.
     */
    // eslint-disable-next-line no-param-reassign
    Route.ID = id;
}