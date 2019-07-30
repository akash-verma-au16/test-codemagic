import { reactNativeHelper } from './reactNativeHelper'

export const checkIfSessionExpired = (code, navigation, deAuthenticate) => {
    try {
        if (code.status <= 499) {
            reactNativeHelper(navigation, deAuthenticate)
        } else {
            return
        }
    } catch (error) {
        //error
    }

}