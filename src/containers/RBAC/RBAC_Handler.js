import { reactNativeHelper } from './reactNativeHelper'

import { AsyncStorage } from 'react-native'
import { refreshToken } from '../../services/bAuth';
// import errorLogger from '../../services/errorLogger'

async function refreshTokens(navigation, deAuthenticate, updateNewTokens){
    await AsyncStorage.setItem('refreshingToken', 'true')
    const redux = await AsyncStorage.getItem('reduxState');
    const userState = JSON.parse(redux).user

    const payload = {
        refresh_token: userState.refreshToken,
        tenant_id: userState.accountAlias
    }
    //Get new Tokens
    refreshToken(payload).then(async(res) => {
        await updateNewTokens({ accessToken: res.data.payload.AccessToken})
        await AsyncStorage.setItem('refreshingToken', 'false')
    }).catch((e) => {
        // const payload = {
        //     errorCode: e.response.code,
        //     source: 'RefreshTokenAPI Failed'
        // }
        // errorLogger(payload)
        reactNativeHelper(navigation, deAuthenticate)
    })

}

export const checkIfSessionExpired = async (code, navigation, deAuthenticate, updateNewTokens) => {
    try {
        let refreshingToken = await AsyncStorage.getItem('refreshingToken')
        if (code.status === 403 && (refreshingToken == 'false' || refreshingToken == null)) {
            // const payload = {
            //     errorCode: code.status,
            //     source: 'Refreshing Tokens'
            // }
            // errorLogger(payload)
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