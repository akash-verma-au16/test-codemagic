import React from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    TextInput,
    ToastAndroid,
    BackHandler,
    Keyboard
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"

import { Icon } from 'native-base'

/* unique id generation */
import uuid from 'uuid'

//Comment API methods
import { add_comment, list_comments, delete_comment } from '../../services/comments'

//Loading Modal
import LoadingModal from '../LoadingModal'

//Redux
import { connect } from 'react-redux'

//Styles for the screen
import { styles } from './style'

//Custom component
import Comment from '../../components/Comment/index'

class Comments extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commentList: [],
            initialLoad: false,
            commentsRefresh: false,
            addCommentText: "",
            isComment: this.props.navigation.getParam('isComment'),
            isCommentDeleted: false
        }
        this.postId = this.props.navigation.getParam('postId')
        this.commentCount = this.commentCount.bind(this)
        this.fetchComments = this.fetchComments.bind(this)
        this.loadComments = this.loadComments.bind(this)
        this.focusHandler = this.focusHandler.bind(this)
        this.commentList = [] 
        this.comments = []
        // this.scrollViewRef = React.createRef();
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (
                <Icon name='ios-arrow-back' type='Ionicons' style={
                    {
                        color: 'white',
                        padding: 19
                    }} onPress={
                    navigation.getParam('commentCount')} />
            )
        }
    }

    componentWillMount() {
        this.setState({ commentsRefresh: true})
    }

    componentDidMount() {
        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.commentCount()
            return true;
        });
        //Add network Connectivity Listener
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange)
        this.interval = setInterval(() => {
            if (!this.state.isCommentDeleted) {
                this.fetchComments()
            } 
        }, 10000);
        this.props.navigation.setParams({ commentCount: this.commentCount })
    }

    commentCount = () => {
        Keyboard.dismiss()
        var count = this.commentList.length
        this.props.navigation.state.params.returnCount({
            count: count,
            countUpdated: true
        })
        this.props.navigation.goBack()
    }

    componentWillUnmount() {
        this.backHandler.remove();
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        clearInterval(this.interval)
    }

    handleConnectivityChange = (isConnected) => {
        if (isConnected) {
            this.fetchComments()
        }
    }

    //Authorization headers
    headers = {
        headers: {
            Authorization: this.props.idToken
        }
    }
    fetchComments = () => {
        const payload = {
            "post_id": this.postId,
            "tenant_id": this.props.accountAlias,
            "associate_id": this.props.associate_id
        }
        try {
            if (this.props.isConnected) {
                list_comments(payload, this.headers).then((response) => {
                    if(response.data.data.Items.length == 0 && this.comments.length == 0) {
                        this.commentList = []
                        this.setState({ commentsRefresh: false, initialLoad: true })                        
                        return
                    }
                    else {
                        this.setState({ initialLoad: false})
                        if (this.comments.length == 0 && !this.state.isCommentDeleted) {
                            this.comments = response.data.data.Items
                        }

                        if (this.comments.length !== response.data.data.Items.length) {
                            if (this.comments.length > response.data.data.Items.length) {
                                return
                            }   
                            else {
                                if (this.state.isCommentDeleted === false) {
                                    this.comments = response.data.data.Items
                                    this.loadComments(this.comments)
                                }
                                else {
                                    return
                                }
                            }    
                        } 
                        else {
                            this.loadComments(this.comments)
                        }
                    }
                }).catch(() => {
                })
            } 
        }
        catch(e) {/* error */}
    }

    addComment = () => {
        if(this.state.addCommentText.length > 0) {
            if(this.props.isConnected) {
                /* unique id generation */
                const id = uuid.v4()
                /* epoch time calculation */
                const dateTime = Date.now();
                const timestamp = Math.floor(dateTime / 1000);
                var comment = this.state.addCommentText
                const payload = {
                    Data: {
                        post_id: this.postId,
                        tenant_id: this.props.accountAlias,
                        ops: "comment",
                        comment: {
                            comment_id: id,
                            associate_id: this.props.associate_id,
                            time: timestamp,
                            message: comment
                        }
                    }
                }   
                try {
                    this.setState({ addCommentText: "" })
                    this.comments.push({
                        associate_id: payload.Data.comment.associate_id,
                        comment_id: payload.Data.comment.comment_id,
                        message: payload.Data.comment.message,
                        post_id: payload.Data.post_id,
                        tenant_id: payload.Data.tenant_id,
                        time: payload.Data.comment.time
                    })
                    this.props.navigation.setParams({ commentCount: this.comments.length })
                    this.loadComments(this.comments)
                    Keyboard.dismiss()
                    // this.setState({ commentsRefresh: true })
                    add_comment(payload, this.headers).then(async(res) => {
                        if(res.status === 200) {
                            
                            // setTimeout(() => this.fetchComments(), 1000)
                        }
                        else {
                            ToastAndroid.showWithGravityAndOffset(
                                "Something went wrong while Commenting, please try agin",
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                                25,
                                100,
                            );
                        }
                    }).catch (() => {
                        Keyboard.dismiss()
                    })
                }
                catch(e) {/* error */}
            }
            else {
                this.showToast()
            }
        }
        else {
            ToastAndroid.showWithGravityAndOffset(
                'Please, Write something...',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                25,
                100,
            );
        }
    }

    loadComments = async(data) => {
        var inputData = data.sort((a,b) => {return a.time -b.time})
        this.commentList = []
        await inputData.map((item) => {
            this.commentList.push(
                <Comment
                    key={item.comment_id} 
                    comment_id={item.comment_id} 
                    post_id={item.post_id}
                    associate={this.props.associateList[item.associate_id]} 
                    id={item.associate_id}
                    message={item.message}
                    time={item.time} 
                    onPress={() => this.setState({modalVisible: true})} 
                    commentDeletehandler={this.deleteComment}
                />
            )
        })
        this.props.navigation.setParams({ commentCount: this.commentCount})
        this.setState({ commentsRefresh: false, initialLoad: false, commentList: this.commentList })
    }

    deleteComment = (comment_id, comment) => {
        if(this.props.isConnected) {
            this.setState({ isCommentDeleted: true })
            /* epoch time calculation */
            const dateTime = Date.now();
            const timestamp = Math.floor(dateTime / 1000);
            const payload = {
                Data: {
                    post_id: this.postId,
                    tenant_id: this.props.accountAlias,
                    ops: "delete_comment",
                    comment: {
                        comment_id: comment_id,
                        associate_id: this.props.associate_id,
                        time: timestamp,
                        message: comment
                    }
                }
            }
            var index = this.comments.findIndex((comment) => { return comment.comment_id == comment_id })
            this.commentList.splice(index, 1)
            this.comments.sort((a, b) => { return a.time - b.time })
            this.comments.splice(index, 1)
            if(this.comments.length == 0) {
                this.setState({ initialLoad: true })
            }
            else {
                this.setState({commentList: this.commentList})
            }
            try {
                delete_comment(payload, this.headers).then(async(response) => {
                    if(response.status === 200) {
                        setTimeout(() => this.setState({ isCommentDeleted: false }), 2000)
                    }
                }).catch(() => {
                    //Error retriving data
                    this.setState({ isCommentDeleted: false })
                })
            }
            catch (e) {/* error */}
        }
        else {
            this.showToast()
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

    //Handling scroll when textinput is focused
    focusHandler = () => {
        this.scrollView.scrollToEnd();
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 15 }}
                    ref={(scrollView) => { this.scrollView = scrollView }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.commentsRefresh}
                            onRefresh={() => {
                                if (this.props.isConnected) {
                                    if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                        this.fetchComments()
                                    }
                                }
                                else {
                                    this.showToast()
                                }
                            }}
                        />
                    }>
                    {!this.state.initialLoad ? this.state.commentList : (<View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{ margin: 10 }} key={0}>No Comments</Text>
                        <Text key={1}>Add Comment to start Conversation</Text>
                    </View>)}
                </ScrollView>
                <View style={styles.addCommentView}>
                    <TextInput
                        placeholder='Write a comment...'
                        placeholderTextColor='#444' 
                        value={this.state.addCommentText} 
                        autoFocus={this.state.isComment ? true : false} 
                        maxLength={255} 
                        style={styles.addComment} 
                        multiline={true} 
                        selectionColor='#1c92c4'
                        onChangeText={(text) => this.setState({addCommentText: text})} 
                        onFocus={this.focusHandler}
                    />
                    <View style={{width: '12%', alignItems: 'center', justifyContent: 'flex-end', padding:5, paddingLeft: 10}}>
                        <Icon
                            name='send'
                            type={'MaterialIcons'}
                            active={this.state.addCommentText.length > 0 ? true : false}
                            style={this.state.addCommentText.length > 0 ? styles.iconActive : styles.iconInactive} 
                            onPress={this.addComment}
                        />
                    </View>
                </View>
                <LoadingModal
                    enabled={this.state.isCommentDeleted}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        associateList: state.user.associateList,
        fullName: state.user.firstName+" "+state.user.lastName,
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected,
        idToken: state.user.idToken

    };
}

export default connect(mapStateToProps, null)(Comments)