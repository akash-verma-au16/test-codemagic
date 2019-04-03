import config from '../../config';
import axios from 'axios';

const url = config.url.post;
const env = config.env.qa;

export const create_post = (
    payload
) => {
    const endpoint = url + "/" + env + "/" + config.type.post + "/" + config.api.create_post
    return axios.post(endpoint,payload)
}

export const list_posts = (
    payload
) => {
    const endpoint = url + "/" + env + "/" + config.type.post + "/" + config.api.list_posts
    return axios.post(endpoint,payload)
}