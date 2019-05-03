import config from '../../config';
import axios from 'axios';

// const url = config.url.post;
// const env = config.env.qa;

export const list_posts = (
    payload
) => {
    // const endpoint = url + "/" + env + "/" + config.type.post + "/" + config.api.list_posts
    const endpoint = config.url.list_posts
    return axios.post(endpoint,payload)
}

export const create_post = (
    payload
) => {
    const endpoint = config.url.create_post
    return axios.put(endpoint,payload)
}

export const get_visibility = (
    payload
) => {
    const endpoint = config.url.get_visibility
    return axios.post(endpoint,payload)
}

export const news_feed = (
    payload
) => {
    const endpoint = config.url.news_feed
    return axios.post(endpoint,payload)
}