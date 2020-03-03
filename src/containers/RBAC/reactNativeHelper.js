//use either react-native or react specific components and libraries in this file to logout the user
import { ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import { StackActions, NavigationActions } from 'react-navigation';
import { unregister } from '../../services/pushNotification'
import { logout } from '../../services/bAuth'

async function clearLikeHandler() {
    try {
        // take backup of tokens
        const pushNotificationToken = await AsyncStorage.getItem('token');
        const redux = await AsyncStorage.getItem('reduxState');
        // format the system
        await AsyncStorage.clear()
        // restore the tokens
        if (pushNotificationToken) {
            await AsyncStorage.setItem('token', pushNotificationToken)
        }
        if (redux) {
            await AsyncStorage.setItem('reduxState', redux)
        }
    } catch (error) {
        // Error retrieving data
    }
}

export async function reactNativeHelper(navigation, deAuthenticate) {
    const redux = await AsyncStorage.getItem('reduxState');
    const userState = JSON.parse(redux).user
    const payload = {
        accountAlias: userState.accountAlias,
        email: userState.emailAddress
    }
    const payload_2 = {
        tenant_id: userState.accountAlias,
        associate_id: userState.associate_id
    }

    logout(payload).then(async () => {
        // Signout
        deAuthenticate()
        await clearLikeHandler()
        unregister(payload_2)
        ToastAndroid.showWithGravityAndOffset(
            'Session expired, please login again to continue!',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            100,
        )
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'LoginPage' })],
            key: null
        });
        navigation.dispatch(resetAction)
        return
    }).catch(() => {
        ToastAndroid.showWithGravityAndOffset(
            'Unable to communicate with server',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            100,
        );

    })
}
