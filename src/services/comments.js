import axios from 'axios';
import config from '../../config';

export const add_comment = (payload, header) => {
    const endpoint = config.url.comment_post
    return axios.put(endpoint, payload, header)
}

export const list_comments = (payload, header) => {
    const endpoint = config.url.list_comments
    return axios.post(endpoint, payload, header)
}

export const delete_comment = (payload, header) => {
    const endpoint = config.url.comment_post
    return axios.put(endpoint, payload, header)
}

export const edit_comment = (payload, header) => {
    const endpoint = config.url.comment_post
    return axios.put(endpoint, payload, header)
}