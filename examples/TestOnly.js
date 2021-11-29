import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    Pressable,
    Image,
    PixelRatio,
    PermissionsAndroid,
    Linking,
    Button,
    StatusBar,
    DevSettings,
    TouchableNativeFeedback,
    Switch,
    NativeModules,
    RefreshControl,
    ToastAndroid,
    TextInput,
    LogBox,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { WebView } from 'react-native-webview';
import rfs from 'react-native-fs';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import Checkbox from '@react-native-community/checkbox';
import RNSound from 'react-native-sound';

import { ThemeContext, themes } from './themes';
import { Icon, StyleText } from './components';
import { rnVersion } from './utils';
import { TEAL } from './themes/colors.js';
import balloonPop from '../assets/balloon_pop.mp3';

const soundBP = new RNSound(balloonPop, RNSound.MAIN_BUNDLE, (error) => {
    console.error(error);
});
LogBox.ignoreLogs(['`new NativeEventEmitter()`']);
function testAPIs() {
    ToastAndroid.show('testAPIs', ToastAndroid.SHORT);
    console.log(balloonPop);
    console.log(RNSound.MAIN_BUNDLE, soundBP);
    console.log(NativeModules.DevMenu);
    console.log(rfs.ExternalDirectoryPath);
    // PermissionsAndroid.request('android.permission.READ_EXTERNAL_STORAGE');
    // rfs.readDir(rfs.ExternalDirectoryPath).then(s=>console.log(s));
    // rfs.getFSInfo().then(s=>console.log(s));
    // Linking.openURL('rss://open?team=123456');
    async function deeplink() {
        const value = await Linking.getInitialURL();
        console.log('DL %s', value);
    }
    deeplink();
    // rfs.writeFile(rfs.ExternalDirectoryPath+'/test.html', '<html><head><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" /></head><body>hello</body></html>')
}

