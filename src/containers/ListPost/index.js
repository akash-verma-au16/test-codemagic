import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Dimensions
} from 'react-native';
/* Redux */
import { connect } from 'react-redux'
import {
    Container,
    H2,
    Icon,
    Toast,
    Thumbnail
} from 'native-base';
/* Services */
import { list_posts } from '../../services/post'
/* Components */
import { NavigationEvents } from 'react-navigation';
import thumbnail from '../../assets/thumbnail.jpg'
class ListPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: true,
            newPostVisibility: false
        }
        this.postList = []
        this.scrollViewRef = React.createRef();
        this.payloadBackup = []
        this.windowWidth = Dimensions.get("window").width;
        this.scrollPosition = 0
    }
    static navigationOptions = ({ navigation }) => {
        return {

            headerRight: (
                <Icon name='md-notifications' style={
                    {
                        color: 'white',
                        margin: 20
                    }
                } onPress={navigation.getParam('commingSoon')} />
            ),
            headerLeft: (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Thumbnail
                        source={thumbnail}

                        style={
                            {
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
    commingSoon = () => {
        Toast.show({
            text: 'Coming Soon!',
            type: 'success',
            duration: 3000
        })
    }
    newPostHandler = () => {

        /* Hide the Button */
        this.setState({ newPostVisibility: false })

        /* Scroll to top to point the latest post */
        this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })

    }
    loadPosts = () => {
        const payload = {
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id

        }
        try {
            list_posts(payload).then(response => {

                /* take payload backup to check for changes later */
                if (this.payloadBackup.length === response.data.data.length) {
                    /* No change in payload hence do nothing */
                    this.setState({ refreshing: false })
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
                    }

                    /* reset the tiles */
                    this.postList = []
                }

                /* Create UI tiles to display */
                this.createTiles(response.data.data)
                this.setState({ refreshing: false })
            }).catch((error) => {

                Toast.show({
                    text: error.response.data.code,
                    type: 'danger',
                    duration: 3000
                })
                this.setState({ refreshing: false })

            })
        } catch (error) {
            Toast.show({
                text: 'No internet connection',
                type: 'danger',
                duration: 3000
            })
            this.setState({ refreshing: false })
        }
    }
    createTiles = (data) => {
        if (data.length === 0) {
            this.postList.push(<Text key={0}>No post to display</Text>)
            return
        }
        data.map((item, index) => {
            this.postList.push(
                <View style={styles.card} key={index}>
                    <View name='header'
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <View name='image' style={{
                            borderRadius: 30,
                            backgroundColor: '#1c92c4',
                            height: 30,
                            aspectRatio: 1 / 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Icon name='person' style={{ fontSize: 20, color: 'white' }} />
                        </View>
                        <Text style={{ marginHorizontal: 10, color: '#333', fontWeight: '500' }}>John Snow</Text>
                    </View>
                    <View style={{
                        backgroundColor: '#ddd',
                        height: 1,
                        width: '100%',
                        marginVertical: 10
                    }} />
                    <View name='content'
                        style={{
                            flex: 2,
                            padding: 10
                        }}
                    >
                        <H2 >{item.message}</H2>
                    </View>
                    <View style={{
                        backgroundColor: '#ddd',
                        height: 1,
                        width: '100%',
                        marginVertical: 10
                    }} />
                    <View name='footer'
                        style={{
                            flex: 1,

                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}
                    >

                        <Icon name='md-thumbs-up' style={{ fontSize: 20, color: '#ddd' }} onPress={this.commingSoon} />
                    </View>
                </View>
            )
        })
    }
    render() {

        return (

            <Container style={{ backgroundColor: '#eee' }}>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                /* Show loader when manual refresh is triggered */
                                this.setState({ refreshing: true }, this.loadPosts())
                            }}
                        />
                    }
                    contentContainerStyle={styles.container}
                    ref={this.scrollViewRef}
                    onScroll={(event) => { this.scrollPosition = event.nativeEvent.contentOffset.y}}
                >
                    {this.postList}
                </ScrollView>

                <NavigationEvents
                    onWillFocus={() => this.loadPosts()}
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
                        <Text style={{ fontWeight: '500',color:'#fff' }}>New Post</Text>
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
        backgroundColor: '#eee'
    },

    card: {
        marginBottom: 10,
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 10,
        padding: 20,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 2
    }
});

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall

    };
}

export default connect(mapStateToProps, null)(ListPost)