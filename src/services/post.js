import config from '../../config';
import axios from 'axios';

// const url = config.url.post;
// const env = config.env.qa;

export const list_posts = (
    payload, headers
) => {
    // const endpoint = url + "/" + env + "/" + config.type.post + "/" + config.api.list_posts
    const endpoint = config.url.list_posts
    return axios.post(endpoint, payload, headers)
}

export const create_post = (
    payload, headers
) => {
    const endpoint = config.url.create_post
    return axios.put(endpoint, payload, headers)
}

export const get_visibility = (
    payload, headers
) => {
    const endpoint = config.url.get_visibility
    return axios.post(endpoint, payload, headers)
}

export const news_feed = (
    payload, headers
) => {
    const endpoint = config.url.news_feed
    return axios.post(endpoint, payload, headers)
}

export const read_post = (
    payload, headers
) => {
    const endpoint = config.url.read_posts
    return axios.post(endpoint, payload, headers)
}

export const like_post = (
    payload, headers
) => {
    const endpoint = config.url.like_post
    return axios.put(endpoint, payload, headers)
}

export const unlike_post = (
    payload, headers
) => {
    const endpoint = config.url.unlike_post
    return axios.put(endpoint, payload, headers)
}

export const edit_post = (
    payload, headers
) => {
    const endpoint = config.url.edit_post
    return axios.put(endpoint, payload, headers)
}

export const delete_post = (
    payload, headers
) => {
    const endpoint = config.url.delete_post
    return axios.put(endpoint, payload, headers)
}

export const list_likes = (
    payload, headers
) => {
    const endpoint = config.url.list_likes
    return axios.post(endpoint, payload, headers)
}
export const like_id = (
    payload
) => {
    const endpoint = config.url.like_id
    return axios.post(endpoint, payload)
}
export const liked_post = (
    payload, headers
) => {
    const endpoint = config.url.liked_post
    return axios.post(endpoint, payload, headers)
}

//Get Associate Names for Post
export const get_associate_name = (
    payload
) => {
    const endpoint = config.url.get_associate_name
    return axios.post(endpoint, payload)
}

export const rewards_addon = (
    payload, headers
) => {
    const endpoint = config.url.rewards_addon
    return axios.post(endpoint, payload, headers)
}