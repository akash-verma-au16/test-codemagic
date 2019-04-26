import React, { Component } from 'react';
// Components from React-Native
import { View, Text, StyleSheet } from 'react-native';
// Components from Native Base
import { Icon, Toast } from 'native-base'

// Components from Moment.js
import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    commingSoon = () => {
        Toast.show({
            text: "Coming Soon",
            type: 'success',
            duration: 3000
        })
    }
    render() {
        return (
            <View style={styles.card} key={this.props.key}>
                <View name='header'
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                        // padding: 10
                    }}
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
                        <Text style={{ marginHorizontal: 10, color: '#333', fontWeight: '500', fontSize: 16 }}>{item.Item.associate_name}</Text>
                    </View>
                    {/* <Text style={styles.timeStamp}>{item.Item.time}</Text> */}
                    <Moment element={Text} fromNow>{item.Item.time * 1000}</Moment>
                </View>
                {/* <View style={{
                        backgroundColor: '#ddd',
                        height: 1,
                        width: '100%',
                        marginVertical: 10
                    }} /> */}
                <View name='content' style={{ flex: 2, paddingVertical: 6 }}>
                    <Text style={styles.postText}>

                        {item.Item.tagged_associates.map((associate, index) => {
                            associateList.push((<Text style={styles.associate} key={index}>@{associate.associate_name + " "}</Text>))
                        })}
                        {associateList}
                        {item.Item.message}

                        <Text style={styles.strength}> #{item.Item.sub_type}</Text>
                    </Text>
                </View>
                <View name='footer'
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                    <Icon name='md-thumbs-up' style={{ fontSize: 20, color: '#ddd' }} onPress={this.commingSoon} />
                </View>
            </View>
        );
    }
}


const styles= StyleSheet.create({
    card: {
        // marginTop: 10,
        marginBottom: 8,
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 5,
        padding: 15,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
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
})

export default Post;
