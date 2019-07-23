import axios from 'axios';
import config from '../../config';
export const register_device = (
    payload
) => {
    const endpoint = config.url.register_device
    return axios.post(endpoint, payload)
}

export const unregister = (
    payload
) => {
    const endpoint = config.url.unregister
    return axios.post(endpoint, payload)
}

//Push notification status APIs
export const get_status = (
    payload
) => {
    const endpoint = config.url.get_status
    return axios.post(endpoint, payload)
}

export const enable_status = (
    payload
) => {
    const endpoint = config.url.enable_status
    return axios.post(endpoint, payload)
}

export const disable_status = (
    payload
) => {
    const endpoint = config.url.disable_status
    return axios.post(endpoint, payload)
}
