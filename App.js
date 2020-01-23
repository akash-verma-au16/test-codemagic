import React, { Component } from "react";
import Navigator from "./src/containers/Navigator";
import AsyncStorage from "@react-native-community/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { StatusBar } from "react-native";
import { Root } from "native-base";
import { createStore, compose } from "redux";
import reducer from "./src/store/reducers";
import { Provider } from "react-redux";
//Firebase
import firebase from "react-native-firebase";
import OfflineNotice from "./src/components/OfflineNotice/index";
const fcmChannelID = "happyworks-push_notification-channel";

const navigate = async url => {
    let data = "";
    if (url) data = url.split("/");
    else return;
    if (data[2] === "endorsement") {
        if (data[3]) AsyncStorage.setItem("pushNotificationNavigation", data[3]);
    } else if (data[2] == "gratitude") {
        if (data[3]) AsyncStorage.setItem("pushNotificationNavigation", data[3]);
    } else if (data[2] == "survey") {
        if (data[3]) AsyncStorage.setItem("pushNotificationSurvey", data[3]);
    }
};

const prefix = "happyworks://";
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            isConnected: undefined
        };

        /* Connect to redux dev tools in dev mode */
        if (__DEV__) {
            this.composeEnhancers =
                window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        } else {
            this.composeEnhancers = compose;
        }
        /* Get redux state from async storage */
        this.retrieveData();
    }

    retrieveData = async () => {
        try {
            //Check if previous state exists
            const value = await AsyncStorage.getItem("reduxState");

            if (value) {
                // We have state!!
                this.store = createStore(
                    reducer,
                    JSON.parse(value),
                    this.composeEnhancers()
                );
            } else {
                //Create a new store with initial data
                this.store = createStore(reducer, this.composeEnhancers());
            }
            //persist data each time when an action is called
            this.store.subscribe(() => {
                AsyncStorage.setItem(
                    "reduxState",
                    JSON.stringify(this.store.getState())
                );
            });
            //UI can be loaded now
            this.setState({ dataLoaded: true });
        } catch (error) {
            // Error retrieving data
        }
    };

    componentWillMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({ isConnected: isConnected ? true : false });
        });
    }

    componentDidMount() {
        //Adding connection change listener
        NetInfo.isConnected.addEventListener(
            "connectionChange",
            this.handleConnectivityChange
        );
        // Push Notification Listeners
        this.checkPermission();
        this.createNotificationChannel();
        this.notificationListeners();
    }

    removeNotificationListener = () => {
        this.notificationListener();
        this.notificationOpenedListener();
    };

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    async getToken() {
        let fcmToken = await AsyncStorage.getItem("token");
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem("token", fcmToken);
            }
        }
    }

    async createNotificationChannel() {
        const channel = new firebase.notifications.Android.Channel(
            fcmChannelID,
            "HappyWorks Channel",
            firebase.notifications.Android.Importance.Max
        ).setDescription("HappyWorks channel for Push Notification");

        // Create the channel
        firebase.notifications().android.createChannel(channel);
    }

    notificationListeners = async () => {
        //Event Handler Function to when notification is received
        this.notificationListener = firebase
            .notifications()
            .onNotification(notification => {
                notification.android.setChannelId(fcmChannelID);
                notification.android.setAutoCancel(true);
                // Display Notification when received
                firebase.notifications().displayNotification(notification);
            });
        //Handler function when app is in foreground/background
        this.notificationOpenedListener = firebase
            .notifications()
            .onNotificationOpened(notificationOpen => {
                let url = notificationOpen.notification.data["pinpoint.deeplink"];
                navigate(url);
            });
        //Handler function when app is in killed state
        const notificationOpen = await firebase
            .notifications()
            .getInitialNotification();
        if (notificationOpen) {
            let url = notificationOpen.notification.data["pinpoint.deeplink"];
            navigate(url);
        }
    };

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
        }
    }
    componentWillUnmount() {
        //Removing connection change listener
        NetInfo.isConnected.removeEventListener(
            "connectionChange",
            this.handleConnectivityChange
        );
        this.removeNotificationListener();
    }

    // Handles internet connectivity change
    handleConnectivityChange = isConnected => {
        this.setState({ isConnected: isConnected ? true : false });
    };

    render() {
        return this.state.dataLoaded ? (
            <Root style={{ zIndex: 0 }}>
                <StatusBar backgroundColor='#47309C' barStyle='light-content' />
                <Provider store={this.store}>
                    <OfflineNotice isConnected={this.state.isConnected} />
                    <Navigator uriPrefix={prefix} />
                </Provider>
            </Root>
        ) : null;
    }
}
