import config from '../../config';
import axios from 'axios';

const url = config.url.push;

export const register_device = (
    payload
) => {
    const endpoint = url + "/" + config.type.api + "/" + config.api.register_device
    return axios.post(endpoint, payload)
}
