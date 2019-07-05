import config from '../../config';
import axios from 'axios';

export const inapp_notification = (
    payload, headers
) => {
    const endpoint = config.url.inapp_notification
    return axios.post(endpoint, payload, headers)
}