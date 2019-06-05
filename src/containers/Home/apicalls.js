import { user_profile } from '../../services/profile'

//Load user profile API Handler
var profileData = {}
export async function loadProfile(payload, headers, isConnected) {
    try {
        if (payload.tenant_id !== "" && payload.associate_id !== "" && isConnected) {
            return await user_profile(payload, headers).then((response) => {
                profileData = response.data.data
                return profileData

            }).catch(() => {
                return undefined
            })
        }
    }
    catch (error) {
        // this.setState({ loading: false })
        return undefined
    }
    // this.setState({loading: true})
}