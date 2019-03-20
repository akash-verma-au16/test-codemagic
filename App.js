import React, { Component } from 'react';
import Navigator from './src/containers/Navigator'
import { AsyncStorage ,StatusBar,Alert} from 'react-native';
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

    async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
    }

    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }
    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (!enabled) {
            this.requestPermission();
        } 
    }
    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
            const localNotification = new firebase.notifications.Notification({
                sound: 'default',
                show_in_foreground: true
            })
                .setNotificationId(notification.notificationId)
                .setTitle(notification.title)
                .setSubtitle(notification.subtitle)
                .setBody(notification.body)
                .setData(notification.data)
                .android.setChannelId('channelId') // e.g. the id you chose above
                .android.setColor('#000000') // you can set a color here
                .android.setPriority(firebase.notifications.Android.Priority.High);
            firebase.notifications()
                .displayNotification(localNotification)
                .catch(err => console.error(err));
        });

    }

    showAlert(title, body) {
        Alert.alert(
            title, body,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false },
        );
    }

    //2
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

    render() {
        return (
            this.state.dataLoaded ?
                <Root>
                    <StatusBar backgroundColor='#1c92c4' barStyle='light-content' />
                    <Provider store={this.store}>
                        <Navigator />
                    </Provider>
                </Root>
                : null
        )
    }
}
