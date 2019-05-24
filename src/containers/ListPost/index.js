import React from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Dimensions,
    BackHandler
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"

import Post from '../../components/Post/index'
/* Redux */
import { connect } from 'react-redux'
import {
    Container,
    Icon,
    Toast,
    Thumbnail
} from 'native-base';
/* Services */
import { news_feed } from '../../services/post'

//Prefetch profile data
import { loadProfile } from '../Home/apicalls' 
/* Components */
import { NavigationEvents } from 'react-navigation';
import thumbnail from '../../assets/thumbnail.jpg'

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
        this.taggedAssociate = [],
        this.scrollViewRef = React.createRef();
        this.payloadBackup = []
        this.windowWidth = Dimensions.get("window").width;
        this.scrollPosition = 0
        //Carry Profile Data
        this.profileData = {}
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
                >
                    <Thumbnail
                        source={thumbnail}

                        style={styles.thumbnail}
                        resizeMode='contain'
                    />
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
             this.profileData = await loadProfile(this.payload, this.headers, this.props.isConnected);
             this.props.navigation.setParams({ 'isConnected': this.props.isConnected, 'associateId': this.props.associate_id })
         }
         
         this.interval = setInterval(() => {this.loadPosts()}, 10000);
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

    handleConnectivityChange =  (isConnected) => {
        if(isConnected) {
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
            this.props.navigation.setParams({'isConnected': false })
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
        if(this.scrollPosition <= 0) {
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
        
        if (payload.tenant_id !== "" && payload.associate_id !=="") {
            console.log('calling ListPost')
            try {
                console.log('Calling NEWS_FEED API')
                news_feed(payload, this.headers).then(async(response) => {
                    // console.log("Data", response.data.data)
                    /* take payload backup to check for changes later */
                    if (this.payloadBackup.length === response.data.data.length) {
                        /* No change in payload hence do nothing */

                        /* Checking if any data is available */
                        if (response.data.data.length === 0) {
                            /* Display warning on the screen */
                            this.postList = []
                            this.postList.push(<Text style={{margin:10}} key={0}>No post to display</Text>)
                            this.postList.push(<Text style={{margin:10}} key={1}>Create a new post by clicking on + icon</Text>)
                        }
                        /* Update state to render warning */
                        this.setState({ refreshing: false, networkChanged: false })
                        return
                    } else {
                        /* Change in payload */

                        /* Take Backup */
                        this.payloadBackup = response.data.data

                        /* Skip for initial post load */
                        if (this.postList.length !== 0) {

                            if (this.scrollPosition > 150) {
                                /* Show th new post button */ 
                                this.setState({ newPostVisibility: true })
                            }

                            /* reset the tiles */
                            this.postList = []
                        }
                        
                        /* Create UI tiles to display */
                        await this.createTiles(response.data.data)
                        this.setState({ refreshing: false, networkChanged: false })
                    }
                }).catch((error) => {
                    this.setState({ refreshing: false, networkChanged: false })
                    console.log()
                    // if (!this.props.isConnected) {
                    //     Toast.show({
                    //         text: error.response.data.code, 
                    //         type: 'danger',
                    //         duration: 3000
                    //     })
                    // } else {
                    //     Toast.show({
                    //         text: "Please connect to the internet",
                    //         type: 'danger',
                    //         duration: 3000
                    //     })
                    // }
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
    createTiles = async(data) => {
        this.profileData = await loadProfile(this.payload, this.headers, this.props.isConnected);
        data.map((item, index) => {      
            this.postList.push(
                // Post Component
                <Post 
                    key= {index}
                    postId = {item.Item.post_id}
                    postCreator={item.Item.associate_name} 
                    postCreator_id = {item.Item.associate_id} 
                    profileData={item.Item.associate_id == this.props.associate_id ? this.profileData : {}}
                    time= {item.Item.time} 
                    postMessage={item.Item.message} 
                    taggedAssociates={item.Item.tagged_associates} 
                    strength={item.Item.sub_type} 
                    associate={item.Item.associate_id}
                />
            )
        })
    }
    render() {

        return (

            <Container style={{ backgroundColor: '#eee' }}>

                <ScrollView 
                    showsVerticalScrollIndicator = {false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing || this.state.networkChanged} //this.props.isConnected
                            onRefresh={() => {
                                /* Show loader when manual refresh is triggered */
                                if(this.props.isConnected) {
                                    this.setState({ refreshing: true }, this.loadPosts())
                                }else {
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

                <NavigationEvents
                    onWillFocus={async() =>{
                        if (this.props.isConnected) {
                            if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                this.loadPosts()
                                this.profileData = await loadProfile(this.payload, this.headers, this.props.isConnected)
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
                        <Text style={{ fontWeight: '500',color:'#fff', textAlign: 'center', flexWrap: 'wrap', width: 100 }}>New Post</Text>
                    </TouchableOpacity>
                    :
                    null
                }
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
    thumbnail : {
        height: '70%',
        borderRadius: 50,
        margin: 10
    }
});

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected,
        idToken: state.user.idToken
    };
}

export default connect(mapStateToProps, null)(ListPost)