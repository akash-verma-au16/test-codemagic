import { reactNativeHelper } from './reactNativeHelper'

import { AsyncStorage } from 'react-native'
import { refreshToken } from '../../services/bAuth';

async function refreshTokens(navigation, deAuthenticate, updateNewTokens){
    const redux = await AsyncStorage.getItem('reduxState');
    const userState = JSON.parse(redux).user

    const payload = {
        refresh_token: userState.refreshToken,
        tenant_id: userState.accountAlias
    }
    console.log('refreshTokens',payload)
    refreshToken(payload).then((res) => {
        console.log('response', res.data.payload.AccessToken)
        updateNewTokens({ accessToken: res.data.payload.AccessToken})
    }).catch((e) => {
        console.log('error')
        reactNativeHelper(navigation, deAuthenticate)
    })

}

export const checkIfSessionExpired = (code, navigation, deAuthenticate, updateNewTokens) => {
    try {
        if(code.status === 401) {
            console.log(code.status)
            reactNativeHelper(navigation, deAuthenticate)
            return true
        } 
        else if(code.status === 403) {
            console.log(code.status)
            refreshTokens(navigation, deAuthenticate, updateNewTokens)
            return false
        }
        else {
            console.log(code.status)
            reactNativeHelper(navigation, deAuthenticate)
            return true
        }
    } catch (error) {
        //error
    }

}