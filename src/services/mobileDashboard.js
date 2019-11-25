import config from '../../config'
import axios from 'axios'

export const daily = (
    payload, headers
) => {
    const endpoint = config.url.daily
    return axios.post(endpoint, payload, headers)
}

export const weekly_sleep = (
    payload, headers
) => {
    const endpoint = config.url.weekly_sleep
    return axios.post(endpoint, payload, headers)
}

export const weekly_energy = (
    payload, headers
) => {
    const endpoint = config.url.weekly_energy
    return axios.post(endpoint, payload, headers)
}