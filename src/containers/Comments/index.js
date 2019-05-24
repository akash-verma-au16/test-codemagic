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

import { Icon } from 'native-base'

/* unique id generation */
import uuid from 'uuid'

import { dummyData } from './data'
//Add comment
import { add_comment } from '../../services/comments'

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
            isComment: this.props.navigation.getParam('isComment')
        }
        this.postId = this.props.navigation.getParam('postId')
        this.loadComments =  this.loadComments.bind(this)
        this.focusHandler = this.focusHandler.bind(this)
        this.commentList = [] 
        this.data = dummyData
        // this.scrollViewRef = React.createRef();
    }
    componentWillMount() {
        this.loadComments()
    }

    componentDidMount() {
        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });
    }

    async goBack() {
        await this.props.navigation.goBack()
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }
    //Authorization headers
    headers = {
        headers: {
            Authorization: this.props.idToken
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

                const payload = {
                    Data: {
                        post_id: this.postId,
                        tenant_id: this.props.accountAlias,
                        ops: "comment",
                        comment: {
                            comment_id: id,
                            associate_id: this.props.associate_id,
                            time: timestamp,
                            message: this.state.addCommentText
                        }
                    }
                }   
                console.log("payload", payload)
                try {
                    add_comment(payload, this.headers).then((res) => {
                        console.log('addComment',res)
                        this.data.push({
                            associate: this.props.fullName,
                            associate_id: this.props.associate_id,
                            comment: this.state.addCommentText,
                            time: payload.Data.comment.time
                        })
                        this.loadComments()
                        this.setState({addCommentText: "" })
                        Keyboard.dismiss()
                    }).catch ((error) => {
                        Keyboard.dismiss()
                        ToastAndroid.showWithGravityAndOffset(
                            "error.code",
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            100,
                        );
                    })
                }
                catch(e) {
                    ToastAndroid.showWithGravityAndOffset(
                        "e.code",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        100,
                    );
                }
            }
            else {
                ToastAndroid.showWithGravityAndOffset(
                    'No Internet Connection',
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    25,
                    100,
                );
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

    loadComments = () => {
        console.log("loadComments")
        this.commentList = []
        this.data.map((item, index) => {
            this.commentList.push(
                <Comment
                    key={index}
                    associate={item.associate} 
                    id={item.associate_id}
                    message={item.comment}
                    time={item.time} 
                    onPress={() => this.setState({modalVisible: true})}
                />
            )
        })
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
                                        this.loadComments()
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