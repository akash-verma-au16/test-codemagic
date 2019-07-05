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
