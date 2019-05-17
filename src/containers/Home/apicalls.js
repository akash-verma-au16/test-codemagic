import { user_profile } from '../../services/profile'

//Load user profile API Handler
export const loadProfile = (payload, isConnected) => {
    try {
        if (payload.tenant_id !== "" && payload.associate_id !== "" && isConnected) {
            console.log("Calling user_profile")
            user_profile(payload).then((response) => {
                console.log("Profile Data",response.data.data)
                return response.data.data
            }).catch((error) => {
                console.log(error)
            })
        }
    }
    catch (error) {
        // this.setState({ loading: false })
        console.log("error", error.code)
    }
    // this.setState({loading: true})
}