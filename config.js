export default {
    url: {
        dev: "https://hr5qtryra8.execute-api.ap-southeast-1.amazonaws.com",
        devhw: "https://k8d1sxf4w7.execute-api.ap-southeast-1.amazonaws.com",
        questionBank: "https://mjangpdi2k.execute-api.ap-southeast-1.amazonaws.com",
        dataApi: "https://950x8h6806.execute-api.ap-southeast-1.amazonaws.com",
        rewards: "https://lb3kbimo6b.execute-api.ap-south-1.amazonaws.com"
    },
    api: {
        signup: "signup",
        confirm_signup: "confirm_signup",
        signin: "signin",
        resend_code: "resend_code",
        forgot_password: "forgot_password",
        confirm_password: "confirm_password",
        signout: "signout",
        read_tenant: "read_tenant",
        list_survey:"list_survey",
        read_survey:"read_survey",
        force_password_change: "force_password_change",
        save_answers:"save_answers",
        give_rewards:"give_rewards",
        read_member:"read_member"
    },
    type:{
        survey:"survey",
        data_apis:"data_apis",
        api:"api"
    },
    env: {
        dev: "dev",
        devhw: "devhw"
    },
    role: {
        super_admin: "super_admin",
        admin: "admin"
    }
}
