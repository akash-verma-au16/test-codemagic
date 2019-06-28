export default {
    url: {
        dev: "https://dk6s3qlklh.execute-api.ap-south-1.amazonaws.com",
        create_post:"https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/create_post",
        get_visibility: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/get_visibility",
        news_feed:"https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/news_feed",
        list_survey:"https://yqigt6qajl.execute-api.ap-south-1.amazonaws.com/dev/survey/list_survey",
        give_reward:"https://n6dpuxecyh.execute-api.ap-south-1.amazonaws.com/api/give_reward",
        inapp_notification: "https://75cvygmh71.execute-api.ap-south-1.amazonaws.com/api/list_inapp",
        read_transaction: "https://n6dpuxecyh.execute-api.ap-south-1.amazonaws.com/api/read_transactions",
        get_balance: "https://n6dpuxecyh.execute-api.ap-south-1.amazonaws.com/api/get_balance",
        user_profile: "https://yp1g6l4ywd.execute-api.ap-south-1.amazonaws.com/api/get_profile",
        list_posts: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/list_posts",
        strength_counts: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/strength_count",
        update_profile: "https://yp1g6l4ywd.execute-api.ap-south-1.amazonaws.com/api/update_profile",
        list_associates: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/list_associates",
        list_project_members: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/list_project_members",
        comment_post: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/comment_post",
        like_post: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/like_post",
        unlike_post: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/unlike_post",
        list_likes: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/list_likes",
        like_id: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/like_id",
        file_download: "https://gid6eh4y79.execute-api.ap-south-1.amazonaws.com/api/file_download",
        file_upload: "https://gid6eh4y79.execute-api.ap-south-1.amazonaws.com/api/file_upload",
        list_comments: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/list_comments",
        edit_comment: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/edit_comment",
        delete_comment: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/delete_comment",
        read_tenant: "https://p2prrzyo83.execute-api.ap-south-1.amazonaws.com/dev/super_admin/read_tenant",
        delete_post: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/delete_post",
        edit_post: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/edit_post",
        edit_post_addon:"https://n6dpuxecyh.execute-api.ap-south-1.amazonaws.com/api/share_addon",
        new_associate_notify:"https://75cvygmh71.execute-api.ap-south-1.amazonaws.com/api/notify",
        read_posts: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/read_posts",
        get_associate_name: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/get_associate_name",
        strength_details: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/strength_details",
        
        liked_post: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/liked_post",
        rewards_addon: "https://n6dpuxecyh.execute-api.ap-south-1.amazonaws.com/api/share_addon"
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
        read_survey:"https://yqigt6qajl.execute-api.ap-south-1.amazonaws.com/dev/survey/read_survey",
        force_password_change: "force_password_change",
        save_answers:"https://ieiyaqol00.execute-api.ap-south-1.amazonaws.com/dev/data_apis/save_answers",
        give_rewards:"give_rewards",
        read_member:"https://p2prrzyo83.execute-api.ap-south-1.amazonaws.com/dev/admin/read_member",
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

// Changed Endpoints 23/05
// https://0n3dfqk7t5.execute-api.ap-southeast-1.amazonaws.com/dev/posts/create_post
// news_feed: "https://gp4itpb287.execute-api.ap-southeast-1.amazonaws.com/dev/post/news_feed"
// strength_counts: "https://gp4itpb287.execute-api.ap-southeast-1.amazonaws.com/dev/post/strength_count"
// list_posts: "https://gp4itpb287.execute-api.ap-southeast-1.amazonaws.com/dev/post/list_posts"
// get_visibility: "https://gp4itpb287.execute-api.ap-southeast-1.amazonaws.com/dev/post/get_visibility"

//Reward nasic URL
// https://835zntrqv6.execute-api.ap-southeast-1.amazonaws.com/api

// Changed Endpoints 28/05
// create_post: "https://0n3dfqk7t5.execute-api.ap-southeast-1.amazonaws.com/dev/posts/create_post"
// list_posts: "https://i91oxrurli.execute-api.ap-southeast-1.amazonaws.com/dev/post/list_posts"
// news_feed: "https://i91oxrurli.execute-api.ap-southeast-1.amazonaws.com/dev/post/news_feed"
// strength_counts: "https://i91oxrurli.execute-api.ap-southeast-1.amazonaws.com/dev/post/strength_count"