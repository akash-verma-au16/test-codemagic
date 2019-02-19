import config from '../../config';
import axios from 'axios';

const url = config.url.devhw;
const env = config.env.devhw;

export const read_member = (
    payload
) => {
    const endpoint = url + "/" + env + "/" + config.role.admin + "/" + config.api.read_member
    return axios.post(endpoint,payload)
}