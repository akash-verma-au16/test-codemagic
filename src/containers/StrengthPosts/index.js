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
import { strength_details } from '../../services/post'

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

class StrengthPosts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            newPostVisibility: false
        }
        this.loadPosts = this.loadPosts.bind(this);
        this.post = []
        this.postList = []
        this.scrollViewRef = React.createRef();
        this.scrollPosition = 0
        //Carry Profile Data
        this.profileData = {}
        this.counts = [],
        this.associateList = this.props.associateList
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('strengthType')
        }
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
        this.loadPosts()
        //Detecting network connectivity change
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        //Handling hardware backpress event
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })

    }
    componentWillMount() {
        this.setState({refreshing: true})
    }

    componentWillUnmount() {

        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        this.backHandler.remove()
    }

    handleConnectivityChange = async(isConnected) => {
        if (isConnected) {
            this.loadPosts()
            this.profileData = await loadProfile(this.payload, this.headers, this.props.isConnected)
        }
    }
    getProfile = async () => {
        this.profileData = await loadProfile(this.payload, this.headers, this.props.isConnected);
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
            associate_id: this.props.associate_id,
            sub_type: this.props.navigation.getParam('strengthType')
        }
        if (payload.tenant_id !== "" && payload.associate_id !== "") {
            try {
                strength_details(payload, this.headers)
                    .then((response) => {
                        this.posts = []
                        this.counts = []
                        this.posts = response.data.data.posts 
                        this.counts = response.data.data.counts
                        this.posts.map((item, index) => {
                            item.Item.likeCount = this.counts[index].likeCount
                            item.Item.commentCount = this.counts[index].commentCount 
                            item.Item.addOnPoints = this.counts[index].addOnPoints
                        })
                        this.createTiles(this.posts)
                    }).catch(() => {
                        this.setState({ refreshing: false})
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
    createTiles = (posts) => {
        this.postList = []
        posts.map((item) => {
            this.postList.push(
                // Post Component
                <Post
                    key={item.Item.post_id} 
                    postSource = 'StrengthCount'
                    postId={item.Item.post_id}
                    postCreator={this.associateList[item.Item.associate_id]}
                    postCreator_id={item.Item.associate_id}
                    profileData={item.Item.associate_id == this.props.associate_id ? this.profileData : {}}
                    time={item.Item.time}
                    postMessage={item.Item.message}
                    taggedAssociates={item.Item.tagged_associates}
                    strength={item.Item.sub_type}
                    associate={item.Item.associate_id}
                    likeCount={item.Item.likeCount}
                    commentCount={item.Item.commentCount} 
                    points={item.Item.points} 
                    addOn={item.Item.addOnPoints}
                />
            )
        })
        this.setState({ refreshing: false})
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

                    {this.postList}
                </ScrollView>
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

export default connect(mapStateToProps, null)(StrengthPosts)