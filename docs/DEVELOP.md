# Development Setup

Follow offical guide to prepare environment setup. Then run these commands:

```shell
$ npx react-native init --npm --directory RNProjects --title NSReader --skip-install NSReader
$ cd RNProjects && npm i
$ git clone https://github.com/LitileXueZha/NSReader.git
$ cd NSReader && npm i
```

Remove some useless packages, eg: `jest`, `eslint`. This will speed up install step.

Install other dependencies in `RNProjects`:

```shell
$ npm install --save @primer/primitives @react-native-community/checkbox @react-native-community/push-notification-ios crypto-js js-base64 nanoid react-native-background-fetch react-native-document-picker react-native-fast-image react-native-fs react-native-inappbrowser-reborn react-native-linear-gradient react-native-navigation react-native-push-notification react-native-sound react-native-vector-icons react-native-webview sax
$ npm install --save-dev @welldone-software/why-did-you-render emmet html-minifier-terser
```

Modify some files to run:

```json
// RNProjects/package.json
{
    "name": "rnprojects",
    "scripts": {
        "android": "react-native run-android --no-packager --active-arch-only --appIdSuffix dev",
        "build": "react-native run-android --no-packager --variant release"
    }
}
```

> If there are some **aplha** versions in your `package.json`, be careful of these packages, eg: `"^1.2.3-alpha"`, its usually occur problems, don't use them.

```javascript
// RNProjects/index.js
import startApp from './NSReader/src';
startApp();
```

Use the `babel.config.js`.

### on Andorid

```gradle
// android/build.gradle
ext {
    ...
    kotlinVersion = "1.5.31" // Or any version above 1.4.x
    RNNKotlinVersion = kotlinVersion
    androidXBrowser = "1.3.0" // Fix package `react-native-inappbrowser-reborn`
}
...
dependencies {
    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
}
...
repositories {
    maven {
        // react-native-background-fetch
        url("${project(':react-native-background-fetch').projectDir}/libs")
    }
}
```

```plain
// android/app/proguard-rules.pro

-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}
# [react-native-background-fetch]
-keep class com.transistorsoft.rnbackgroundfetch.HeadlessTask { *; }
-keepattributes *Annotation*
-keepclassmembers class ** {
  @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }
```

```gradle
// android/app/build.gradle
project.ext.react = [
    enableHermes: false,
]

project.ext.vectoricons = [
    iconFontNames: [ 'Ionicons.ttf', 'SimpleLineIcons.ttf' ] // Name of the font files you want to copy
]
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

def enableProguardInReleaseBuilds = true

...
buildTypes {
    debug {
        applicationIdSuffix '.dev'
```

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.VIBRATE" />
...
<application>
    <activity>
        ...
        <!-- Deep Linking -->
        <intent-filter>
          <action android:name="android.intent.action.VIEW" />
          <category android:name="android.intent.category.DEFAULT" />
          <category android:name="android.intent.category.BROWSABLE" />
          <data android:scheme="rss" />
        </intent-filter>
```

Download resources into `android/app/src/main/res`.

```java
// android/app/src/main/java/com/nsreader/MainApplication.java
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
public class MainApplication extends NavigationApplication {
// public class MainApplication extends Application implements ReactApplication {
    ...
    new NavigationReactNativeHost(this) {
    // new ReactNativeHost(this) {
```

```java
// android/app/src/main/java/com/nsreader/MainActivity.java
// import com.facebook.react.ReactActivity;
import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity  {
    ...
    ...
    public MainActivityDelegate(NavigationActivity activity, String mainComponentName) {
```
