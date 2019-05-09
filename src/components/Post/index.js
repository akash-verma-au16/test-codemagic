import React, { Component } from 'react';
// Components from React-Native
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Components from Native Base
import { Icon } from 'native-base'

// Components from Moment.js
import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            like: false,
            likes: 0
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

    render() {
        this.associateList = []
        return (
            <View style={styles.card} key={this.props.key}>
                <View name='header'
                    style={styles.container}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                        <Text style={{ marginHorizontal: 10, color: '#333', fontWeight: '500', fontSize: 16 }}>{this.props.postCreator}</Text>
                    </View>
                    {/* <Text style={styles.timeStamp}>{item.Item.time}</Text> */}
                    <Moment element={Text} fromNow>{this.props.time * 1000}</Moment>
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
                            this.associateList.push((<Text style={styles.associate} key={index}>@{associate.associate_name + " "}</Text>))
                        })}
                        {this.associateList}
                        {this.props.postMessage}

                        <Text style={styles.strength}> #{this.props.strength}</Text>
                    </Text>
                </View>
                <View style={styles.infoTab}>
                    <View style={{ flexDirection: 'row', width: "20%", alignItems: 'center' }}>
                        <Text style={styles.infoNo}>{this.state.likes}</Text>
                        <Text style={styles.infoText}>{this.state.likes > 1 ? "Likes" : "Like"}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: "20%", alignItems: 'center'}}>
                        <Text style={styles.infoNo}>0</Text>
                        <Text style={styles.infoText}>Comment</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', height: 1 / 3, backgroundColor: '#c9cacc', marginVertical: 5}}></View>
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
                    <TouchableOpacity activeOpacity={0.9} style={styles.footerConetntView}>
                        <Icon name='comment' type={'MaterialIcons'} style={styles.comment} />
                        <Text style={styles.footerText}>Comment</Text>
                    </TouchableOpacity>
                </View>
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
        justifyContent: 'flex-start',
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
        width: '35%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Post;
