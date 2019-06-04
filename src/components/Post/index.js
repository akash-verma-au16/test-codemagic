import React, { Component } from 'react';
// Components from React-Native
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Alert, Keyboard } from 'react-native';
// Components from Native Base
import AsyncStorage from '@react-native-community/async-storage';

import { Icon } from 'native-base'

import { styles } from './styles'

/* unique id generation */
import uuid from 'uuid'

//Cusotm component
import VisibilityModal from '../../containers/VisibilityModal'

import { like_post, unlike_post, rewards_addon } from '../../services/post'
//React navigation
import { withNavigation } from 'react-navigation';

//Redux
import { connect } from 'react-redux'

// Components from Moment.js
import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'

class Post extends Component {
    constructor(props) {
        super(props);
        this.returnCount = this.returnCount.bind(this)
        var initalState = {
            like: false,
            isLiked: false,
            modalVisible: false,
            likeId: "",
            isEdit: false,
            editPostMessage: "",
            addOn: 0,
            likes: this.props.likeCount, 
            comments: this.props.commentCount,
            taggedAssociates: this.props.taggedAssociates
        }
        this.state = initalState
        console.log("this.state.likes", this.state.likes)
        console.log("this.state.comments", this.state.comments)
        this.postMessage = this.props.postMessage
        this.taggedAssociates = []
        //formatting update locale
        Moment.globalMoment = moment;
        moment.updateLocale('en', {
            relativeTime: {
                past: function (input) {
                    return input === 'just now'
                        ? input
                        : input + ' ago'
                },
                s: 'just now',
                future: "in %s",
                ss: '%ds',
                m: "%dm",
                mm: "%dm",
                h: "%dh",
                hh: "%dh",
                d: "%dd",
                dd: "%dd",
                M: "%dm",
                MM: "%dm",
                y: "%dy",
                yy: "%dy"
            }
        });
        
    }

    componentWillMount() {
        this.setState({
            ...this.state,
            likes: this.props.likeCount,
            comments: this.props.commentCount,
            taggedAssociates: this.props.taggedAssociates
        })
        this.restoreLikes()
    }

