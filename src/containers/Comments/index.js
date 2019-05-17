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

import { dummyData } from './data'

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
        this.loadComments =  this.loadComments.bind(this)
        this.focusHandler = this.focusHandler.bind(this)
        this.commentList = [] 
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

    loadComments = () => {
        dummyData.map((item, index) => {
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

    handleSubmitComment = () => {
        if (this.state.addCommentText.length > 0) {
            Keyboard.dismiss();
            ToastAndroid.showWithGravityAndOffset(
                'Coming soon',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
            this.setState({ addCommentText: "" })
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
                            onPress={this.handleSubmitComment}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected

    };
}

export default connect(mapStateToProps, null)(Comments)