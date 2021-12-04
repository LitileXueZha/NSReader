import React, { Component } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    Alert,
    RefreshControl,
    Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';

import { AppContext } from '../../AppContext.js';
import { BASE_SPACE } from '../../themes/typography.js';
import Text from '../../components/SText.js';
import Notification from '../../utils/notification.js';
import Touchable from '../../components/Touchable.js';
import Topbar, {
    STATUS_LOADING,
    STATUS_UPDATING,
    STATUS_DONE,
    TOPBAR_SPACE,
} from './Topbar.js';
import AppSettings from '../../AppSettings.js';


class Story extends Component {
    constructor() {
        super();
        this.state = {
            status: STATUS_LOADING,
            // status: STATUS_DONE,
            refreshing: false,
        };
    }

    componentDidMount() {
        setTimeout(() => this.setState({ status: STATUS_DONE }), 1500);
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        setTimeout(() => {
            this.setState({
                refreshing: false,
                status: STATUS_DONE,
            });
        }, 1000);
    }

    sendNotification = () => {
        new Notification('新消息来了', {
            body: '根据权威专家指明，某东西存在问题需要群众谨慎对待',
            data: 'data',
        });
    };

    render() {
        const { theme, typo } = this.context;
        const { status, refreshing } = this.state;

        return (
            <View style={css.container}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={css.list} refreshControl={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}
                        progressViewOffset={48}
                    />
                }>
                    <View style={{ paddingHorizontal: typo.padding }}>
                        <Text>Story</Text>
                        <View>
                            <Text>{JSON.stringify(this.context, null ,2)}</Text>
                        </View>
                        <TouchableHighlight onPress={() => Alert.alert('1')}>
                            <View style={{ elevation: 1,borderWidth:0, padding: typo.padding, backgroundColor: '#dddddd' }}>
                                <Text>touchable</Text>
                            </View>
                        </TouchableHighlight>
                        <Touchable onPress={this.sendNotification}>
                            <View style={{ padding: typo.padding }}>
                                <Text>发送通知</Text>
                            </View>
                        </Touchable>
                    </View>
                    <Button title="保存主题" onPress={() => AppSettings.store('theme', theme.id === 'main' ? 'dark' : 'main')} />
                    <Button title="第二个页面" onPress={() => Navigation.push('root',{component:{name:'settings'}})} />
                </ScrollView>
                <Topbar status={status} />
            </View>
        );
    }
}
Story.contextType = AppContext;

const css = StyleSheet.create({
    container: {
        flex: 1,
    },
    topbar: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: BASE_SPACE,
        height: 48,
        elevation: 4,
        borderRadius: 4,
        overflow: 'hidden',
    },
    list: {
        // flex: 1,
        paddingTop: TOPBAR_SPACE,
    },
});

export default Story;
