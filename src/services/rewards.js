import config from '../../config'
import axios from 'axios'

const url = config.url.rewards
const type = config.type.api
export const give_rewards = (
    payload
) => {
    const endpoint = url + "/" + type + "/" + config.api.give_rewards
    return axios.post(endpoint, 
        payload
    )

}