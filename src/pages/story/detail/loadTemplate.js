import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import fs from 'react-native-fs';
import tpl from './index.html';

/**
 * Non-image assets are not bundled in release/production build unless
 * put it in `android/.../assets`.
 * 
 * @see https://github.com/facebook/react-native/issues/7924
 */
const { uri } = resolveAssetSource(tpl);

async function loadTemplate() {
    // fs.readFile|readFileAssets|readFileRes not work
    return __HTML_STORY_TEMPLATE__;
}

if (__DEV__) {
    loadTemplate = () => fetch(uri).then(res => res.text());
}

export default loadTemplate;
