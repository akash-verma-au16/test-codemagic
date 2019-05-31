import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
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
            commentsRefresh: false,
            addCommentText: "",
            isComment: this.props.navigation.getParam('isComment'),
            isCommentDeleted: false
        }
        this.postId = this.props.navigation.getParam('postId')
        this.fetchComments = this.fetchComments.bind(this)
        this.loadComments = this.loadComments.bind(this)
        this.focusHandler = this.focusHandler.bind(this)
        this.commentList = [] 
        this.comments = []
        // this.scrollViewRef = React.createRef();
    }
    componentWillMount() {
        this.setState({ commentsRefresh: true})
        this.fetchComments()
    }

    componentDidMount() {
        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });
        //Add network Connectivity Listener
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange)
        this.interval = setInterval(() => { this.fetchComments() }, 5000);
    }

    async goBack() {
        await this.props.navigation.goBack()
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
                    console.log("Comment Response", response.data.data.Items)
                    if(response.data.data.Items.length == 0 && this.comments.length == 0) {
                        this.commentList = []
                        this.commentList.push(<Text style={{ margin: 10 }} key={0}>No Comments</Text>)
                        this.commentList.push(<Text key={1}>Add Comment to start Conversation</Text>)
                        this.setState({ commentsRefresh: false })                        
                        return
                    }
                    else {
                        if (this.comments.length == 0 && !this.state.isCommentDeleted) {
                            this.comments = response.data.data.Items
                        }
                        console.log("this.comments.length", this.comments.length)
                        console.log("response.data.data.Items.length", response.data.data.Items.length)
                        if (this.comments.length !== response.data.data.Items.length) {
                            if (this.comments.length > response.data.data.Items.length) {
                                return
                            }   
                            else {
                                if (this.state.isCommentDeleted === false) {
                                    this.comments = response.data.data.Items
                                    this.loadComments(this.comments)
                                }
                            }    
                        } 
                        else {
                            console.log("this.comments", this.comments)
                            this.loadComments(this.comments)
                        }
                    }
                    // console.log("List Comments", response.data.data)
                }).catch((e) => {
                    console.log(e)
                })
            } 
        }
        catch(e) {
            console.log(e)
        }
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
                    this.loadComments(this.comments)
                    Keyboard.dismiss()
                    // this.setState({ commentsRefresh: true })
                    add_comment(payload, this.headers).then(async(res) => {
                        console.log('addComment',res)
                        if(res.status === 200) {
                            console.log("Comment",this.state.addCommentText)
                            
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
                    }).catch ((error) => {
                        Keyboard.dismiss()
                        console.log(error)
                        // ToastAndroid.showWithGravityAndOffset(
                        //     "error.code",
                        //     ToastAndroid.LONG,
                        //     ToastAndroid.BOTTOM,
                        //     25,
                        //     100,
                        // );
                    })
                }
                catch(e) {
                    console.log(e)
                }
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
        console.log("loadComments")
        var inputData = data.sort((a,b) => {return a.time -b.time})
        this.commentList = []
        await inputData.map((item, index) => {
            this.commentList.push(
                <Comment
                    key={index} 
                    comment_id={item.comment_id} 
                    post_id={item.post_id}
                    associate={item.associate} 
                    id={item.associate_id}
                    message={item.message}
                    time={item.time} 
                    onPress={() => this.setState({modalVisible: true})} 
                    commentDeletehandle={this.deleteComment}
                />
            )
        })
        this.setState({ commentsRefresh: false })
    }

    deleteComment = (comment_id, comment) => {
        console.log("delete comment")
        if(this.props.isConnected) {
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
            // const deleteComment = this.comments.filter((ele) => { return ele.comment_id == comment_id })
            var index = this.comments.findIndex((elm) => { return elm.comment_id == comment_id })
            console.log("index",index)
            this.comments.splice(index, 1)
            this.loadComments(this.comments)
            this.setState({ isCommentDeleted: true })
            try {
                delete_comment(payload, this.headers).then(async(response) => {
                    console.log("Comment Deleted")
                    this.setState({ isCommentDeleted: false})
                }).catch((e) => {
                    console.log(e)
                })
            }
            catch (e) {
                console.log(e)
            }
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
        // this.scrollViewRef.current.scrollTo({x: 0, y: 500, animated: true})
        this.scrollView.scrollToEnd();
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.header} onPress={() => this.props.navigation.navigate('Likes')}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Icon type='AntDesign' name='like2' style={{ fontSize: 25, color: '#1c92c4'}} />
                        <Text style={styles.headerText}>Liked by 5 people</Text>
                    </View>
                    {/* future purpose */}
                    {/* <TouchableOpacity>
                        <Icon type='AntDesign' name='like2' style={{fontSize: 20, color: }}/>
                    </TouchableOpacity> */}
                    <Icon type='Ionicons' name='ios-arrow-forward' style={{ fontSize: 25, color: '#111'}} />
                </TouchableOpacity>
                {/* horizontal line */}
                <View style={styles.horizontalLine}></View>
                {/* Comment content */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 5 }}
                    ref={(scrollView) => { this.scrollView = scrollView }}
                    // {this.scrollViewRef}
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
                    {this.commentList}
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
                            // style={styles.iconActive}
                            style={this.state.addCommentText.length > 0 ? styles.iconActive : styles.iconInactive} 
                            onPress={this.addComment}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
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