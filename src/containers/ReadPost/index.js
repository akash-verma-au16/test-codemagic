import React from 'react';
import {
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
    BackHandler,
    View
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
import { read_post } from '../../services/post'

//RBAC handler function
import { checkIfSessionExpired } from '../RBAC/RBAC_Handler'

//Prefetch profile data
import { user_profile } from '../../services/profile'

import { refreshToken } from '../../services/bAuth'
import AsyncStorage from '@react-native-community/async-storage';

class ListPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: true,
            newPostVisibility: false,
            isConnected: this.props.isConnected,
            networkChanged: false,
            postList: []
        }
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
    static navigationOptions = () => {
        return {
            headerRight: (
                <View style={{ magin: 20 }}></View>
            )
        }
    }

    componentWillMount() {

        if (this.props.isFreshInstall) {
            this.props.navigation.navigate('TermsAndConditions')
            return
        } else if (!this.props.isAuthenticate) {
            this.props.navigation.navigate('LoginPage')
            return
        }

    }
    async componentDidMount() {
        if (this.props.isAuthenticate) {
            this.props.navigation.setParams({ 'isConnected': this.props.isConnected, 'associateId': this.props.associate_id })
        }

        //Detecting network connectivity change
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        //Handling hardware backpress event
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
        //  Loading profile
        this.props.navigation.setParams({ 'profileData': this.profileData })

    }

    componentWillUnmount() {
        clearInterval(this.interval)
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        this.backHandler.remove()
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
            }).catch((e) => {
                const isSessionExpired = checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                if (!isSessionExpired) {
                    this.getProfile()
                    return
                }
            })
        }
    }

    handleConnectivityChange = (isConnected) => {
        if (isConnected) {
            this.setState({
                networkChanged: true
            }, async () => {
                await this.updateRefreshToken()
            })
        }
    }

    updateRefreshToken = async () => {

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
                this.getProfile()
                this.loadPosts()

            }).catch(() => {})
        } else {
            this.getProfile()
            this.loadPosts()
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
        const read_post_payload = {
            tenant_id: this.props.accountAlias,
            post_id: this.postId
        }
        //Authorization headers
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }
        if (read_post_payload.tenant_id !== "" && read_post_payload.post_id !== "") {
            try {

                read_post(read_post_payload, headers)
                    .then(async (response) => {
                        const item = response.data.data.posts.Item
                        const commentCount = response.data.data.counts.commentCount
                        const likeCount = response.data.data.counts.likeCount
                        this.post = []

                        this.post.push(
                            // Post Component
                            <Post
                                key={item.post_id}
                                postId={item.post_id}
                                privacy={item.privacy}
                                postCreator_id={item.associate_id}
                                userName={item.associate_name}
                                profileData={item.associate_id == this.props.associate_id ? this.profileData : {}}
                                time={item.time}
                                type={item.type}
                                postMessage={item.message}
                                taggedAssociates={item.tagged_associates}
                                strength={item.sub_type}
                                associate={item.associate_id}
                                likeCount={likeCount}
                                commentCount={commentCount}
                                points={item.points}
                                postDeleteHandler={this.deletePost}
                                addOn={item.addOnPoints}
                            />
                        )
                        this.setState({ refreshing: false, networkChanged: false, postList: this.post })
                    }).catch((error) => {
                        const isSessionExpired = checkIfSessionExpired(error.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                        if (!isSessionExpired) {
                            this.loadPosts()
                            return
                        }
                        this.setState({ refreshing: false, networkChanged: false })
                        Toast.show({
                            text: 'This post is unavailable',
                            type: 'danger',
                            duration: 2000
                        })
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
        accessToken: state.user.accessToken,
        refreshTokenKey: state.user.refreshToken
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        updateNewTokens: (props) => dispatch({ type: auth.REFRESH_TOKEN, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPost)