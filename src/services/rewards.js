import config from '../../config'
import axios from 'axios'

export const give_rewards = (
    payload, headers
) => {
    const endpoint = config.url.give_reward
    return axios.post(endpoint, 
        payload, headers
    )

}