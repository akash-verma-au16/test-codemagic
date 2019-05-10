import config from '../../config';
import axios from 'axios';

export const read_transaction = (
    payload
) => {
    const endpoint = config.url.read_transaction
    return axios.post(endpoint, payload)
}

export const get_balance = (
    payload
) => {
    const endpoint = config.url.get_balance
    return axios.post(endpoint, payload)
}

export const user_profile = (
    payload
) => {
    const endpoint = config.url.user_profile
    return axios.post(endpoint, payload)
}

export const strength_counts = (
    payload
) => {
    const endpoint = config.url.strength_counts
    return axios.post(endpoint, payload)
}

export const update_profile = (
    payload
) => {
    const endpoint = config.url.update_profile
    return axios.post(endpoint, payload)
}