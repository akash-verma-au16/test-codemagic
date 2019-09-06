import axios from 'axios';

export default (
    payload
) => {
    const endpoint = 'https://yo5ripzlj4.execute-api.ap-south-1.amazonaws.com/api/notify_customer_feedback'

    const title = ':round_pushpin: *Push Notification*,\n'
    const userName = ':man_dancing::skin-tone-3: *User Name* : ' + payload.name +',\n'
    const email = ':email: *Email* : ' + payload.email +',\n'
    const platform = ':iphone: *Platform* : ' + payload.platform +',\n'
    const token = ':old_key: *Device Token*,\n'
    const tokenData = '```' + payload.token + '```'

    const styledPayload =
        
        title +
        userName +
        email +
        platform +
        token +
        tokenData 
    axios.post(endpoint, { type: 'device_info' ,data: styledPayload })
        
}