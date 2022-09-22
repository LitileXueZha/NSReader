import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import fs from 'react-native-fs';
import tpl from './index.html';

/**
 * Non-image assets are not bundled in release/production build unless
 * put it in `android/.../assets`.
 *
 * @see https://github.com/facebook/react-native/issues/7924
 */

const HTML = __HTML_STORY_TEMPLATE__;
async function loadTemplate() {
    // fs.readFile|readFileAssets|readFileRes not work
    return HTML;
}

if (__DEV__) {
    const { uri } = resolveAssetSource(tpl);
    // eslint-disable-next-line no-func-assign
    loadTemplate = async () => {
        try {
            const sc = new AbortController();
            const timer = setTimeout(() => sc.abort(), 3500);
            const res = await fetch(uri, { signal: sc });
            const text = await res.text();
            clearTimeout(timer);
            return text;
        } catch (e) {
            return HTML;
        }
    };
}

export default loadTemplate;
