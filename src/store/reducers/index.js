import { auth,system,dev } from '../actions'

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
        tenantImageUrl: ""
    },
    system: {
        isFreshInstall: true
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
                emailAddress: action.payload.emailAddress
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

    case dev.CLEAR_DATA: {

        return {
            ...initialState
        }
    }

    default: {
        return state;
    }

    }

}