export default function TestOnly(props) {
    const ctx = useContext(ThemeContext);
    const { theme, typo } = ctx;
    const webviewImgURL = 'https://pbs.twimg.com/media/FCyCDMrVEAAION-?format=jpg&name=orig';
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            soundBP.play();
        }, 1500);
    };

    useEffect(testAPIs, []);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={loading} progressViewOffset={20} onRefresh={onRefresh} />
            }
            // snapToOffsets={[10,20]}
            // overScrollMode="never"
        >
            <StyleText style={[{ color: theme.fontColorSecond, paddingRight: typo.margin }, css.ver]} size="small">
                ver_{rnVersion()}
            </StyleText>
            <Button title="reload" color="#E34D44" onPress={() => DevSettings.reload()} />
            <Button title="打开url" onPress={async () => {
                // const oldStyle = StatusBar.pushStackEntry({ barStyle: 'light-content', backgroundColor: 'red' });
                await InAppBrowser.open('https://ningtaostudy.cn', {
                    // showTitle: true,
                    toolbarColor: theme.background,
                    // browserPackage: 'com.google.android.webview',
                    // browserPackage: 'org.mozilla.firefox',
                    // browserPackage: 'com.android.chrome',
                });
                // StatusBar.popStackEntry(oldStyle);
            }} />
            <TouchableNativeFeedback onPress={() => setChecked((prev) => !prev)}>
                <View>
                    <Checkbox value={checked} tintColors={{ true: TEAL, false: theme.fontColorSecond }} onValueChange={(val) => setChecked(val)} />
                    <Text>checkbox1</Text>
                </View>
            </TouchableNativeFeedback>
            <Switch value={open} onValueChange={(val) => setOpen(val)} />
            <StyleText style={{ paddingLeft: 10, marginTop: 20 }}>标签1</StyleText>
            <TextInput
                defaultValue=""
                placeholder="输入框"
                style={{ padding: 10, paddingBottom: 0, fontSize: typo.fontSize }}
                // underlineColorAndroid={theme.fontColor}
            />
            <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.borderColor }} />
            <StyleText style={{ paddingLeft: 10, marginTop: 20 }}>标签2</StyleText>
            <TextInput
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="多行输入框"
                style={{ padding: 10, backgroundColor: 'rgba(0,0,0,0.05)', fontSize: typo.fontSize }}
                // underlineColorAndroid={theme.fontColor}
            />
            <View style={{ marginVertical: 20, padding: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme.borderColor, flexDirection: 'row', alignItems: 'center' }}>
                <StyleText>标签3</StyleText>
                <TextInput
                    placeholder="输入框"
                    textAlign="right"
                    style={{ padding: 0, fontSize: typo.fontSize, flex: 1 }}
                />
            </View>
            <View style={{ margin: 10, borderColor: theme.borderColor, borderWidth: 1 }}>
                <TextInput
                    placeholder="输入框"
                    style={{ padding: 10, fontSize: typo.fontSize }}
                />
            </View>

            <View style={css.global}>
                <Text>{JSON.stringify(theme, null, 4)}</Text>
                <Text>{JSON.stringify(typo, null, 4)}</Text>
                <Text selectable={true}>{JSON.stringify({ratio:PixelRatio.get(),fontScale:PixelRatio.getFontScale()}, null, 4)}</Text>
            </View>
            <View style={{ height: 400 }}></View>
            <WebView source={{ html:`
            <!DOCTYPE html>
            <html style="font-size:48px">
            <head>
            <meta name="viewport" content="width=device-width,initial-scale=0.33333,user-scalable=no" />
            <style>
            img {max-width:100%}
            </style>
            </head>
            <body>
            <p style="font-size:1rem;border-top:1.5px solid red">aaa</p>
                抽我<br><br>RSS3 🤩 is hiring: To celebrate our partnership with @0xPolygon, we’re giving away $500 in $MATIC to 10 lucky winners! And each winner can get 1 $PASS for RNS<br>How:<br>- RT & ❤️<br>- Follow @rss3_ & @pass3dotme<br>- Register <br>- Final<br><br><img style src="${webviewImgURL}" referrerpolicy="no-referrer"> <a href="https://rss3.bio/" target="_blank" rel="noopener noreferrer">https://rss3.bio</a> <a href="https://forms.gle/76C1tMm4aG1Ltdit6" target="_blank" rel="noopener noreferrer">https://forms.gle/76C1tMm4aG1Ltdit6</a>
            <script>ts=Date.now();window.addEventListener('load', function(){
                window.ReactNativeWebView.postMessage('webview load +'+(Date.now()-ts)+'ms');
                window.ReactNativeWebView.postMessage(JSON.stringify(document.documentElement.getBoundingClientRect()));
            });window.addEventListener('DOMContentLoaded',function(){
                window.ReactNativeWebView.postMessage('webview DOMContentLoaded');
                window.ReactNativeWebView.postMessage(JSON.stringify(document.documentElement.getBoundingClientRect()));
            });</script>
            </body>
            </html>
            ` }} onMessage={(e) => {console.log(e.nativeEvent.data)}} onShouldStartLoadWithRequest={(req) => {
                console.log(req);
                // InAppBrowser.open(req.url)
                return req.url.startsWith('http') || req.url.startsWith('https');
            }} originWhitelist={['*']} menuItems={[{label:'world',key:'word'}]} containerStyle={{borderColor:'black',borderWidth:1,alignSelf:'center',width:300,height:1528.104248046875/3+2}} style={{ backgroundColor: 'transparent' }} />
            <WebView allowFileAccess={true} source={{uri: 'file:///storage/emulated/0/Android/data/com.nsreader/files/test.html'}} style={{height:300}} />
            <WebView onShouldStartLoadWithRequest={(req) => {
                console.log(req);
                // InAppBrowser.open(req.url)
                return req.url.startsWith('http') || req.url.startsWith('https');
            }} onLoadEnd={() => console.log('onLoadEnd')} originWhitelist={['*']} source={{uri:'https://www.bilibili.com/video/BV1Nr4y1P7sf'}} allowsFullscreenVideo style={{height:500}} nestedScrollEnabled />
        </ScrollView>
    );
}

const css = StyleSheet.create({
    ver: {
        textAlign: 'right',
    },
    rcitem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    rcitemText: {
        flex: 1,
    },
});
