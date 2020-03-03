import { reactNativeHelper } from './reactNativeHelper'

import AsyncStorage from '@react-native-community/async-storage'
import { refreshToken } from '../../services/bAuth';
// import errorLogger from '../../services/errorLogger'

async function refreshTokens(navigation, deAuthenticate, updateNewTokens){

    const redux = await AsyncStorage.getItem('reduxState');
    const userState = JSON.parse(redux).user

    const payload = {
        refresh_token: userState.refreshToken,
        tenant_id: userState.accountAlias
    }
    //Get new Tokens
    refreshToken(payload).then(async (res) => {
        updateNewTokens({ accessToken: res.data.payload.AccessToken})
        // store token expire time in the local storage
        await AsyncStorage.setItem(
            "accessTokenExp",
            JSON.stringify(res.data.payload.AccessTokenPayload.exp)
        );

    }).catch(() => {
        reactNativeHelper(navigation, deAuthenticate)
    })

}

export const checkIfSessionExpired = async (code, navigation, deAuthenticate, updateNewTokens) => {
    try {
        if (code.status === 403) {
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