    componentWillUnmount() {
        this.setState({
            like: false,
            isLiked: false,
            modalVisible: false,
            likeId: "",
            isEdit: false,
            editPostMessage: "",
            addOn: 0,
            likes: 0,
            comments: 0,
            taggedAssociates: []
        })
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.likeCount !== this.state.likes) {
            this.setState({likes: 0})
        }
        else {
            this.setState({ likes: this.state.likes })
        }
    }

    //Authorization headers
    headers = {
        headers: {
            Authorization: this.props.idToken
        }
    }
    restoreLikes = async () => {
        try {
            //Check if previous state exists
            const value = await AsyncStorage.getItem(this.props.postId);

            if (value) {
                // We have state!!
                console.log('Post Like: ',value)
                if(value==='true'){
                    this.setState({ isLiked: true,like:true})
                }
                else if(value==='false'){
                    this.setState({ isLiked: false,like:false})
                }

            } 
        } catch (error) {
            // Error retrieving data
        }
    }
    likePost = () => {
        /* unique id generation */
        const id = uuid.v4()
        this.setState({likeId: id})
        /* epoch time calculation */
        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000);
        const payload = {
            Data: {
                post_id: this.props.postId,
                tenant_id: this.props.accountAlias,
                ops: "like",
                like: {
                    like_id: id,
                    associate_id: this.props.associate_id,
                    time: timestamp
                }
            }
        }
        try {
            like_post(payload, this.headers).then((res) => {
                console.log("Response", res)
                if(res.status === 200) {
                    this.setState({ isLiked: true})
                    AsyncStorage.setItem(this.props.postId,'true')
                }
                
            }).catch((e) => {
                console.log(e)
            })
        }
        catch (e) {
            console.log(e)

        }
    }

    unlikePost = () => {
        const payload = {
            Data: {
                post_id: this.props.postId,
                tenant_id: this.props.accountAlias,
                ops: "unlike",
                like: {
                    like_id: this.state.likeId,
                    associate_id: this.props.associate_id
                }
            }
        }
        try {
            unlike_post(payload, this.headers).then((res) => {
                console.log("Unlike", res)
                if (res.status === 200) {
                    this.setState({ isLiked: false })
                    AsyncStorage.setItem(this.props.postId,'false')
                }
            }).catch((e) => {
                console.log(e)
            })
        }
        catch (e) {
            console.log(e)

        }
    }

    onLikeHnadler = () => {
        if(this.props.isConnected) {
            console.log("postId",this.props.postId)
            this.setState({
                like: !this.state.like
            }, () => {
                if(this.state.like) {
                    this.setState({ isLiked: true, likes: this.state.likes + 1})
                    this.likePost()
                    // setTimeout(() => this.likePost(), 3000)
                } else {
                    this.setState({ isLiked: false, likes: this.state.likes - 1 })
                    this.unlikePost()
                    // setTimeout(() => this.unlikePost(), 3000)                        
                }
            })
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

    onIconPresshandler = () => {
        // console.log('PD', this.props.profileData)
        this.props.navigation.navigate('Profile', {
            associateId: this.props.postCreator_id,
            profileData: this.props.postCreator_id === this.props.associate_id ? this.props.profileData : {},
            isPost: this.props.postCreator_id === this.props.associate_id ? true : false
        })
    }

    onAssociateTaphandler = (associateId) => {
        if(this.props.isConnected) {
            this.props.navigation.push('Profile', {
                associateId: associateId,
                profileData: this.props.postCreator_id === this.props.associate_id ? this.props.profileData : {}
            })
        } else {
            ToastAndroid.showWithGravityAndOffset(
                'Please connect to the Internet',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
        }
    }

    showToast() {
        ToastAndroid.showWithGravityAndOffset(
            'Coming soon',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            100,
        );
    }

    rewardsAddon = () => {
        console.log("this.props.walletBalance",this.props.walletBalance)
        if (this.props.isConnected) {
            this.setState({ addOn: this.state.addOn + 10 })
            // this.taggedAssociates = this.props.taggedAssociates
            // this.taggedAssociates.map((item) => {
            //     delete item.associate_name

            // })
            console.log("this.props.taggedAssociates", this.props.taggedAssociates)
            const payload = {
                tenant_id: this.props.accountAlias,
                associate_id: this.props.associate_id,
                tagged_associates: this.props.taggedAssociates,
                sub_type: this.props.strength,
                type: this.props.type,
                post_id: this.props.postId,
                points: "10"
            }
            console.log("Rewards payload",payload )
            
            // try {
            //     rewards_addon(payload, this.headers).then((res) => {
            //         console.log('Addon', res)

            //     }).catch((e) => {
            //         console.log(e)
            //     })
            // }
            // catch (e) {
            //     console.log(e)
            // }
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

    returnCount = (count) => {
        console.log(count)
        this.setState({
            comments: count.count
        })
    }

    returnData = (data) => {
        this.setState({
            isEdit: true,
            postMessage: data.message
        })
        this.props.editPostHandler(this.props.postId, data.message)
    } 

    data = [
        { icon: 'edit', type: 'AntDesign', text: 'Edit Post', name:'edit' , key: 'edit'},
        { icon: 'delete', type: 'AntDesign', text: 'Delete Post', name:'delete' , key: 'delete'}
    ]

    otherData = [
        { icon: 'report', type: 'MaterialIcons', text: 'Report Post', name: 'report', key: 'report' }
    ]

    render() {
        this.associateList = []
        return (
            <View style={styles.card} key={this.props.key}>
                <View name='header'
                    style={styles.container}
                >
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }} onPress={this.onIconPresshandler}>
                        <View name='image' style={{
                            borderRadius: 30,
                            backgroundColor: '#1c92c4',
                            height: 35,
                            aspectRatio: 1 / 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Icon name='person' style={{ fontSize: 25, color: 'white' }} />
                        </View>
                        <Text style={{ marginHorizontal: 10, color: '#333', fontWeight: '500', fontSize: 16 }}>
                            {this.props.postCreator_id === this.props.associate_id ? this.props.userName : this.props.postCreator}
                        </Text>
                        { this.state.addOn > 0 && this.props.postCreator_id !== this.props.associate_id ? 
                            <View style={styles.addOnView}>
                                <Text style={styles.addon}>+{this.state.addOn}</Text>
                            </View>
                            :
                            null
                        }
                    </TouchableOpacity>
                    {/* <Text style={styles.timeStamp}>{item.Item.time}</Text> */}
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
                        <Moment style={{ fontSize: 11, marginRight: 5 }} element={Text} fromNow>{this.props.time * 1000}</Moment>                        
                        <TouchableOpacity style={{height: 30, width: 20, borderRadius:30, alignItems: 'flex-end', justifyContent:'center'}} onPress={() => this.setState({ modalVisible: true })} underlayColor='#fff'>
                            <Icon
                                name='dots-three-horizontal'
                                type='Entypo'
                                style={{ fontSize: 14, color: '#333' }} 
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View name='content' style={{ flex: 2, paddingVertical: 10 }}>
                    <Text style={styles.postText}>

                        {this.props.taggedAssociates.map((associate, index) => {
                            this.associateList.push((
                                <Text 
                                    style={styles.associate} 
                                    key={index} 
                                    onPress={() => this.onAssociateTaphandler(associate.associate_id)}
                                >
                                    @{associate.associate_name + " "}
                                </Text>
                            ))
                        })}
                        {this.associateList}
                        {this.state.isEdit ? this.state.editPostMessage : this.props.postMessage}

                        <Text style={styles.strength}> #{this.props.strength}</Text>
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', height: 1 / 3, backgroundColor: '#c9cacc', marginVertical: 5 }}></View>                    

                <View style={{ width: "100%"}}>
                    {/* <View style={{ flexDirection: 'row', height: 1 / 3, backgroundColor: '#c9cacc', marginVertical: 5 }}></View>                     */}
                    <View style={styles.infoTab}>
                        <View style={{ flexDirection: 'row', width: "50%", alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={0.8} underlayColor='#111' style={styles.navBar} onPress={() => this.props.navigation.navigate('Likes', { postId: this.props.postId })}>
                                <Text style={styles.infoNo}>{this.state.likes}</Text>
                                <Text style={styles.infoText}>{this.props.likeCount > 1 ? "Likes" : "Like"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navBar} underlayColor='#111' activeOpacity={0.8} onPress={() => this.props.navigation.navigate('Comments', { postId: this.props.postId, returnCount: this.returnCount })}>
                                <Text style={styles.infoNo}>{this.state.comments}</Text>
                                <Text style={styles.infoText}>{this.props.commentCount > 1 ? 'Comments' : 'Comment'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', height: 1 / 3, backgroundColor: '#c9cacc', marginVertical: 5 }}></View>                    
                
                <View name='footer'
                    style={{
                        width: "100%",
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        padding: 3
                    }}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.footerConetntView} onPress={this.onLikeHnadler}>
                        <Icon name='md-thumbs-up' style={ this.state.like ? styles.like : styles.unlike }/>
                        <Text style={this.state.like ? styles.footerTextActive : styles.footerTextInactive}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.footerConetntView} onPress={() => this.props.navigation.navigate('Comments', {
                        isComment: true, 
                        postId: this.props.postId,
                        returnCount: this.returnCount
                    })}>
                        <Icon name='comment' type={'MaterialIcons'} style={styles.comment} />
                        <Text style={styles.footerText}>Comment</Text>
                    </TouchableOpacity>
                    {
                        (this.props.postCreator_id !== this.props.associate_id) ? 
                            <TouchableOpacity activeOpacity={0.8} style={styles.footerConetntView} onPress={this.rewardsAddon}>
                                <Icon name='md-add' type={'Ionicons'} style={this.state.addOn > 0 ? { color: '#1c92c4', fontSize: 19} : { color: '#bababa', fontSize: 19 }} />
                                <Text style={this.state.addOn > 0 ? styles.footerTextActive : styles.footerTextInactive}>Add-on</Text>
                            </TouchableOpacity>
                            : null
                    }
                </View>
                <VisibilityModal 
                    enabled={this.state.modalVisible}
                    data={this.props.associate_id === this.props.associate ? this.data : this.otherData}
                    onChangeListener={({text, name, key}) => {
                        if(key == 'delete') {
                            Alert.alert(
                                'Delete Post?',
                                'Are you sure you want to delete this post ?',
                                [
                                    {
                                        text: 'No',
                                        style: 'cancel'
                                    },
                                    {
                                        text: 'Yes', onPress: () => { this.props.postDeleteHandler(this.props.postId) }
                                    }
                                ],
                                { cancelable: false },
                            )
                        } 
                        else if(key == 'edit') {
                            this.props.navigation.navigate('EditPost',{ 
                                returnData: this.returnData.bind(this),
                                associate: this.props.userName,
                                postMessage: this.props.postMessage.replace(this.props.strength.toLowerCase(), ''),
                                taggedAssociates: this.props.taggedAssociates,
                                strength: this.props.strength,
                                time: this.props.time,
                                postId: this.props.postId,
                                type: this.props.type
                            })
                        }
                        else {
                            this.showToast()
                        }
                    }}
                    visibilityDisableHandler={() => {
                        this.setState({ modalVisible: false })
                    }} 
                    onRequestClose = {() => {
                        this.setState({ modalVisible: false })
                    }}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        walletbalance: state.user.walletBalance,
        userName: state.user.firstName + " " + state.user.lastName,
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isConnected: state.system.isConnected
    };
}

export default connect(mapStateToProps, null)(withNavigation(Post))
