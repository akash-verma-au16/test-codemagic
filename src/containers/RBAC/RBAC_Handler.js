import {reactNativeHelper} from './reactNativeHelper'

export const checkIfSessionExpired = (code, navigation, deAuthenticate) => {
    if (code && 400 <= code.status <= 499) {
        reactNativeHelper(navigation, deAuthenticate)
    } else {
        return
    }
}