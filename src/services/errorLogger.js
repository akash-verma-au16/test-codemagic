import axios from 'axios';

export default (
    payload
) => {
    const endpoint = 'https://yo5ripzlj4.execute-api.ap-south-1.amazonaws.com/api/notify_customer_feedback'

    const title = '*Error*:\n'
    const errorCode = '*Error Code* : ' + payload.errorCode + ',\n'
    const source = '*Source* : ' + payload.source + ',\n'
    const styledPayload =
        title +
        errorCode +
        source
    axios.post(endpoint, { data: styledPayload })
}   