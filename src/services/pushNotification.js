import axios from 'axios';

export const register_device = (
    payload
) => {
    const endpoint = 'https://9ss6sd43mk.execute-api.ap-southeast-1.amazonaws.com/api/register_device'
    return axios.post(endpoint, payload)
}
