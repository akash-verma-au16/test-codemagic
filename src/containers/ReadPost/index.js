import React from 'react';
import {
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
    BackHandler
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"
import AsyncStorage from '@react-native-community/async-storage';
import Post from '../../components/Post/index'
/* Redux */
import { connect } from 'react-redux'
import {
    Container,
    Toast
} from 'native-base';
/* Services */
import {  read_post } from '../../services/post'

//Prefetch profile data
import { loadProfile } from '../Home/apicalls'
/* Components */
import { NavigationEvents } from 'react-navigation';
// push notification
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import PushNotification from '@aws-amplify/pushnotification';
import awsconfig from '../../../aws-exports';

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
// send analytics events to Amazon Pinpoint
Analytics.configure(awsconfig);
// configure push notification
PushNotification.configure(awsconfig);

class ListPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: true,
            newPostVisibility: false,
            isConnected: this.props.isConnected,
            networkChanged: false
        }
        this.loadPosts = this.loadPosts.bind(this);
        this.postList = [],
        this.post = []
        this.taggedAssociate = [],
        this.scrollViewRef = React.createRef();
        this.payloadBackup = []
        this.windowWidth = Dimensions.get("window").width;
        this.scrollPosition = 0
        //Carry Profile Data
        this.profileData = {}
        this.counts = []
        this.postId = this.props.navigation.getParam('id')
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
        if (this.props.isAuthenticate) {
            this.props.navigation.setParams({ 'isConnected': this.props.isConnected, 'associateId': this.props.associate_id })
        }

        //Detecting network connectivity change
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        //Handling hardware backpress event
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack()
        })
        //  Loading profile
        this.props.navigation.setParams({ 'profileData': this.profileData })

    }

    componentWillUnmount() {
        clearInterval(this.interval)
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        this.backHandler.remove()
    }

    handleConnectivityChange = (isConnected) => {
        if (isConnected) {
            this.setState({
                networkChanged: true
            }, async () => {
                this.loadPosts()
                this.profileData = await loadProfile(this.payload, this.headers, this.props.isConnected)
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

    //Loads news feed
    loadPosts = () => {
        const payload = {
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id
        }

        const read_post_payload = {
            tenant_id: this.props.accountAlias,
            post_id: this.postId
        }
        if (payload.tenant_id !== "" && payload.associate_id !== "") {
            try {
                
                read_post(read_post_payload, this.headers)
                    .then((response) => {
                        this.setState({ refreshing: false, networkChanged: false })
                        const item = response.data.data.posts.Item
                        const commentCount = response.data.data.counts.commentCount
                        const likeCount = response.data.data.counts.likeCount
                        console.log('Read Post:', response.data.data)
                        this.post=[]
                        this.post.push(
                            // Post Component
                            <Post
                                key={0}
                                postId={item.post_id}
                                postCreator={item.associate_name}
                                postCreator_id={item.associate_id}
                                profileData={item.associate_id == this.props.associate_id ? this.profileData : {}}
                                time= {item.time} 
                                postMessage={item.message} 
                                taggedAssociates={item.tagged_associates} 
                                strength={item.sub_type} 
                                associate={item.associate_id} 
                                likeCount={likeCount}
                                commentCount={commentCount}
                            />
                        )
                        
                    }).catch(() => {
                        this.setState({ refreshing: false, networkChanged: false })
                        alert('Invalid post')
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
    createTiles = async (posts) => {
        // this.setState({ refreshing: true })
        this.postList = []
        this.profileData = await loadProfile(this.payload, this.headers, this.props.isConnected);
        // this.props.update_wallet()
        posts.map((item, index) => {
            this.postList.push(
                // Post Component
                <Post
                    key={index}
                    postId={item.Item.post_id}
                    postCreator={this.props.associateList[item.Item.associate_id]}
                    postCreator_id={item.Item.associate_id}
                    profileData={item.Item.associate_id == this.props.associate_id ? this.profileData : {}}
                    time={item.Item.time}
                    postMessage={item.Item.message}
                    taggedAssociates={item.Item.tagged_associates}
                    strength={item.Item.sub_type}
                    associate={item.Item.associate_id}
                    likeCount={item.Item.likeCount}
                    commentCount={item.Item.commentCount}
                />
            )
        })
        this.setState({ refreshing: false, networkChanged: false })
    }
    render() {

        return (

            <Container style={{ backgroundColor: '#eee' }}>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing || this.state.networkChanged} //this.props.isConnected
                            onRefresh={() => {
                                /* Show loader when manual refresh is triggered */
                                if (this.props.isConnected) {
                                    this.setState({ refreshing: true }, this.loadPosts())
                                } else {
                                    this.setState({ refreshing: false, networkChanged: false }, () => {
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

                    {this.post}
                </ScrollView>

                <NavigationEvents
                    onWillFocus={async () => {
                        if (this.props.isConnected) {
                            if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                this.loadPosts()
                            }
                        }
                    }}
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
        idToken: state.user.idToken
    };
}

export default connect(mapStateToProps, null)(ListPost)