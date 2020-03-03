import config from '../../config';
import axios from 'axios';

const url = config.url.dev;
const env = config.env.dev;
export const login = ({ email, password }) => {
    const endpoint = url + "/" + env + "/" + config.api.signin
    if (email && password) {
        return axios.post(endpoint, {
            "username": email.toLowerCase().trim(),
            "password": password.trim()
        })
    }
}

export const logout = ({ accountAlias, email }) => {
    const endpoint = url + "/" + env + "/" + config.api.signout
    if (accountAlias && email) {
        return axios.post(endpoint, {
            "username": email.toLowerCase().trim(),
            "tenant_id": accountAlias.toLowerCase().trim()
        })
    }
}

export const forgotPassword = ({ email }) => {
    const endpoint = url + "/" + env + "/" + config.api.forgot_password
    if (email) {
        return axios.post(endpoint, {
            "username": email.toLowerCase().trim()
        })
    }

}

export const confirmPassword = ({ email, password, otp }) => {
    const endpoint = url + "/" + env + "/" + config.api.confirm_password
    if (email && password && otp) {
        return axios.post(endpoint, {
            "username": email.toLowerCase().trim(),
            "verification_code": otp.trim(),
            "new_password": password.trim()
        })
    }
}

export const changePassword = (payload, headers) => {
    const endpoint = url + "/" + env + "/" + config.api.change_password
    return axios.post(endpoint, payload, headers);
}

export const acceptSubscription = payload => {
    const endpoint = url + "/" + env + "/" + config.api.accept_subscription
    return axios.post(endpoint, payload);
}

export const forceChangePassword = ({ email, password, new_password }) => {
    const endpoint = url + "/" + env + "/" + config.api.force_password_change
    if (email && password && new_password) {
        return axios.post(endpoint, {
            "username": email.toLowerCase().trim(),
            "password": password.trim(),
            "new_password": new_password.trim()
        })
    }
}

export const refreshToken = (payload) => {
    const endpoint = url + "/" + env + "/" + config.api.refresh_token
    return axios.post(endpoint, payload)
}