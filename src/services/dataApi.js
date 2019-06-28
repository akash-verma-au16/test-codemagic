import config from '../../config'
import axios from 'axios'

export const save_answers = (
    payload, headers
) => {
    const endpoint = config.api.save_answers
    return axios.post(endpoint, 
        payload, headers
    )

}