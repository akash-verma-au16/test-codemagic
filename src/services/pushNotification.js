import axios from 'axios';
import config from '../../config';
export const register_device = (
    payload, headers
) => {
    const endpoint = config.url.register_device
    return axios.post(endpoint, payload, headers)
}

export const unregister = (
    payload
) => {
    const endpoint = config.url.unregister
    return axios.post(endpoint, payload)
}
