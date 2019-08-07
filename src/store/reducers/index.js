import { auth,system,dev, user } from '../actions'

const initialState = {
    isAuthenticate: false,
    user: {
        accountAlias: "",
        tenant_name: "",
        associate_id:"",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        emailAddress: "",
        imageUrl: "",
        tenantImageUrl: "",
        idToken:"",
        walletBalance: "",
        pushNotifStatus: false,
        feedbackDisplayCount: 0
    },
    system: {
        isFreshInstall: true,
        isConnected: undefined
    }
}
export default (state = initialState, action) => {

    switch (action.type) {

    case auth.AUTHENTICATE_USER: {
        return {
            ...state,
            isAuthenticate: true,
            user: {
                ...state.user,
                accountAlias: action.payload.accountAlias,
                tenant_name: action.payload.tenant_name,
                associate_id:action.payload.associate_id,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                phoneNumber: action.payload.phoneNumber,
                emailAddress: action.payload.emailAddress,
                idToken: action.payload.idToken
            }
        }
    }

    case auth.DEAUTHENTICATE_USER: {

        return {
            ...state,
            isAuthenticate: false,
            user: initialState.user
        }
    }
    case system.AGREE_POLICY: {

        return {
            ...state,
            system:{
                ...state.system,
                isFreshInstall:false
            }
        }
    }
    case user.UPDATE_IMAGE: {
        return {
            ...state,
            user: {
                ...state.user,
                imageUrl:action.payload
            }
        }
    }
    // Setting Internet Connectivity flag

    case system.NETWORK_STATUS: {
        return {
            ...state,
            system: {
                ...state.system,
                isConnected: action.payload
            }
        }
    }

    case dev.CLEAR_DATA: {
        return {
            ...initialState
        }
    }

    case dev.UPDATE_USER: {
        return {
            ...state,
            user: {
                ...state.user,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                phoneNumber: action.payload.phoneNumber,
                emailAddress: action.payload.emailAddress
            }
        }
    }

    case dev.UPDATE_WALLET: {
        return {
            ...state,
            user: {
                ...state.user,
                walletBalance: action.payload.walletBalance
            }
        }
    }

    case user.UPDATE_PUSH_STATUS: {
        return {
            ...state,
            user: {
                ...state.user,
                pushNotifStatus: action.payload.pushNotifStatus
            }
        }
    }

    case user.UPDATE_FEEDBACK_DISPLAY_COUNT: {
        return {
            ...state,
            user: {
                ...state.user,
                feedbackDisplayCount: state.user.feedbackDisplayCount + 1
            }
        }
    }

    default: {
        return state;
    }

    }

}