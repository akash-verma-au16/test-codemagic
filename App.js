import React, { Component } from 'react';
import Navigator from './src/containers/Navigator'
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo"
import { StatusBar, Linking } from 'react-native';
import { Root } from 'native-base'
import { createStore, compose } from 'redux'
import reducer from './src/store/reducers'
import { Provider } from 'react-redux'
import OfflineNotice from './src/components/OfflineNotice/index'
// push notification
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import PushNotification from '@aws-amplify/pushnotification';
import awsconfig from './aws-exports';
import { InAppNotificationProvider } from 'react-native-in-app-notification'
// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
// send analytics events to Amazon Pinpoint
Analytics.configure(awsconfig);
// configure push notification
PushNotification.configure(awsconfig);

PushNotification.onRegister((token) => {
    //Generate Device token
    console.log('in app registration', token);
    AsyncStorage.setItem('token', token)

});
PushNotification.onNotificationOpened((notification) => {
    //Navigate to the respective page with payload
    console.log('the notification is opened', notification)
    const url = notification['pinpoint.deeplink']
    let data = ''
    if (url)
        data = url.split('/')
    else
        return
    if (data[2] === 'endorsement') {
        if (data[3])
            AsyncStorage.setItem('pushNotificationNavigation', data[3])
    }
    else if (data[2] == 'gratitude') {
        if (data[3])
            AsyncStorage.setItem('pushNotificationNavigation', data[3])
    }

});
const prefix = 'happyworks://';
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

    componentDidMount() {
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

    render() {
        return (
            this.state.dataLoaded ?
                <InAppNotificationProvider backgroundColour='#76c1e2'>
                    <Root style={{ zIndex: 0 }}>
                        <StatusBar backgroundColor='#1c92c4' barStyle='light-content' />
                        <Provider store={this.store}>
                            <OfflineNotice isConnected={this.state.isConnected} />
                            <Navigator uriPrefix={prefix} />
                        </Provider>
                    </Root>
                </InAppNotificationProvider>
                : null
        )
    }
}

