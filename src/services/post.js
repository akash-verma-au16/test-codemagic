import config from '../../config';
import axios from 'axios';

const url = config.url.post;
const env = config.env.qa;

export const list_posts = (
    payload
) => {
    const endpoint = url + "/" + env + "/" + config.type.post + "/" + config.api.list_posts
    return axios.post(endpoint,payload)
}

export const create_post = (
    payload
) => {
    const endpoint = config.url.create_post
    return axios.put(endpoint,payload)
}