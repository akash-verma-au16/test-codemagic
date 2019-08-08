import axios from 'axios';

export default (
    payload
) => {
    const endpoint = 'https://yo5ripzlj4.execute-api.ap-south-1.amazonaws.com/api/notify_customer_feedback'

    const title = ':envelope_with_arrow: *Feedback*,\n'
    const userName = ':man_dancing::skin-tone-3: *User Name* : ' + payload.userName +',\n'
    const email = ':e-mail: *Email* : ' + payload.email +',\n' 
    const que = ':question: What do you think of our App?\n' 
    const ans = '*Ans* : ' +payload.userAns +',\n'
    const feedback = ':mailbox_with_mail: *User feedback* : ' + payload.feedback +'\n'

    const styledPayload =
        title +   
        userName +   
        email +   
        que +   
        ans +   
        feedback 
    axios.post(endpoint, { data: styledPayload })     
}   