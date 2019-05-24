import config from '../../config';
import axios from 'axios';

const url = config.url.devhw;
const env = config.env.devhw;

export const read_member = (
    payload, headers
) => {
    const endpoint = url + "/" + env + "/" + config.role.admin + "/" + config.api.read_member
    return axios.post(endpoint, payload, headers)
}

export const list_associate = (
    payload, headers
) => {
    const endpoint = config.url.list_associates
    return axios.post(endpoint, payload, headers)
}

// const endpoint = url + "/" + env + "/" + config.role.admin + "/" + config.api.list_associate