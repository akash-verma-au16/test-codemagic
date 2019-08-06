import config from '../../config';
import axios from 'axios';

const url = config.url.dev;
const env = config.env.dev;
export const login = ({accountAlias , email , password}) => {
    const endpoint = url + "/" + env + "/" + config.api.signin
    if (accountAlias && email && password) {
        return axios.post(endpoint, {
            "username": email.toLowerCase().trim(),
            "password": password.trim(),
            "tenant_id": accountAlias.toLowerCase().trim()
        })
    }
}

export const logout = ({accountAlias,email}) => {
    const endpoint = url + "/" + env + "/" + config.api.signout
    if (accountAlias && email) {
        return axios.post(endpoint, {
            "username": email.toLowerCase().trim(),
            "tenant_id": accountAlias.toLowerCase().trim()
        })
    }
}

export const forgotPassword = ({accountAlias, email}) =>{
    const endpoint = url + "/" + env + "/" + config.api.forgot_password
    if(accountAlias && email){
        return axios.post(endpoint,{
            "tenant_id": accountAlias.toLowerCase().trim(),
            "username": email.toLowerCase().trim()
        })
    }

}

export const confirmPassword = ({accountAlias, email, password, otp}) =>{
    const endpoint = url + "/" + env + "/" + config.api.confirm_password
    if(accountAlias && email && password && otp){
        return axios.post(endpoint,{
            "username":email.toLowerCase().trim(),
            "verification_code":otp.trim(),
            "new_password":password.trim(),
            "tenant_id":accountAlias.toLowerCase().trim()
        })
    }
}

export const forceChangePassword = ({accountAlias, email, password, new_password}) =>{
    const endpoint = url + "/" + env + "/" + config.api.force_password_change
    if(accountAlias && email && password && new_password){
        return axios.post(endpoint,{
            "username":email.toLowerCase().trim(),
            "password":password.trim(),
            "new_password":new_password.trim(),
            "tenant_id":accountAlias.toLowerCase().trim()
        })
    }
}

export const refreshToken = (payload) => {
    const endpoint = config.url.refresh_token
    return axios.post(endpoint, payload)
}