import axios from 'axios';

export const register_device = (
    payload
) => {
    const endpoint = 'https://flnuddep8j.execute-api.ap-southeast-1.amazonaws.com/api/register_device'
    return axios.post(endpoint, payload)
}

export const unregister = (
    payload
) => {
    const endpoint = 'https://flnuddep8j.execute-api.ap-southeast-1.amazonaws.com/api/unregister'
    return axios.post(endpoint, payload)
}
