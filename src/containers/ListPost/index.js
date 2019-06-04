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
    ToastAndroid
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"
import AsyncStorage from '@react-native-community/async-storage';
import Post from '../../components/Post/index'

/* Redux */
import { connect } from 'react-redux'
import {user} from '../../store/actions'
import { file_download } from '../../services/profile'
import {
    Container,
    Icon,
    Toast,
    Thumbnail
} from 'native-base';
/* Services */
import { news_feed, delete_post, liked_post } from '../../services/post'
import { dev } from '../../store/actions'
//Loading Modal
import LoadingModal from '../LoadingModal'
//Prefetch profile data
import { loadProfile } from '../Home/apicalls'
/* Components */
import { NavigationEvents } from 'react-navigation';
import thumbnail from '../../assets/thumbnail.jpg'

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
                    <Thumbnail
                        source={{ uri: navigation.getParam('imageUrl')}}
                        style={{
                            height: '70%',
                            borderRadius: 50,
                            margin: 10
                        }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )
        };
    };
    
    /* Get image from S3 */
    handleImageDownload = () => {
        
        /* Request image*/
        const payload = {
            tenant_name: this.props.tenant_name + this.props.accountAlias,
            file_name: 'logo.png',
            associate_email: this.props.email
        }
        console.log("Payload", payload)
        file_download(payload).then((response) => {
            
            /* Store the image */
            console.log('image url',response.data.data['download-signed-url'])

            this.props.navigation.setParams({ 'imageUrl': response.data.data['download-signed-url']})
            this.props.imageUrl(response.data.data['download-signed-url'])
        }).catch((error) => {
            console.log(error)
        })
    }
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
            console.log('in app notification', notification);

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

    loadLikes = () =>{
        const payload = {
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id
        }
        try {
            liked_post(payload,this.headers).then((res) => {
                console.log("this.likes", this.likes)
                if(res.status == "success") {
                    this.likes = res.data
                    console.log("this.likes")
                }
            }).catch((e) => {
                console.log(e)
            })
        }
        catch(e) {
            console.log(e)
        }
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
         if(this.props.isAuthenticate) {
             this.props.navigation.setParams({ 'isConnected': this.props.isConnected, 'associateId': this.props.associate_id })
         }
         
         this.interval = setInterval(() => this.loadPosts(), 10000);
         //Detecting network connectivity change
         NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
         //Handling hardware backpress event
         this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
             this.goBack()
         })
         //  Loading profile
         this.props.navigation.setParams({'profileData': this.profileData})

     }

     componentWillUnmount() {
         clearInterval(this.interval)
         NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
         this.backHandler.remove()
     } 

    handleConnectivityChange = (isConnected) => {
        if(isConnected) {
            this.setState({
                networkChanged: true
            }, async () => {
                this.loadPosts()
                console.log('Data:', this.profileData)
                this.props.navigation.setParams({ 'profileData': this.profileData, 'isConnected': this.props.isConnected })
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
        const payload = {
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id
        }

        if (payload.tenant_id !== "" && payload.associate_id !== "") {
            try {
                console.log('Calling NEWS_FEED API')
                news_feed(payload, this.headers).then((response) => {
                    console.log("data", response.data.data)
                    /* take payload backup to check for changes later */
                    if (this.payloadBackup.length === response.data.data.posts.length) {
                        /* No change in payload hence do nothing */
                        console.log("log1")
                        this.setState({ refreshing: false, networkChanged: false })
                        
                        /* Checking if any data is available */
                        if (response.data.data.posts.length === 0) {
                            this.setState({initalLoad: true})
                            this.postList = []
                            /* Update state to render warning */
                            this.setState({ refreshing: false, networkChanged: false })
                            return
                        }

                    } else {
                        /* Change in payload */
                        if(this.state.initalLoad) {
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
                        // if (this.posts.length == 0 && !this.state.isPostDeleted) {
                        //     this.posts = []
                        //     this.posts = response.data.data.posts
                        // }

                        // /* Take Backup */
                        this.payloadBackup = response.data.data.posts
                        // if (this.posts.length !== response.data.data.posts.length) {
                        //     if (this.posts.length < response.data.data.posts.length && this.state.isPostDeleted) {
                        //         return 
                        //     }
                        // }
                        this.posts = []
                        this.posts = response.data.data.posts
                        this.posts.map((item) => {
                            this.counts = response.data.data.counts.filter((elm) => {
                                return elm.post_id == item.Item.post_id
                            })
                            item.Item.likeCount = this.counts[0].likeCount
                            item.Item.commentCount = this.counts[0].commentCount
                        })
                        this.postList = []
                        /* Create UI tiles to display */
                        this.createTiles(this.posts)
                    }
                }).catch((error) => {
                    this.setState({ refreshing: false, networkChanged: false })
                    console.log(error)
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

    //Edit Post
    editPost = (postId, postMessage) => {
        this.posts.map((post) => {
            if (post.Item.post_id == postId) {
                post.Item.message = postMessage 
            }
        })
        this.createTiles(this.posts)
    }

    //Delete Post
    deletePost = async(postId) => {
        console.log("Delete PostId", postId)
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

            var index = this.posts.findIndex((post) => {return post.Item.post_id == postId})
            console.log("Delete PostIndex", index)
            this.postList.splice(index, 1)
            this.posts.splice(index, 1)
            if(this.posts.length == 0) {
                this.setState({ initalLoad: true })
            }
            this.setState({ isPostDeleted: true })
            try {
                await delete_post(payload, this.headers).then((res) => {
                    if(res.status === 200) {
                        this.postList = []
                        this.createTiles(this.posts)
                        // this.loadPosts()
                        // this.setState({isPostDeleted: false})
                    }
                    console.log('delete_post', res)
                }).catch((e) => {
                    console.log(e)
                })
            }
            catch(e) {
                console.log(e)
            }
            // this.setState({isPostDeleted: false})

        }
        else {
            this.showToast()
        }
    }
    getProfile= async() => {
        console.log("loadProfile")
        this.profileData = await loadProfile(this.payload, this.headers, this.props.isConnected);
        this.props.navigation.setParams({ 'profileData': this.profileData })
        console.log("this.profileData.wallet_balance", this.profileData.wallet_balance)
        const payload = {
            walletBalance: this.profileData.wallet_balance
        }
        this.props.updateWallet(payload)  
    }

    createTiles = async(posts) => {
        this.getProfile()
        await posts.map((item, index) => {
            this.postList.push(
                // Post Component
                <Post
                    key={index}
                    postId={item.Item.post_id}
                    postCreator={this.props.associateList[item.Item.associate_id]}
                    postCreator_id={item.Item.associate_id}
                    profileData={item.Item.associate_id == this.props.associate_id ? this.profileData : {}}
                    time= {item.Item.time} 
                    postMessage={item.Item.message} 
                    taggedAssociates={item.Item.tagged_associates} 
                    strength={item.Item.sub_type} 
                    type={item.Item.type}
                    associate={item.Item.associate_id} 
                    likeCount={item.Item.likeCount}
                    commentCount={item.Item.commentCount} 
                    postDeleteHandler={this.deletePost}
                    editPostHandler={this.editPost}
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
                                this.props.navigation.setParams({ 'imageUrl': this.props.imagelink})
                                if (this.props.isConnected) {
                                    this.setState({ refreshing: true }, this.loadPosts())
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
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{ margin: 10 }} key={0}>No post to display</Text>
                            <Text style={{ margin: 10 }} key={1}>Create a new post by clicking on + icon</Text>
                        </View>)}
                </ScrollView>

                <NavigationEvents
                    onWillFocus={async () => {
                        if (this.props.isConnected) {
                            if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                this.props.navigation.setParams({ 'imageUrl': this.props.imagelink})
                                this.loadPosts()
                                this.getProfile()
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
        imagelink:state.user.imageUrl,
        tenant_name:state.user.tenant_name,
        email:state.user.emailAddress
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateWallet: (props) => dispatch({ type: dev.UPDATE_WALLET, payload: props }),
        imageUrl: (props) => dispatch({ type: user.UPDATE_IMAGE, payload: props })
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(withInAppNotification(ListPost))