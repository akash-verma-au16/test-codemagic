import React from 'react';
import {
    StyleSheet,
    ScrollView,
    RefreshControl,
    BackHandler
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"
import Post from '../../components/Post/index'
/* Redux */
import { connect } from 'react-redux'
import { auth } from '../../store/actions'
import {
    Container,
    Toast
} from 'native-base';
/* Services */
import { strength_details } from '../../services/post'

//RBAC handler function
import { checkIfSessionExpired } from '../RBAC/RBAC_Handler'

//Prefetch profile data
import { loadProfile } from '../Home/apicalls'

class StrengthPosts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            newPostVisibility: false,
            postList: []
        }
        this.post = []
        this.postList = []
        this.scrollViewRef = React.createRef();
        this.scrollPosition = 0
        //Carry Profile Data
        this.profileData = {}
        this.counts = []
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('strengthType')
        }
    }
    //profile payload
    payload = {
        "tenant_id": this.props.accountAlias,
        "associate_id": this.props.associate_id
    }

    async componentDidMount() {
        //Detecting network connectivity change
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        //Handling hardware backpress event
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
        this.interval = setInterval(() => {
            this.loadPosts()
        }, 10000);

    }
    componentWillMount() {
        this.setState({ refreshing: true })
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        this.backHandler.remove()
    }

    handleConnectivityChange = async (isConnected) => {
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }
        if (isConnected) {
            this.loadPosts()
            this.profileData = await loadProfile(this.payload, headers, this.props.isConnected)
        }
    }
    getProfile = async () => {
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }
        this.profileData = await loadProfile(this.payload,headers, this.props.isConnected);
        if (this.profileData == undefined) {
            const isSessionExpired = checkIfSessionExpired(this.profileData, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
            if (!isSessionExpired) {
                this.getProfile()
                return
            }
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
            associate_id: this.props.associate_id,
            sub_type: this.props.navigation.getParam('strengthType')
        }

        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }
        if (payload.tenant_id !== "" && payload.associate_id !== "") {
            try {
                strength_details(payload,headers)
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
                    }).catch((error) => {
                        const isSessionExpired = checkIfSessionExpired(error.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                        if (!isSessionExpired) {
                            this.loadPosts()
                            return
                        }
                        this.setState({ refreshing: false })
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
    createTiles = async(posts) => {
        this.postList = []
        await posts.map(async (item) => {

            this.postList.push(
                // Post Component
                <Post
                    key={item.Item.post_id} 
                    postId={item.Item.post_id}
                    postSource = 'StrengthCount'
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
                setTimeout(() => this.setState({ refreshing: false, postList: this.postList}), 1500)
            }
        })
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
                    {this.state.postList}
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
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected,
        accessToken: state.user.accessToken
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        updateNewTokens: (props) => dispatch({ type: auth.REFRESH_TOKEN, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StrengthPosts)