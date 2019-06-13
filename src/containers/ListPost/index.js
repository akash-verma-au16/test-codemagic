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
    ActivityIndicator
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"
import AsyncStorage from '@react-native-community/async-storage';
import Post from '../../components/Post/index'

/* Redux */
import { connect } from 'react-redux'
import { user } from '../../store/actions'
import {
    Container,
    Icon,
    Toast,
    Thumbnail
} from 'native-base';
/* Services */
import { news_feed, delete_post, liked_post, get_associate_name } from '../../services/post'
import { dev } from '../../store/actions'
//Loading Modal
import LoadingModal from '../LoadingModal'
//Prefetch profile data
import { loadProfile } from '../Home/apicalls'
/* Components */
import { NavigationEvents } from 'react-navigation';

// push notification
import { withInAppNotification } from 'react-native-in-app-notification'
import PushNotification from '@aws-amplify/pushnotification'
import notificationIcon from '../../assets/Logo_High_black.png'

class ListPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: true,
            newPostVisibility: false,
            isConnected: this.props.isConnected,
            networkChanged: false,
            isPostDeleted: false,
            initalLoad: false
        }
        this.loadLikes = this.loadLikes.bind(this)
        this.loadPosts = this.loadPosts.bind(this);
        this.getProfile = this.getProfile.bind(this)
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
                        if (navigation.getParam('isConnected')) {
                            const profileObj = navigation.getParam('profileData')
                            navigation.navigate('Profile', {
                                profileData: profileObj,
                                associateId: navigation.getParam('associateId')
                            })
                        }
                    }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 50
                    }}
                >
                    {navigation.getParam('imageUrl') === '' ?
                        <ActivityIndicator
                            size='small'
                            color='#fff'
                            style={{
                                borderRadius: 50,
                                margin: 20
                            }}
                        />
                        :
                        <Thumbnail
                            source={{ uri: navigation.getParam('imageUrl') }}
                            style={{
                                height: '70%',
                                borderRadius: 50,
                                margin: 10
                            }}
                            resizeMode='contain'
                        />
                    }

                </TouchableOpacity>
            )
        };
    };
    componentWillMount() {

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
        this.loadLikes()
    }

    loadLikes = () => {
        const payload = {
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id
        }
        try {
            liked_post(payload, this.headers).then((res) => {
                if (res.status == "success") {
                    this.likes = res.data
                }
            }).catch(() => {
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
    goBack() {
        return true
    }

    getAssociateNames = async () => {
        try {
            await get_associate_name({ tenant_id: this.props.accountAlias }).then((res) => {
                res.data.data.map((item) => {
                    // this.associateList[item.associate_id] = item.full_name
                    AsyncStorage.setItem(item.associate_id, item.full_name)
                })
            })
        }
        catch (e) {/* error */ }
    }

    //Authorization headers
    headers = {
        headers: {
            Authorization: this.props.idToken
        }
    }
    //profile payload
    payload = {
        "tenant_id": this.props.accountAlias,
        "associate_id": this.props.associate_id
    }
    async componentDidMount() {
        await this.getProfile()
        if (this.props.isAuthenticate) {
            this.props.navigation.setParams({ 'isConnected': this.props.isConnected, 'associateId': this.props.associate_id })
        }

        this.interval = setInterval(() => {
            this.loadPosts()
        }, 10000);

        this.interval1 = setInterval(() => {
            this.getAssociateNames()
        }, 9000);

        //Detecting network connectivity change
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        //Handling hardware backpress event
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack()
        })
        //  Loading profile
        this.props.navigation.setParams({ 'profileData': this.profileData, walletBalance: this.profileData.walletBalance })

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

    //Loads news feed
    loadPosts = () => {
        this.props.navigation.setParams({ 'imageUrl': this.props.imagelink })
        const payload = {
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id
        }

        if (payload.tenant_id !== "" && payload.associate_id !== "") {
            try {
                news_feed(payload, this.headers).then((response) => {
                    /* take payload backup to check for changes later */
                    if (this.payloadBackup.length === response.data.data.posts.length) {
                        /* No change in payload hence do nothing */
                        this.setState({ refreshing: false, networkChanged: false })

                        /* Checking if any data is available */
                        if (response.data.data.posts.length === 0) {
                            this.setState({ initalLoad: true })
                            this.postList = []
                            /* Update state to render warning */
                            this.setState({ refreshing: false, networkChanged: false })
                            return
                        }

                        response.data.data.posts.map((item, index) => {
                            item.Item.likeCount = response.data.data.counts[index].likeCount
                            item.Item.commentCount = response.data.data.counts[index].commentCount 
                            item.Item.addOnPoints = response.data.data.counts[index].addOnPoints

                        })
                        if (JSON.stringify(this.posts) !== JSON.stringify(response.data.data.posts)) { 

                            this.posts = response.data.data.posts
                            this.postList = []
                            this.createTiles(this.posts)
                        }
                        else {
                            this.setState({
                                refreshing: false
                            })
                            return
                        }

                    } else {
                        /* Change in payload */
                        if (this.state.initalLoad) {
                            this.setState({ initalLoad: false })
                        }
                        if (this.postList.length !== 0) {

                            if (this.scrollPosition > 150) {
                                /* Show th new post button */
                                this.setState({ newPostVisibility: true })
                            }
                        }
                        if (this.state.isPostDeleted) {
                            // this.setState({ isPostDeleted: false })
                            return
                        }

                        this.posts = []
                        this.posts = response.data.data.posts
                        this.counts = response.data.data.counts
                        this.posts.map((item, index) => {
                            item.Item.likeCount = this.counts[index].likeCount
                            item.Item.commentCount = this.counts[index].commentCount
                            item.Item.addOnPoints = this.counts[index].addOnPoints
                        })

                        // /* Take Backup */
                        this.payloadBackup = this.posts
                        this.postList = []
                        /* Create UI tiles to display */
                        this.createTiles(this.posts)
                    }
                }).catch(() => {
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

            var index = this.posts.findIndex((post) => { return post.Item.post_id == postId })
            this.postList.splice(index, 1)
            this.postList = []

            if (this.posts.length == 0) {
                this.setState({ initalLoad: true })
            }
            try {
                await delete_post(payload, this.headers).then((res) => {
                    if (res.status === 200) {
                        this.posts.splice(index, 1)
                        this.createTiles(this.posts)
                    }
                }).catch(() => {
                })
            }
            catch (e) {/* error */ }

        }
        else {
            this.showToast()
        }
    }
    getProfile = async () => {
        if (this.props.isAuthenticate) {
            //Authorization headers
            const headers = {
                headers: {
                    Authorization: this.props.idToken
                }
            }
            //profile payload
            const payload1 = {
                tenant_id: this.props.accountAlias,
                associate_id: this.props.associate_id
            }
            this.profileData = await loadProfile(payload1, headers, this.props.isConnected);
            const payload = {
                walletBalance: this.profileData.wallet_balance
            }
            this.props.updateWallet(payload)
            this.props.navigation.setParams({ 'profileData': this.profileData, walletBalance: this.props.walletBalance })
        }        
    }

    createTiles = async (posts) => {
        console.log('Creating tiles')
        this.getProfile()
        await posts.map(async (item) => {

            // Get tagged associate Names
            let associateList = []
            item.Item.tagged_associates.map(async (item) => {
                let name = await AsyncStorage.getItem(item.associate_id)
                associateList.push({
                    associate_id: item.associate_id,
                    associate_name: name
                })
            })
            this.postList.push(
                // Post Component
                <Post
                    key={item.Item.post_id}
                    postId={item.Item.post_id}
                    privacy={item.Item.privacy}
                    postCreator_id={item.Item.associate_id}
                    profileData={this.profileData}
                    time={item.Item.time}
                    postMessage={item.Item.message}
                    taggedAssociates={associateList}
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
        })
        this.setState({ refreshing: false, networkChanged: false, isPostDeleted: false })

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
                                this.props.navigation.setParams({ 'imageUrl': this.props.imagelink })
                                if (this.props.isConnected) {
                                    this.setState({ refreshing: true },()=> this.loadPosts())
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

                    {!this.state.initalLoad ? this.postList : (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ margin: 10 }} key={0}>No post to display</Text>
                            <Text style={{ margin: 10 }} key={1}>Create a new post by clicking on + icon</Text>
                        </View>)}
                </ScrollView>

                <NavigationEvents
                    onWillFocus={async () => {
                        if (this.props.isConnected) {
                            if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                this.props.navigation.setParams({ 'imageUrl': this.props.imagelink })
                                this.getProfile()
                                this.loadPosts()
                            }
                        }
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
                            backgroundColor: '#1c92c4',
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
    }
});

const mapStateToProps = (state) => {
    return {
        associateList: state.user.associateList,
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected,
        idToken: state.user.idToken,
        imagelink: state.user.imageUrl,
        tenant_name: state.user.tenant_name,
        email: state.user.emailAddress,
        walletBalance: state.user.walletBalance
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateWallet: (props) => dispatch({ type: dev.UPDATE_WALLET, payload: props }),
        imageUrl: (props) => dispatch({ type: user.UPDATE_IMAGE, payload: props })
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(withInAppNotification(ListPost))