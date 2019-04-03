import config from '../../config'
import axios from 'axios'

const url = config.url.dataApi
const env = config.env.dev
const type = config.type.data_apis
export const save_answers = (
    payload
) => {
    const endpoint = url + "/" + env + "/" + type + "/" + config.api.save_answers
    return axios.post(endpoint, 
        payload
    )

}