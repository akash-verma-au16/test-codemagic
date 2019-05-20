import { user_profile } from '../../services/profile'

//Load user profile API Handler
var profileData = {}
export async function loadProfile(payload, isConnected) {
    try {
        if (payload.tenant_id !== "" && payload.associate_id !== "" && isConnected) {
            console.log("Calling user_profile")
            return await user_profile(payload).then((response) => {
                // console.log("Profile Data",response.data.data)
                profileData = response.data.data
                console.log("Profile Data",profileData)
                return profileData

            }).catch((error) => {
                console.log(error)
                return undefined
            })
        }
    }
    catch (error) {
        // this.setState({ loading: false })
        console.log("error", error.code)
        return undefined
    }
    // this.setState({loading: true})
}