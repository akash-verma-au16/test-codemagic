
export const feedbackDisplayCount = 5;

const dev_env = {
    url: {
        dev: "https://dk6s3qlklh.execute-api.ap-south-1.amazonaws.com",
        create_post: "https://g40atwad8a.execute-api.ap-south-1.amazonaws.com/dev/post/create_post",
        get_visibility: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/get_visibility",
        news_feed: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/news_feed",
        list_survey: "https://yqigt6qajl.execute-api.ap-south-1.amazonaws.com/dev/survey/list_survey",
        give_reward: "https://n6dpuxecyh.execute-api.ap-south-1.amazonaws.com/dev/reward/give_reward",
        inapp_notification: "https://vpq6fn4pgh.execute-api.ap-south-1.amazonaws.com/dev/push_notification/list_in_app",
        read_transaction: "https://n6dpuxecyh.execute-api.ap-south-1.amazonaws.com/dev/reward/read_transactions",
        get_balance: "https://n6dpuxecyh.execute-api.ap-south-1.amazonaws.com/dev/reward/get_balance",
        user_profile: "https://yp1g6l4ywd.execute-api.ap-south-1.amazonaws.com/dev/user_profile/get_profile",
        list_posts: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/list_posts",
        strength_counts: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/strength_count",
        update_profile: "https://yp1g6l4ywd.execute-api.ap-south-1.amazonaws.com/dev/user_profile/update_profile",
        list_associates: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/list_associates",
        list_project_members: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/list_project_members",
        comment_post: "https://g40atwad8a.execute-api.ap-south-1.amazonaws.com/dev/post/comment_post",
        like_post: "https://g40atwad8a.execute-api.ap-south-1.amazonaws.com/dev/post/like_post",
        unlike_post: "https://g40atwad8a.execute-api.ap-south-1.amazonaws.com/dev/post/unlike_post",
        list_likes: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/list_likes",
        like_id: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/like_id",
        file_download: "https://gid6eh4y79.execute-api.ap-south-1.amazonaws.com/dev/aws_ops/file_download",
        file_upload: "https://gid6eh4y79.execute-api.ap-south-1.amazonaws.com/dev/aws_ops/file_upload",
        list_comments: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/list_comments",
        edit_comment: "https://g40atwad8a.execute-api.ap-south-1.amazonaws.com/dev/post/edit_comment",
        delete_comment: "https://g40atwad8a.execute-api.ap-south-1.amazonaws.com/dev/post/delete_comment",
        read_tenant: "https://p2prrzyo83.execute-api.ap-south-1.amazonaws.com/dev/super_admin/read_tenant",
        delete_post: "https://g40atwad8a.execute-api.ap-south-1.amazonaws.com/dev/post/delete_post",
        edit_post: "https://g40atwad8a.execute-api.ap-south-1.amazonaws.com/dev/post/edit_post",
        edit_post_addon: "https://n6dpuxecyh.execute-api.ap-south-1.amazonaws.com/dev/reward/share_addon",
        new_associate_notify: "https://75cvygmh71.execute-api.ap-south-1.amazonaws.com/dev/push_notify/notify_event",
        read_posts: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/read_posts",
        get_associate_name: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/get_associate_name",
        strength_details: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/strength_details",
        liked_post: "https://exf3yfki13.execute-api.ap-south-1.amazonaws.com/dev/post/liked_post",
        rewards_addon: "https://n6dpuxecyh.execute-api.ap-south-1.amazonaws.com/dev/reward/share_addon",
        register_device: 'https://vpq6fn4pgh.execute-api.ap-south-1.amazonaws.com/dev/push_notification/register_device',
        unregister: 'https://vpq6fn4pgh.execute-api.ap-south-1.amazonaws.com/dev/push_notification/unregister_device',
        get_status: 'https://vpq6fn4pgh.execute-api.ap-south-1.amazonaws.com/dev/push_notification/get_status',
        enable_status: 'https://vpq6fn4pgh.execute-api.ap-south-1.amazonaws.com/dev/push_notification/enable_status',
        disable_status: 'https://vpq6fn4pgh.execute-api.ap-south-1.amazonaws.com/dev/push_notification/disable_status',
        refresh_token: "https://dk6s3qlklh.execute-api.ap-south-1.amazonaws.com/dev/refresh_token"
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
        list_survey: "list_survey",
        read_survey: "https://yqigt6qajl.execute-api.ap-south-1.amazonaws.com/dev/survey/read_survey",
        force_password_change: "force_password_change",
        save_answers: "https://ieiyaqol00.execute-api.ap-south-1.amazonaws.com/dev/data_apis/save_answers",
        give_rewards: "give_rewards",
        read_member: "https://p2prrzyo83.execute-api.ap-south-1.amazonaws.com/dev/admin/read_member",
        create_post: "create_post",
        list_posts: "list_posts",
        list_associate: "list_associate",
        register_device: "register_device"
    },
    type: {
        survey: "survey",
        data_apis: "data_apis",
        api: "api",
        post: "post"
    },
    env: {
        dev: "dev",
        devhw: "devhw",
        qa: "qa"
    },
    role: {
        super_admin: "super_admin",
        admin: "admin"
    }
}

