import config from '../../config'
import axios from 'axios'

export const read_survey = (
    survey_id, headers
) => {
    const endpoint = config.api.read_survey
    if (
        survey_id
    ) {
        return axios.post(endpoint, {
            "survey_id": survey_id
        }, headers)
    } 
}

export const list_survey = (
    payload, headers
) => {
    const endpoint = config.url.list_survey
    return axios.post(endpoint, payload, headers)
}