import React, { Component } from 'react';
import Navigator from './src/containers/Navigator'
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo"
import { StatusBar } from 'react-native';
import { Root } from 'native-base'
import { createStore, compose } from 'redux'
import reducer from './src/store/reducers'
import { Provider } from 'react-redux'
import firebase from 'react-native-firebase';
import { Client } from 'bugsnag-react-native';
import OfflineNotice from './src/components/OfflineNotice/index'

const bugsnag = new Client("92e5cb01626cd2496fddc87114d1f793");

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataLoaded: false,
            isConnected: undefined
        }
        
        /* Connect to redux dev tools in dev mode */
        if (__DEV__) {
            this.composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
        } else {
            this.composeEnhancers = compose
        }
        /* Get redux state from async storage */
        this.retrieveData()
    }

    retrieveData = async () => {
        try {
            //Check if previous state exists
            const value = await AsyncStorage.getItem('reduxState');
            
            if (value) {
                // We have state!!
                this.store = createStore(reducer, JSON.parse(value), this.composeEnhancers())
            } else {
                //Create a new store with initial data
                this.store = createStore(reducer, this.composeEnhancers())
            }
            //persist data each time when an action is called
            this.store.subscribe(() => {
                AsyncStorage.setItem('reduxState', JSON.stringify(this.store.getState()))
            })
            //UI can be loaded now
            this.setState({ dataLoaded: true })
        } catch (error) {
            // Error retrieving data
        }
    }

    componentWillMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({ isConnected: isConnected ? true : false })
        });
    }

    async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
        //Adding connection change listener
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
        //Removing connection change listener
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    // Handles internet connectivity change
    handleConnectivityChange = isConnected => {
        this.setState({ isConnected: isConnected ? true : false });
    };
    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (!enabled) {
            this.requestPermission();
        }
    }

    async createNotificationListeners() {
        const channel = new firebase.notifications.Android.Channel(
            '1',
            'happyworks',
            firebase.notifications.Android.Importance.Max
        ).setDescription('A natural description of the channel');
        firebase.notifications().android.createChannel(channel);

        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const localNotification = new firebase.notifications.Notification({
                sound: 'default',
                show_in_foreground: true
            })
                .setNotificationId(notification.notificationId)
                .setTitle(notification.title)
                .setSubtitle(notification.subtitle)
                .setBody(notification.body)
                .setData(notification.data)
                .android.setChannelId('1') 
                .android.setColor('#000000')
                .android.setPriority(firebase.notifications.Android.Priority.High);
            firebase.notifications()
                .displayNotification(localNotification)
                .catch(err => console.error(err));
        });

    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
        }
    }

    // Status bar color #1c92c4
    render() {
        return (
            this.state.dataLoaded ?
                <Root style={{zIndex:0}}>
                    <StatusBar backgroundColor='#1c92c4' barStyle='light-content' />
                    <Provider store={this.store}>
                        <OfflineNotice isConnected={this.state.isConnected} />
                        <Navigator />
                    </Provider>
                </Root>
                : null
        )
    }
}

