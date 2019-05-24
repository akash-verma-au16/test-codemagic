import axios from 'axios';
import config from '../../config';

export const add_comment = (payload, header) => {
    const endpoint = config.url.comment_post
    return axios.put(endpoint, payload, header)
}