# NSReader

A great RSS reader on mobile.

## Minimal System Requirement

+ Android 5.0+
+ iOS 11.0+ (TODO)

Technology support:

|Framework|Platform_Android|Platform_iOS|Usage|
|-|-|-|-|
|React Native 0.66|5.0+ (API 21)|11.0+ (iPhone 8)|>94.1% / >98%|
|Flutter 2.5|4.4+ (API 19)|9.0+ (iPhone 6s)|>98.1% / >98%|

See [Android Studio](https://www.xda-developers.com/android-version-distribution-statistics-android-studio/) and [Apple Support](https://developer.apple.com/support/app-store/).

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
