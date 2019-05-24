import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import slackLogger from '../services/slackLogger'
import {register_device} from '../services/pushNotification'
import DeviceInfo from 'react-native-device-info'
let Name=''
let Email=''
let associate_id=''
let tenant_id=''
export const configureFirebase = async ({firstName,lastName,email,payload}) => {

    Name= firstName + ' ' + lastName
    Email=email
    associate_id=payload.associate_id
    tenant_id=payload.accountAlias

    checkPermission();
    
}

//1 : Check for Push Notification Permissions
const checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        getToken();
    } else {
        requestPermission();
    }
}

//2 : Request for Permission if permission not available
const requestPermission = async () => {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        
    }
}

//3 : Get the device token and store it in Async storage
const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();

        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }

    slackLogger({
        name : Name,
        email:Email,
        platform : Platform.OS,
        token : fcmToken,
        device_uid: DeviceInfo.getUniqueID()
    })

    register_device({
        tenant_id : tenant_id,
        associate_id:associate_id,
        platform : Platform.OS,
        device_token : fcmToken,
        device_uid: DeviceInfo.getUniqueID()
    }).then((res) => {
        console.log("register_device", res)
    }).catch((e) => {
        console.log("error", e.code)
    })
}