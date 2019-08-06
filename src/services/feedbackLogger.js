import axios from 'axios';

export default (
    payload
) => {
    const endpoint = 'https://yo5ripzlj4.execute-api.ap-south-1.amazonaws.com/api/notify_customer_feedback'

    const title = ':telephone_receiver: *Feedback*,'
    const userName = ':man_dancing::skin-tone-3: *User Name* : ' + payload.userName+','
    const email = ':email: *Email* : '+payload.email+',' 
    const que = 'What do you think of our App?' 
    const ans = payload.userAns+','
    const feedback = ':envelope: *User feedback* : '+ payload.feedback+','

    const styledPayload =
        title +
        userName +
        email +
        que +
        ans +
        feedback 
    axios.post(endpoint, { data: styledPayload })     
}   