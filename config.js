export default {
    url: {
        dev: "https://hr5qtryra8.execute-api.ap-southeast-1.amazonaws.com",
        devhw: "https://k8d1sxf4w7.execute-api.ap-southeast-1.amazonaws.com",
        questionBank: "https://mjangpdi2k.execute-api.ap-southeast-1.amazonaws.com",
        dataApi: "https://950x8h6806.execute-api.ap-southeast-1.amazonaws.com",
        rewards: "https://lb3kbimo6b.execute-api.ap-south-1.amazonaws.com",
        post: "https://ueb6oyqxnf.execute-api.ap-southeast-1.amazonaws.com",
        push:"https://flnuddep8j.execute-api.ap-southeast-1.amazonaws.com",
        create_post:"https://0n3dfqk7t5.execute-api.ap-southeast-1.amazonaws.com/dev/posts/create-post",
        get_visibility: "https://gp4itpb287.execute-api.ap-southeast-1.amazonaws.com/dev/post/get_visibility",
        news_feed:"https://gp4itpb287.execute-api.ap-southeast-1.amazonaws.com/dev/post/news_feed",
        list_survey:"https://mjangpdi2k.execute-api.ap-southeast-1.amazonaws.com/dev/survey/list_survey",
        give_reward:"https://lb3kbimo6b.execute-api.ap-south-1.amazonaws.com/api/give_reward",
        inapp_notification: "https://flnuddep8j.execute-api.ap-southeast-1.amazonaws.com/api/list_inapp_notif",
        read_transaction: "https://835zntrqv6.execute-api.ap-southeast-1.amazonaws.com/api/read_transactions",
        get_balance: "https://lb3kbimo6b.execute-api.ap-south-1.amazonaws.com/api/get_balance",
        user_profile: "https://42afo3tdyc.execute-api.ap-southeast-1.amazonaws.com/api/get_profile",
        list_posts: "https://gp4itpb287.execute-api.ap-southeast-1.amazonaws.com/dev/post/list_posts",
        strength_counts: "https://gp4itpb287.execute-api.ap-southeast-1.amazonaws.com/dev/post/strength_count",
        update_profile: "https://42afo3tdyc.execute-api.ap-southeast-1.amazonaws.com/api/update_profile"
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
        read_member:"read_member",
        create_post:"create_post",
        list_posts:"list_posts",
        list_associate:"list_associate",
        register_device:"register_device"
    },
    type:{
        survey:"survey",
        data_apis:"data_apis",
        api:"api",
        post:"post"
    },
    env: {
        dev: "dev",
        devhw: "devhw",
        qa:"qa"
    },
    role: {
        super_admin: "super_admin",
        admin: "admin"
    }
}

// Previously used URLs (Release 1.8)
// create_post: "https://bgi3nogyc8.execute-api.ap-southeast-1.amazonaws.com/dev/kinesis"
// news_feed: "https://wzis5oap66.execute-api.ap-southeast-1.amazonaws.com/dev/post/news_feed"
// get_visibility: "https://wzis5oap66.execute-api.ap-southeast-1.amazonaws.com/dev/post/get_visibility"
// post: "https://ueb6oyqxnf.execute-api.ap-southeast-1.amazonaws.com

// Added
// list_posts: "https://uhj5dficb2.execute-api.ap-southeast-1.amazonaws.com/dev/post/list_posts"

// Changed endpoints 17/05
// list_posts
// strength_counts: "https://0xso4c76y7.execute-api.ap-southeast-1.amazonaws.com/api/strength_counts"
// get_visibility: "https://uhj5dficb2.execute-api.ap-southeast-1.amazonaws.com/dev/post/get_visibility" 
// create_post:"https://ipbi7go0f8.execute-api.ap-southeast-1.amazonaws.com/dev/posts/create-post" 
// user_profile: "https://0xso4c76y7.execute-api.ap-southeast-1.amazonaws.com/api/user_profile"
//  update_profile: "https://0xso4c76y7.execute-api.ap-southeast-1.amazonaws.com/api/update_profile"
