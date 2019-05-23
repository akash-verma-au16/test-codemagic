import config from '../../config';
import axios from 'axios';

export const read_transaction = (
    payload, headers
) => {
    const endpoint = config.url.read_transaction
    return axios.post(endpoint, payload, headers)
}

export const get_balance = (
    payload, headers
) => {
    const endpoint = config.url.get_balance
    return axios.post(endpoint, payload, headers)
}

export const user_profile = (
    payload, headers
) => {
    const endpoint = config.url.user_profile
    return axios.post(endpoint, payload, headers)
}

export const strength_counts = (
    payload, headers
) => {
    const endpoint = config.url.strength_counts
    return axios.post(endpoint, payload, headers)
}

export const update_profile = (
    payload, headers
) => {
    const endpoint = config.url.update_profile
    return axios.post(endpoint, payload, headers)
}