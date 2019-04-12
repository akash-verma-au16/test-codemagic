import config from '../../config'
import axios from 'axios'

const url = config.url.questionBank
const env = config.env.dev
const type = config.type.survey
export const read_survey = (
    survey_id
) => {
    const endpoint = url + "/" + env + "/" + type + "/" + config.api.read_survey
    if (
        survey_id
    ) {
        return axios.post(endpoint, {
            "survey_id": survey_id
        })
    } 
}

export const list_survey = (
    payload
) => {
    const endpoint = config.url.list_survey
    return axios.post(endpoint,payload)
}