const qa_env = {
    url: {
        dev: "https://htzgm6e757.execute-api.ap-south-1.amazonaws.com",
        create_post: "https://6iwbpat27k.execute-api.ap-south-1.amazonaws.com/qa/post/create_post",
        get_visibility: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/get_visibility",
        news_feed: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/news_feed",
        list_survey: "https://9mde2akfwf.execute-api.ap-south-1.amazonaws.com/qa/survey/list_survey",
        give_reward: "https://5950v28o48.execute-api.ap-south-1.amazonaws.com/qa/reward/give_reward",
        inapp_notification: "https://0f6986pual.execute-api.ap-south-1.amazonaws.com/qa/push_notification/list_in_app",
        read_transaction: "https://5950v28o48.execute-api.ap-south-1.amazonaws.com/qa/reward/read_transactions",
        get_balance: "https://5950v28o48.execute-api.ap-south-1.amazonaws.com/qa/reward/get_balance",
        user_profile: "https://ye1o32nua6.execute-api.ap-south-1.amazonaws.com/qa/user_profile/get_profile",
        list_posts: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/list_posts",
        strength_counts: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/strength_count",
        update_profile: "https://ye1o32nua6.execute-api.ap-south-1.amazonaws.com/qa/user_profile/update_profile",
        list_associates: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/list_associates",
        list_project_members: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/list_project_members",
        comment_post: "https://6iwbpat27k.execute-api.ap-south-1.amazonaws.com/qa/post/comment_post",
        like_post: "https://6iwbpat27k.execute-api.ap-south-1.amazonaws.com/qa/post/like_post",
        unlike_post: "https://6iwbpat27k.execute-api.ap-south-1.amazonaws.com/qa/post/unlike_post",
        list_likes: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/list_likes",
        like_id: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/like_id",
        file_download: "https://8929l0rn5c.execute-api.ap-south-1.amazonaws.com/qa/aws_ops/file_download",
        file_upload: "https://8929l0rn5c.execute-api.ap-south-1.amazonaws.com/qa/aws_ops/file_upload",
        list_comments: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/list_comments",
        edit_comment: "https://6iwbpat27k.execute-api.ap-south-1.amazonaws.com/qa/post/edit_comment",
        delete_comment: "https://6iwbpat27k.execute-api.ap-south-1.amazonaws.com/qa/post/delete_comment",
        read_tenant: "https://kgr1mcpif2.execute-api.ap-south-1.amazonaws.com/qa/super_admin/read_tenant",
        delete_post: "https://6iwbpat27k.execute-api.ap-south-1.amazonaws.com/qa/post/delete_post",
        edit_post: "https://6iwbpat27k.execute-api.ap-south-1.amazonaws.com/qa/post/edit_post",
        edit_post_addon: "https://5950v28o48.execute-api.ap-south-1.amazonaws.com/qa/reward/share_addon",
        new_associate_notify: "https://2vx1jl8rv4.execute-api.ap-south-1.amazonaws.com/qa/push_notify/notify_event",
        read_posts: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/read_posts",
        get_associate_name: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/get_associate_name",
        strength_details: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/strength_details",
        liked_post: "https://kruibpi4m0.execute-api.ap-south-1.amazonaws.com/qa/post/liked_post",
        rewards_addon: "https://5950v28o48.execute-api.ap-south-1.amazonaws.com/qa/reward/share_addon",
        register_device: 'https://0f6986pual.execute-api.ap-south-1.amazonaws.com/qa/push_notification/register_device',
        unregister: 'https://0f6986pual.execute-api.ap-south-1.amazonaws.com/qa/push_notification/unregister',
        get_status: 'https://0f6986pual.execute-api.ap-south-1.amazonaws.com/qa/push_notification/get_status',
        enable_status: 'https://0f6986pual.execute-api.ap-south-1.amazonaws.com/qa/push_notification/enable_status',
        disable_status: 'https://0f6986pual.execute-api.ap-south-1.amazonaws.com/qa/push_notification/disable_status',
        refresh_token: 'https://htzgm6e757.execute-api.ap-south-1.amazonaws.com/qa/refresh_token'
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
        list_survey: "list_survey",
        read_survey: "https://9mde2akfwf.execute-api.ap-south-1.amazonaws.com/qa/survey/read_survey",
        force_password_change: "force_password_change",
        save_answers: "https://7mih3pbw19.execute-api.ap-south-1.amazonaws.com/qa/data_apis/save_answers",
        give_rewards: "give_rewards",
        read_member: "https://kgr1mcpif2.execute-api.ap-south-1.amazonaws.com/qa/admin/read_member",
        create_post: "create_post",
        list_posts: "list_posts",
        list_associate: "list_associate",
        register_device: "register_device"
    },
    type: {
        survey: "survey",
        data_apis: "data_apis",
        api: "api",
        post: "post"
    },
    env: {
        dev: "qa",
        devhw: "devhw",
        qa: "qa"
    },
    role: {
        super_admin: "super_admin",
        admin: "admin"
    }
}

let current_env = dev_env

export default current_env
