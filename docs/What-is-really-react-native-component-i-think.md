# What is really react native component I think?

Natively, not JavaScriptify.

Package should written with native language, eg: Android's Java, Apple's Swift, or others... But some popular packages are pseudo react-native, implement by Pure JavaScript, that means UI is drawed in native side, then intereact in JS side.

Think about react native core components and API, `<View/>`, `<Text/>`, `Alert.alert()`... they are basic and offer consistency between platform APIs.

## Stop

Mobile device is not as large as desktop, so the complexity in one screen will not be too high. This make possibility to build minimal basic components and coordinate these platform APIs. It's not too difficult in imagination, but needs familiarity.

## Prerequisites

+ JavaScript + React
+ Java (for Android only)
+ Swift (for iOS only)
+ etc...

3 years relevant work experience or better, know it's best practices.

## How to

See what's popular APPs do and "copy". It's not shameful to take advantages of their cross-platform efforts.

For a example, the html `select` element, in Chrome or Firefox APP, on Android or iOS. It has same interactive behaviors, high customizable, same manipulate API... small UI difference not effect the whole.

About rules:

|Should be|Not effect the whole||
|-|-|-|
|natively behaviors|small platform UI design difference|✓|
|same API|platform only|✓|
|highly customizeable|cannot customize native part|✓|
|native events, declarative data provider|necessary public things|✓|
|less control but identical design for user|-|-|
|JavaScript code as less as possible|-|-|
|-|without user experience and habits|✗|

As a programmer, we don't care about the internal implements, what important is the developer's package has the ability which let us build same features cross platform for user. Similarly, user don't care about how does the APP we build, they use our APP or others because it has needed feature.

## React Native limitations

Until now, react native still not release to version `1.0`, lack of many basic native core functionality, audio/video, filesystem, notification and more.

Maybe...

编不出来了～
