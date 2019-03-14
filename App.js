import React, { Component } from 'react';
import Navigator from './src/containers/Navigator'
import { AsyncStorage } from 'react-native';
import { Root } from 'native-base'
import { createStore, compose } from 'redux'
import reducer from './src/store/reducers'
import { Provider } from 'react-redux'
import firebase from 'react-native-firebase';

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataLoaded: false
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

    async componentDidMount() {
        this.checkPermission();
    }
    //1 : Check for Push Notification Permissions
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //2 : Request for Permission if permission not available
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    //3 : Get the device token and store it in Async storage
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
        console.log('FCM Token : ')
        console.log(fcmToken)
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
    render() {
        return (
            this.state.dataLoaded ?
                <Root>
                    <Provider store={this.store}>
                        <Navigator />
                    </Provider>
                </Root>
                : null
        )
    }
}
