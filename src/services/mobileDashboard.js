import config from '../../config'
import axios from 'axios'

export const daily = (
    payload, headers
) => {
    const endpoint = config.url.daily
    return axios.post(endpoint, payload, headers)
}

export const weekly_data = (
    payload, headers
) => {
    const endpoint = config.url.weekly_data
    return axios.post(endpoint, payload, headers)
}