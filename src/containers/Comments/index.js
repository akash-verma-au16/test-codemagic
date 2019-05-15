import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    TextInput,
    ToastAndroid
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
            commentsRefresh: false
        }
        this.loadComments =  this.loadComments.bind(this)
        this.commentList = []
    }
    componentWillMount() {
        this.loadComments()
    }

    loadComments = () => {
        dummyData.map((item, index) => {
            this.commentList.push(
                <Comment
                    key={index}
                    associate={item.associate}
                    message={item.comment}
                    time={item.time}
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
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.header}>
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
                {/* <TextInput /> */}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // accountAlias: state.user.accountAlias,
        // associate_id: state.user.associate_id,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected

    };
}

export default connect(mapStateToProps, null)(Comments)