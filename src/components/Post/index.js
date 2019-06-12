import React, { Component } from 'react';
// Components from React-Native
import { View, Text, TouchableOpacity,TouchableWithoutFeedback, ToastAndroid, Alert } from 'react-native';
// Components from Native Base
import AsyncStorage from '@react-native-community/async-storage';

import { Icon } from 'native-base'

import { styles } from './styles'

/* unique id generation */
import uuid from 'uuid'

import { dev } from '../../store/actions'

//Cusotm component
import VisibilityModal from '../../containers/VisibilityModal'

import { like_post, unlike_post, like_id, rewards_addon } from '../../services/post'
//React navigation
import { withNavigation } from 'react-navigation';

//Redux
import { connect } from 'react-redux'

// Components from Moment.js
import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'
import * as Animatable from 'react-native-animatable';
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
            addOn: "",
            likes: this.props.likeCount,
            comments: this.props.commentCount,
            taggedAssociates: this.props.taggedAssociates,
            points: this.props.points,
            rewardsPoints: this.props.points + (this.props.addOn == null ? 0 : this.props.addOn),
            addonVisible: false,
            postCreatorName: ""
        }
        this.state = initalState
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

        this.likeButtonRef = React.createRef()
        this.addonButtonRef = React.createRef();
    }

    getName = async () => {
        try {
            let name = await AsyncStorage.getItem(this.props.postCreator_id)
            this.setState({ postCreatorName: name })
        }
        catch {
            //Error retriving data
        }
    }

    componentWillMount() {
        this.restoreLikes()
        this.getName()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.likeCount !== this.props.likeCount || nextProps.commentCount !== this.props.commentCount || nextProps.taggedAssociates !== this.props.taggedAssociates || nextProps.points !== this.props.points) {
            this.setState({
                likes: nextProps.likeCount,
                comments: nextProps.commentCount,
                taggedAssociates: nextProps.taggedAssociates,
                rewardsPoints: nextProps.points + nextProps.addOn
            })

            this.restoreLikes()
        }
        else if (this.state.likes > this.props.likeCount) {
            this.setState({
                likes: this.state.likes
            })

        }
        else {
            this.setState({
                likes: this.state.likes,
                comments: this.state.comments
            })
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
                if (value === 'true') {
                    this.setState({ isLiked: true, like: true })
                }
                else if (value === 'false') {
                    this.setState({ isLiked: false, like: false })
                }

            }
        } catch (error) {
            // Error retrieving data
        }
    }
    likePost = () => {
        /* unique id generation */
        const id = uuid.v4()
        this.setState({ likeId: id })
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
                if (res.status === 200) {
                    this.setState({ isLiked: true })
                    AsyncStorage.setItem(this.props.postId, 'true')
                }

            }).catch(() => {
            })
        }
        catch (e) {/* error */ }
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
        const payload_2 = {
            post_id: this.props.postId,
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id
        }
        try {

            like_id(payload_2, this.headers).then((response) => {
                payload.Data.like.like_id = response.data.data.like_id
                unlike_post(payload, this.headers).then((res) => {
                    if (res.status === 200) {
                        this.setState({ isLiked: false })
                        AsyncStorage.setItem(this.props.postId, 'false')
                    }
                }).catch(() => {
                })
            }).catch(() => {
            })
        }
        catch (e) {/* error */ }
    }

    onLikeHnadler = () => {
        this.likeButtonRef.current.bounceIn(800)
        if (this.props.isConnected) {
            this.setState({
                like: !this.state.like
            }, () => {
                if (this.state.like) {
                    this.setState({ isLiked: true, likes: this.state.likes + 1 })
                    this.likePost()
                } else {
                    this.setState({ isLiked: false, likes: this.state.likes > 0 ? this.state.likes - 1 : 0 })
                    this.unlikePost()
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

    onIconPresshandler = (associateId) => {
        if (this.props.postSource == 'StrengthCount') {
            this.props.navigation.push('Profile', {
                associateId: associateId,
                profileData: {},
                isPost: false
            })
        }
        else {
            this.props.navigation.navigate('Profile', {
                associateId: associateId,
                profileData: associateId === this.props.associate_id ? this.props.profileData : {},
                isPost: associateId === this.props.associate_id ? true : false
            })
        }
    }

    onAssociateTaphandler = (associateId) => {
        if (this.props.isConnected) {
            this.props.navigation.push('Profile', {
                associateId: associateId,
                profileData:  this.props.profileData
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
        if (this.props.walletBalance >= this.state.addOn * this.props.taggedAssociates.length) {
            if (this.props.isConnected) {
                this.taggedAssociates = []
                this.props.taggedAssociates.map((item) => {
                    this.taggedAssociates.push({associate_id: item.associate_id})
                })
                const payload1 = {
                    tenant_id: this.props.accountAlias,
                    associate_id: this.props.associate_id,
                    sub_type: this.props.strength,
                    type: "add_on",
                    post_id: this.props.postId,
                    points: this.state.addOn * this.props.taggedAssociates.length,
                    tagged_associates: this.taggedAssociates
                }

                this.taggedAssociatesRewards = this.props.taggedAssociates.filter((item) => {
                    return item.associate_id !== this.props.associate_id
                })
                try {
                    rewards_addon(payload1, this.headers).then(async() => {
                        this.setState({ addonVisible: !this.state.addonVisible})
                        let points = this.state.addOn * this.taggedAssociatesRewards.length
                        ToastAndroid.showWithGravityAndOffset(
                            'You gifted ' + points + ' points',
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                            25,
                            100,
                        );
                        let walletBalance = this.props.walletBalance - points
                        const payload = {
                            walletBalance: walletBalance
                        }
                        //Update Wallet
                        await this.props.updateWallet(payload) 
                        this.setState({ addOn: "", rewardsPoints: this.state.rewardsPoints + points})
                    }).catch(() => {
                        //Error retriving data
                        this.setState({ addonVisible: false })
                    })
                }
                catch (e) {
                    //Error retriving data
                    this.setState({ addonVisible: false })
                }

            }
            else {
                ToastAndroid.showWithGravityAndOffset(
                    'No Internet Connection',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    100,
                );
            }
        }
        else {
            ToastAndroid.showWithGravityAndOffset(
                'You have insufficient points: ' + this.props.walletBalance + ' points',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                100,
            )
        }
    }

    returnCount = (count) => {
        this.setState({
            comments: count.count
        })
    }

    returnData = (data) => {
        this.setState({
            ...this.state,
            isEdit: true,
            editPostMessage: data.message,
            taggedAssociates: data.taggedAssociates,
            rewardsPoints: this.state.rewardsPoints + data.editAddon
        })
    }

    data = [
        { icon: 'edit', type: 'AntDesign', text: 'Edit Post', name: 'edit', key: 'edit' },
        { icon: 'delete', type: 'AntDesign', text: 'Delete Post', name: 'delete', key: 'delete' }
    ]

    otherData = [
        { icon: 'report', type: 'MaterialIcons', text: 'Report Post', name: 'report', key: 'report' }
    ]

    render() {
        this.associateList = []
        return (
            <Animatable.View useNativeDriver animation='fadeInDown' style={styles.card} key={this.props.key}>
                <View name='header'
                    style={styles.container}
                >
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center'}} onPress={() => this.onIconPresshandler(this.props.postCreator_id)}>
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
                                {this.props.postCreator_id === this.props.associate_id ? this.props.userName : this.state.postCreatorName}
                            </Text>
                        </TouchableOpacity>
                        {this.state.rewardsPoints > 0 ?
                            <View style={styles.addOnView}>
                                <Text style={styles.addon}>+{this.state.rewardsPoints}</Text>
                            </View>
                            :
                            null
                        }
                    </TouchableOpacity>
                    {/* <Text style={styles.timeStamp}>{item.Item.time}</Text> */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Moment style={{ fontSize: 11, marginRight: 5 }} element={Text} fromNow>{this.props.time * 1000}</Moment>
                        <TouchableOpacity style={{ height: 30, width: 20, borderRadius: 30, alignItems: 'flex-end', justifyContent: 'center' }} onPress={() => this.setState({ modalVisible: true })} underlayColor='#fff'>
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

                        {this.state.taggedAssociates.map((associate, index) => {
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

                <View style={{ width: "100%" }}>
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
                    <TouchableWithoutFeedback activeOpacity={0.8} style={styles.footerConetntView} onPress={this.onLikeHnadler}>
                        <Animatable.View useNativeDriver ref={this.likeButtonRef} style={styles.footerConetntView}>
                            <Icon name='md-thumbs-up' style={this.state.like ? styles.like : styles.unlike} />
                            <Text style={this.state.like ? styles.footerTextActive : styles.footerTextInactive}>Like</Text>
                        </Animatable.View>
                    </TouchableWithoutFeedback>
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
                            <TouchableWithoutFeedback activeOpacity={0.8} style={styles.footerConetntView} onPress={() => {this.setState({ addonVisible: !this.state.addonVisible });this.addonButtonRef.current.bounceIn(800)} }>
                                <Animatable.View useNativeDriver ref={this.addonButtonRef} style={styles.footerConetntView}>
                                    <Icon name='md-add' type={'Ionicons'} style={this.state.addonVisible ? { color: '#1c92c4', fontSize: 19 } : { color: '#bababa', fontSize: 19 }} />
                                    <Text style={this.state.addonVisible ? styles.footerTextActive : styles.footerTextInactive}>Add-on</Text>
                                </Animatable.View>
                            </TouchableWithoutFeedback>
                            : null
                    }
                </View>
                {this.state.addonVisible ?
                    <Animatable.View animation='zoomIn' useNativeDriver>
                        <View style={{ flexDirection: 'row', height: 1 / 3, backgroundColor: '#c9cacc', marginVertical: 5 }}></View>
                        <View style={styles.pointButtonView}>
                            <TouchableOpacity activeOpacity={0.5} underlayColor='#1c92c4' style={styles.pointsView} onPress={async () => { await this.setState({ addOn: "1" }, () => this.rewardsAddon()) }}>
                                <Text style={styles.points}>+1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} underlayColor='#1c92c4' style={styles.pointsView} onPress={async () => { await this.setState({ addOn: "5" }, () => this.rewardsAddon()) }}>
                                <Text style={styles.points}>+5</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} underlayColor='#1c92c4' style={styles.pointsView} onPress={async () => { await this.setState({ addOn: "10" }, () => this.rewardsAddon()) }}>
                                <Text style={styles.points}>+10</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                    :
                    null}

                <VisibilityModal
                    enabled={this.state.modalVisible}
                    data={this.props.associate_id === this.props.associate ? this.data : this.otherData}
                    onChangeListener={({ key }) => {
                        if (key == 'delete') {
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
                        else if (key == 'edit') {
                            this.props.navigation.navigate('EditPost', {
                                returnData: this.returnData.bind(this),
                                associate: this.props.userName,
                                postMessage: this.props.postMessage.replace(this.props.strength.toLowerCase(), ''),
                                taggedAssociates: this.props.taggedAssociates.map((item) => { return item.associate_id }),
                                strength: this.props.strength,
                                time: this.props.time,
                                postId: this.props.postId,
                                type: this.props.type,
                                privacy: this.props.privacy,
                                points: this.props.points
                            })
                        }
                        else {
                            this.showToast()
                        }
                    }}
                    visibilityDisableHandler={() => {
                        this.setState({ modalVisible: false })
                    }}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}
                />
            </Animatable.View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        walletBalance: state.user.walletBalance,
        userName: state.user.firstName + " " + state.user.lastName,
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isConnected: state.system.isConnected,
        idToken: state.user.idToken
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateWallet: (props) => dispatch({ type: dev.UPDATE_WALLET, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Post))
