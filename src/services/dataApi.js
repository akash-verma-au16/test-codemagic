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

export const get_survey_status = (
    payload, headers
) => {
    const endpoint = config.url.get_survey_status
    return axios.post(endpoint, payload, headers)
}