import axios from 'axios';

export default (
    payload
) => {
    const endpoint = 'https://wsmtazgym3.execute-api.ap-south-1.amazonaws.com/api/notify'

    const title = ':round_pushpin: *Push Notification*,'
    const userName = ':man_dancing::skin-tone-3: *User Name* : '+payload.name+','
    const email = ':email: *Email* : '+payload.email+','
    const platform = ':iphone: *Platform* : '+payload.platform+','
    const token = ':old_key: *Device Token*,'
    const tokenData = '```' + payload.token + '```'

    const styledPayload =
        
        title +
        userName +
        email +
        platform +
        token +
        tokenData 
    axios.post(endpoint, { data: styledPayload })
        
}