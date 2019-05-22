import React, { Component } from 'react';
// Components from React-Native
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
// Components from Native Base
import { Icon } from 'native-base'
//Cusotm component
import VisibilityModal from '../../containers/VisibilityModal'

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
        this.state = {
            like: false,
            likes: 5,
            comments: 10,
            modalVisible: false
        }

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
    onLikeHnadler = () => {
        this.setState({
            like: !this.state.like,
            likes: this.state.like ? this.state.likes - 1 : this.state.likes + 1
        })
    }

    onIconPresshandler = () => {
        console.log('PD', this.props.profileData)
        this.props.navigation.navigate('Profile', {
            associateId: this.props.postCreator_id,
            profileData: this.props.postCreator_id === this.props.associate_id ? this.props.profileData : {}
        })
    }

    onAssociateTaphandler = (associateId) => {
        this.props.navigation.push('Profile', {
            associateId: associateId
        })
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

    data = [
        { icon: 'edit', type: 'AntDesign', text: 'Edit Post', name:'edit' , key: 'edit'},
        { icon: 'delete', type: 'AntDesign', text: 'Delete Post', name:'delete' , key: 'delete'}
    ]

    otherData = [
        { icon: 'dingding', type: 'AntDesign', text: 'Others', name: 'others', key: 'others' }
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
                    </TouchableOpacity>
                    {/* <Text style={styles.timeStamp}>{item.Item.time}</Text> */}
                    <TouchableOpacity style={{height: 30, width: 30, borderRadius:30, alignItems: 'flex-end', justifyContent:'center'}} onPress={() => this.setState({ modalVisible: true })} underlayColor='#fff'>
                        <Icon
                            name='dots-three-vertical'
                            type='Entypo'
                            style={{ fontSize: 14, color: '#333' }} 
                        />
                    </TouchableOpacity>
                </View>
                {/* <View style={{
                    backgroundColor: '#ddd',
                    height: 1,
                    width: '100%',
                    marginVertical: 2
                }} /> */}
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
                        {this.props.postMessage}

                        <Text style={styles.strength}> #{this.props.strength}</Text>
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', height: 1 / 3, backgroundColor: '#c9cacc', marginVertical: 5 }}></View>                    

                <TouchableOpacity underlayColor= '#111' activeOpacity={0.5} onPress={() => this.props.navigation.navigate('Comments')}>
                    <View style={{ width: "100%"}}>
                        {/* <View style={{ flexDirection: 'row', height: 1 / 3, backgroundColor: '#c9cacc', marginVertical: 5 }}></View>                     */}
                        <View style={styles.infoTab}>
                            <View style={{ flexDirection: 'row', width: "50%", alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: "40%", alignItems: 'center' }}>
                                    <Text style={styles.infoNo}>{this.state.likes}</Text>
                                    <Text style={styles.infoText}>{this.state.likes > 1 ? "Likes" : "Like"}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: "40%", alignItems: 'center' }}>
                                    <Text style={styles.infoNo}>{this.state.comments}</Text>
                                    <Text style={styles.infoText}>{this.state.comments > 1 ? 'Comments' : 'Comment'}</Text>
                                </View>
                            </View>

                            <Moment style={{ fontSize: 12 }} element={Text} fromNow>{this.props.time * 1000}</Moment>

                            {/* <View style={{ flexDirection: 'row', height: 1 / 3, backgroundColor: '#c9cacc', marginVertical: 5}}></View> */}
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', height: 1 / 3, backgroundColor: '#c9cacc', marginVertical: 5 }}></View>                    
                
                <View name='footer'
                    style={{
                        width: "100%",
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        padding: 3
                    }}>
                    <TouchableOpacity activeOpacity={0.9} style={styles.footerConetntView} onPress={this.onLikeHnadler}>
                        <Icon name='md-thumbs-up' style={ this.state.like ? styles.like : styles.unlike }/>
                        <Text style={this.state.like ? styles.footerTextActive : styles.footerTextInactive}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9} style={styles.footerConetntView} onPress={() => this.props.navigation.navigate('Comments',{isComment: true})}>
                        <Icon name='comment' type={'MaterialIcons'} style={styles.comment} />
                        <Text style={styles.footerText}>Comment</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity activeOpacity={0.9} style={styles.footerConetntView}>
                        <Icon name='comment' type={'MaterialIcons'} style={styles.comment} />
                        <Text style={styles.footerText}>Comment</Text>
                    </TouchableOpacity> */}
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
                                        text: 'Yes', onPress: () => { this.showToast() }
                                    }
                                ],
                                { cancelable: false },
                            )
                        } 
                        else if(key == 'edit') {
                            this.props.navigation.navigate('EditPost',{
                                associate: this.props.postCreator,
                                postMessage: this.props.postMessage,
                                taggedAssociates: this.props.taggedAssociates,
                                strength: this.props.strength,
                                time: this.props.time * 1000 
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

const styles= StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
        // padding: 10
    },
    card: {
        // marginTop: 10,
        marginBottom: 8,
        backgroundColor: 'white',
        width: '100%',
        // borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#111',
        shadowOpacity: 0.8,
        elevation: 2
    },
    postText: {
        fontFamily: "OpenSans-Regular",
        fontWeight: '400',
        color: '#000',
        fontSize: 15
    },
    associate: {
        color: '#1c92c4',
        fontWeight: 'bold'
    },
    strength: {
        fontWeight: 'bold',
        fontSize: 15
    },
    like : {
        fontSize: 20,
        color: '#1c92c4'
    },
    unlike: {
        fontSize: 20, 
        color: '#ccc'
    },
    comment: {
        fontSize: 19,
        color: '#ccc'
    },
    infoTab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        width: "100%"
    },
    infoText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 12
    },
    infoNo: {
        fontSize: 13,
        fontFamily: "Roboto-Medium",
        paddingRight: 5
    },
    footerText: {
        fontFamily: "OpenSans-Regular",
        fontSize: 13,
        marginLeft: 11
    },
    footerTextActive: {
        fontFamily: "OpenSans-Regular",
        fontSize: 13,
        marginLeft: 11,
        color: '#1c92c4'
    },
    footerTextInactive: {
        fontFamily: "OpenSans-Regular",
        fontSize: 13,
        marginLeft: 11
    },
    footerConetntView: {
        // width: '35%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = (state) => {
    return {
        userName: state.user.firstName + " " + state.user.lastName,
        associate_id: state.user.associate_id
    };
}

export default connect(mapStateToProps, null)(withNavigation(Post))
