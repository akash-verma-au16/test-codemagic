import config from '../../config'
import axios from 'axios'

export const give_rewards = (
    payload
) => {
    const endpoint = config.url.give_rewards
    return axios.post(endpoint, 
        payload
    )

}