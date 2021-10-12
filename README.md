# NSReader

A great RSS reader on mobile.

## Develop

Follow offical guide to prepare environment setup. Then run these commands:

```bash
$ npx react-native init --npm --directory RNProjects --title NSReader --skip-install NSReader
$ cd RNProjects && npm i
$ git clone [this repo]
```

Modify some files to run: change `RNProjects/package.json`'s `name` field to other word, eg `rnprojects`; edit `RNProjects/index.js` and import correct NSReader files.

```javascript
// RNProjects/index.js
import App from './NSReader/src/index.js';
```

Install [`react-native-navigation`](https://wix.github.io/react-native-navigation/docs/installing) in `RNProjects`。

## More

Color pattle: https://dribbble.com/shots/3285924-Reader-for-Selfoss。
