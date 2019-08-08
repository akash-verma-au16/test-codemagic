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
    //Get new Tokens
    refreshToken(payload).then((res) => {
        updateNewTokens({ accessToken: res.data.payload.AccessToken})
    }).catch(() => {
        reactNativeHelper(navigation, deAuthenticate)
    })

}

export const checkIfSessionExpired = (code, navigation, deAuthenticate, updateNewTokens) => {
    try {
        if(code.status === 401) {
            reactNativeHelper(navigation, deAuthenticate)
            return true
        } 
        else if(code.status === 403) {
            refreshTokens(navigation, deAuthenticate, updateNewTokens)
            return false
        }
        else {
            return
        }
    } catch (error) {
        //error
    }

}