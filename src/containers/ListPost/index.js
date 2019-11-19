import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Dimensions,
    BackHandler,
    ToastAndroid,
    ActivityIndicator,
    Alert
} from 'react-native';
//Prefetch Profile Data
import { user_profile } from '../../services/profile'

import { refreshToken } from '../../services/bAuth'
import NetInfo from "@react-native-community/netinfo"
import AsyncStorage from '@react-native-community/async-storage';
import Post from '../../components/Post/index'

/* Redux */
import { connect } from 'react-redux'
import { dev, user, auth } from '../../store/actions'
import {
    Container,
    Icon,
    Toast,
    Thumbnail
} from 'native-base';
/* Services */
import { news_feed, delete_post, liked_post } from '../../services/post'

// Config
import { feedbackDisplayCount } from '../../../config'
//Loading Modal
import LoadingModal from '../LoadingModal'
//RBAC handler function
import { checkIfSessionExpired } from '../RBAC/RBAC_Handler'
/* Components */
import { NavigationEvents } from 'react-navigation';

// push notification
import { withInAppNotification } from 'react-native-in-app-notification'
import PushNotification from '@aws-amplify/pushnotification'
import notificationIcon from '../../assets/Logo_High_black.png'

class ListPost extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            initialLoad: false,
            refreshing: true,
            newPostVisibility: false,
            isConnected: this.props.isConnected,
            networkChanged: false,
            isPostDeleted: false,
            isFocused: false,
            postList: []
        }
        this.likes = []
        this.posts = []
        this.postList = []
        this.taggedAssociate = []
        this.scrollViewRef = React.createRef();
        this.payloadBackup = []
        this.windowWidth = Dimensions.get("window").width;
        this.scrollPosition = 0
        //Carry Profile Data
        this.profileData = {}
        this.counts = []
    }

    static navigationOptions = ({ navigation }) => {
        return {

            headerRight: (
                <Icon name='md-notifications' style={
                    {
                        color: 'white',
                        margin: 20
                    }
                } onPress={() => navigation.navigate('InAppNotifier')} />
            ),
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {

                        navigation.navigate('Profile', {
                            associateId: navigation.getParam('associateId')
                        })

                    }}
                    style={{
                        marginLeft: 13, alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <View style={styles.navImageWrapper}>
                        {navigation.getParam('imageUrl') === '' ?
                            <ActivityIndicator
                                size='small'
                                color='#47309C'
                            />
                            :
                            <Thumbnail
                                source={{ uri: navigation.getParam('imageUrl') }}
                                style={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: 20
                                }}
                                resizeMode='cover'
                            />
                        }
                    </View>
                </TouchableOpacity>
            )
        };
    }

    loadLikes = () => {
        const payload = {
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id
        }
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }

        try {
            liked_post(payload, headers).then((res) => {
                if (res.status == "success") {
                    this.likes = res.data
                }
            }).catch((error) => {
                const isSessionExpired = checkIfSessionExpired(error.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                if (!isSessionExpired) {
                    this.loadLikes()
                    this.loadPosts()
                    this.getProfile()
                    return
                }
            })
        }
        catch (e) {/* error */ }
    }

    componentDidUpdate() {
        this.handlePushNotificationNavigation()
    }
    handlePushNotificationNavigation = async () => {
        /* for post */
        try {
            //Check if previous state exists
            const value = await AsyncStorage.getItem('pushNotificationNavigation');

            if (value) {
                // We have state!!
                AsyncStorage.removeItem('pushNotificationNavigation')
                this.props.navigation.navigate('ReadPost', { id: value })
            }

        } catch (error) {
            // Error retrieving data
        }
        /* for survey */
        try {
            //Check if previous state exists
            const value = await AsyncStorage.getItem('pushNotificationSurvey');

            if (value) {
                // We have state!!

                AsyncStorage.removeItem('pushNotificationSurvey')
                this.props.navigation.navigate('SurveyIntro', {
                    surveyId: value,
                    surveyName: 'Daily-Questionnaire',
                    surveyDescription: 'Daily Survey',
                    surveyNote: 'note',
                    surveyLevel: 'beginner'
                })
            }

        } catch (error) {
            // Error retrieving data
        }
    }

    goBack(isFocused) {
        if (isFocused) {
            Alert.alert(
                'Exit App?',
                'Are you sure you want to exit the app?',
                [
                    {
                        text: 'No',
                        style: 'cancel'
                    },
                    {
                        text: 'Yes', onPress: () => {
                            BackHandler.exitApp()
                        }
                    }
                ],
                { cancelable: false },
            )
        }
        return true
    }

    //Authorization headers
    headers = {
        headers: {
            Authorization: this.props.accessToken
        }
    }
    //profile payload
    payload = {
        "tenant_id": this.props.accountAlias,
        "associate_id": this.props.associate_id
    }

    async componentDidMount() {

        //Increment count to Display feedback alert
        this.props.incrementCount()
        this.props.navigation.setParams({ commingSoon: this.commingSoon });
        if (this.props.isFreshInstall) {
            this.props.navigation.navigate('TermsAndConditions')
            return
        } else if (!this.props.isAuthenticate) {
            this.props.navigation.navigate('LoginPage')
            return
        }
        PushNotification.onNotification((notification) => {
            // Note that the notification object structure is different from Android and IOS
            //Display notification
            this.props.showNotification({
                title: notification.title,
                message: notification.body,
                icon: notificationIcon,
                onPress: () => {
                    const url = notification.data['pinpoint.deeplink']
                    let data = ''
                    if (url)
                        data = url.split('/')
                    else
                        return
                    if (data[2] === 'endorsement') {
                        if (data[3])
                            this.props.navigation.navigate('ReadPost', { id: data[3] })
                    }
                    else if (data[2] == 'gratitude') {
                        if (data[3])
                            this.props.navigation.navigate('ReadPost', { id: data[3] })
                    }
                    else if (data[2] == 'survey') {
                        if (data[3])
                            this.props.navigation.navigate('SurveyIntro', {
                                surveyId: data[3],
                                surveyName: 'Daily-Questionnaire',
                                surveyDescription: 'Daily Survey',
                                surveyNote: 'note',
                                surveyLevel: 'beginner'
                            })
                    }
                }
            })
        })
        if (this.props.isAuthenticate) {
            this.props.navigation.setParams({ 'isConnected': this.props.isConnected, 'associateId': this.props.associate_id })
        }

        this.interval = setInterval(() => {
            if (!this.state.isPostDeleted) {
                this.loadPosts()
            }
        }, 10000);

        //Detecting network connectivity change
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        // Handling hardware backpress event
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.goBack(this.state.isFocused))

        //  Loading profile
        this.props.navigation.setParams({ 'profileData': this.profileData })

        this.gotoFeedbackPageAlert()
        await this.getProfile()
    }

    componentWillUnmount() {
        clearInterval(this.interval, this.interval1)
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        this.backHandler.remove()
    }

    handleConnectivityChange = (isConnected) => {
        if (isConnected) {
            this.setState({
                networkChanged: true
            }, async () => {
                this.props.navigation.setParams({ 'profileData': this.profileData, 'isConnected': true })
            })
        }
        else {
            this.props.navigation.setParams({ 'isConnected': false })
        }
    }

    newPostHandler = () => {

        /* Hide the Button */
        this.setState({ newPostVisibility: false })

        /* Scroll to top to point the latest post */
        this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })

    }

    scrollHandler = (event) => {
        this.scrollPosition = event.nativeEvent.contentOffset.y;
        if (this.scrollPosition <= 0) {
            this.setState({
                newPostVisibility: false
            });
            return
        }
    }

    showToast() {
        ToastAndroid.showWithGravityAndOffset(
            'Please, Connect to the internet',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            100,
        );
    }

    getProfile = async () => {
        if (this.props.isAuthenticate) {
            //Authorization headers 
            const headers = {
                headers: {
                    Authorization: this.props.accessToken
                }
            }
            //profile payload
            const profilePayload = {
                tenant_id: this.props.accountAlias,
                associate_id: this.props.associate_id
            }
            user_profile(profilePayload, headers).then((res) => {
                this.profileData = res.data.data
                const payload = {
                    walletBalance: this.profileData.wallet_balance
                }
                this.props.updateWallet(payload)
                this.props.navigation.setParams({ 'profileData': this.profileData })
            }).catch((e) => {
                const isSessionExpired = checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                if (!isSessionExpired) {
                    this.getProfile()
                    return
                }
            })
        }
    }

    //Loads news feed
    loadPosts = () => {
        if (this.props.isAuthenticate) {
            this.props.navigation.setParams({ 'imageUrl': this.props.imagelink, 'associateId': this.props.associate_id })
            const payload = {
                tenant_id: this.props.accountAlias,
                associate_id: this.props.associate_id
            }
            const headers = {
                headers: {
                    Authorization: this.props.accessToken
                }
            }

            if (payload.tenant_id !== "" && payload.associate_id !== "" && this.state.isFocused) {
                try {
                    news_feed(payload, headers).then((response) => {
                        /* take payload backup to check for changes later */
                        if (this.payloadBackup.length === response.data.data.posts.length) {
                            /* No change in payload hence do nothing */
                            this.setState({ refreshing: false, networkChanged: false })

                            /* Checking if any data is available */
                            if (response.data.data.posts.length === 0) {
                                /* Update state to render warning */
                                this.setState({ refreshing: false, networkChanged: false, initialLoad: true })
                                return
                            }

                            response.data.data.posts.map((item, index) => {
                                item.Item.likeCount = response.data.data.counts[index].likeCount
                                item.Item.commentCount = response.data.data.counts[index].commentCount
                                item.Item.addOnPoints = response.data.data.counts[index].addOnPoints

                            })
                            if (JSON.stringify(this.posts) !== JSON.stringify(response.data.data.posts)) {

                                this.posts = response.data.data.posts
                                this.createTiles(this.posts)
                            }
                            else {
                                this.setState({
                                    refreshing: false
                                })
                                return
                            }

                        } else {
                            if (this.state.initialLoad) {
                                this.setState({ initialLoad: false })
                            }
                            this.posts = response.data.data.posts
                            this.counts = response.data.data.counts
                            /* Change in payload */
                            if (this.postList.length !== 0) {

                                if (this.posts.length > this.payloadBackup.length && this.scrollPosition > 150) {
                                    /* Show th new post button */
                                    this.setState({ newPostVisibility: true })
                                }
                            }

                            this.posts.map((item, index) => {
                                item.Item.likeCount = this.counts[index].likeCount
                                item.Item.commentCount = this.counts[index].commentCount
                                item.Item.addOnPoints = this.counts[index].addOnPoints
                            })

                            // /* Take Backup */
                            this.payloadBackup = this.posts
                            /* Create UI tiles to display */
                            this.createTiles(this.posts)
                        }
                    }).catch((e) => {
                        const isSessionExpired = checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                        if (!isSessionExpired) {
                            this.loadPosts()
                            return
                        }
                        this.setState({ refreshing: false, networkChanged: false })
                    })
                }
                catch (error) {
                    Toast.show({
                        text: 'Something went wrong',
                        type: 'danger',
                        duration: 2000
                    })
                    this.setState({ refreshing: false, networkChanged: false })
                }
            }
        }
    }

    //Delete Post
    deletePost = async (postId) => {
        if (this.props.isConnected) {
            this.setState({ isPostDeleted: true })
            const payload = {
                Data: {
                    post_id: postId,
                    tenant_id: this.props.accountAlias,
                    ops: "delete_post",
                    associate_id: this.props.associate_id
                }
            }
            const headers = {
                headers: {
                    Authorization: this.props.accessToken
                }
            }
            try {
                await delete_post(payload, headers).then((res) => {
                    if (res.status === 200) {
                        var index = this.posts.findIndex((post) => { return post.Item.post_id == postId })
                        this.postList.splice(index, 1)
                        this.posts.splice(index, 1)
                        this.setState({ postList: this.postList })
                        setTimeout(() => this.setState({ isPostDeleted: false }), 2500)
                    }
                }).catch((error) => {
                    //Error deleting Post
                    const isSessionExpired = checkIfSessionExpired(error.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                    if (!isSessionExpired) {
                        this.deletePost(postId)
                        return
                    }
                    this.setState({ isPostDeleted: false })
                })
            }
            catch (e) {/* error */ }

        }
        else {
            this.showToast()
        }
    }

    gotoFeedbackPageAlert = () => {
        if (this.props.isAuthenticate) {
            if (this.props.feedbackCurrentCount % feedbackDisplayCount == 0) {
                Alert.alert(
                    'Loving HappyWorks?',
                    'Please share your experience!',
                    [
                        {
                            text: 'No',
                            style: 'cancel'
                        },
                        {
                            text: 'Yes', onPress: () => {
                                this.props.navigation.navigate('Feedback')
                            }
                        }
                    ],
                    { cancelable: false },
                )
            }
        }
    }

    createTiles = async (posts) => {
  
        this.postList = []
        await posts.map(async (item) => {

            this.postList.push(
                // Post Component
                <Post
                    key={item.Item.post_id}
                    postId={item.Item.post_id}
                    privacy={item.Item.privacy}
                    postCreator_id={item.Item.associate_id}
                    userName={item.Item.associate_name}
                    profileData={this.profileData}
                    time={item.Item.time}
                    postMessage={item.Item.message}
                    taggedAssociates={item.Item.tagged_associates}
                    strength={item.Item.sub_type}
                    type={item.Item.type}
                    associate={item.Item.associate_id}
                    likeCount={item.Item.likeCount}
                    commentCount={item.Item.commentCount}
                    postDeleteHandler={this.deletePost}
                    points={item.Item.points}
                    addOn={item.Item.addOnPoints}
                />
            )

            if (posts.length == this.postList.length) {
                setTimeout(() => this.setState({ refreshing: false, postList: this.postList }), 1500)
            }
        })
    }
    initializeAPIs = async () => {
        const payload = {
            refresh_token: this.props.refreshTokenKey,
            tenant_id: this.props.accountAlias
        }
        const tokenExp = await AsyncStorage.getItem('accessTokenExp')
        /* epoch time calculation */
        const dateTime = Date.now();
        const currentEpoc = Math.floor(dateTime / 1000);

        if (tokenExp < currentEpoc) {
            /* Token has expired */
            refreshToken(payload).then((res) => {
                this.props.updateNewTokens({ accessToken: res.data.payload.AccessToken })
                // store token expire time in the local storage
                AsyncStorage.setItem('accessTokenExp', JSON.stringify(res.data.payload.AccessTokenPayload.exp))
                this.loadLikes()
                this.loadPosts()
                this.getProfile()

            }).catch(() => { })
        } else {
            this.loadLikes()
            this.loadPosts()
            this.getProfile()
        }
    }
    render() {

        return (

            <Container style={{ backgroundColor: '#eee' }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing} //this.props.isConnected
                            onRefresh={() => {
                                /* Show loader when manual refresh is triggered */
                                this.props.navigation.setParams({ 'imageUrl': this.props.imagelink, 'associateId': this.props.associate_id })
                                if (this.props.isConnected) {
                                    this.setState({ refreshing: true }, () => this.loadPosts())
                                } else {
                                    this.setState({ refreshing: false }, () => {
                                        Toast.show({
                                            text: 'Please connect to the internet.',
                                            type: 'danger',
                                            duration: 2000
                                        })
                                        this.setState({ isSignInLoading: false })
                                    })
                                }
                            }}
                        />
                    }
                    contentContainerStyle={styles.container}
                    ref={this.scrollViewRef}
                    onScroll={(event) => { this.scrollHandler(event) }}
                >

                    {!this.state.initialLoad ? this.state.postList : (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ margin: 10 }} key={0}>No post to display</Text>
                            <Text style={{ margin: 10 }} key={1}>Create a new post by clicking on + icon</Text>
                        </View>)}
                </ScrollView>

                <NavigationEvents
                    onWillFocus={async () => {
                        await this.setState({ isFocused: this.props.navigation.isFocused() })
                        if (this.props.isConnected) {
                            if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                this.props.navigation.setParams({ 'imageUrl': this.props.imagelink, 'associateId': this.props.associate_id })

                                this.initializeAPIs()
                            }
                        }
                    }}
                    onWillBlur={async () => {
                        await this.setState({ isFocused: this.props.navigation.isFocused() })
                    }}
                />
                {this.state.newPostVisibility ?

                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            left: this.windowWidth / 2 - 50,
                            width: 100,
                            height: 50,
                            marginVertical: 10,
                            backgroundColor: '#47309C',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 100,
                            shadowOffset: { width: 5, height: 5 },
                            shadowColor: 'black',
                            shadowOpacity: 0.2,
                            elevation: 2
                        }}
                        onPress={this.newPostHandler}

                    >
                        <Text style={{ fontWeight: '500', color: '#fff', textAlign: 'center', flexWrap: 'wrap', width: 100 }}>New Post</Text>
                    </TouchableOpacity>
                    :
                    null
                }
                <LoadingModal
                    enabled={this.state.isPostDeleted}
                />
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#eee',
        paddingTop: 3
    },
    navImageWrapper: {
        backgroundColor: '#eee',
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected,
        accessToken: state.user.accessToken,
        imagelink: state.user.imageUrl,
        tenant_name: state.user.tenant_name,
        email: state.user.emailAddress,
        walletBalance: state.user.walletBalance,
        feedbackCurrentCount: state.user.feedbackDisplayCount,
        refreshTokenKey: state.user.refreshToken
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateWallet: (props) => dispatch({ type: dev.UPDATE_WALLET, payload: props }),
        imageUrl: (props) => dispatch({ type: user.UPDATE_IMAGE, payload: props }),
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        updateNewTokens: (props) => dispatch({ type: auth.REFRESH_TOKEN, payload: props }),
        incrementCount: () => dispatch({ type: user.UPDATE_FEEDBACK_DISPLAY_COUNT })
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(withInAppNotification(ListPost))