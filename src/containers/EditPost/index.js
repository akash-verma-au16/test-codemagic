import React from 'react'
import { View, Text, ScrollView, StyleSheet, Alert, Dimensions, TextInput, Keyboard, BackHandler, ToastAndroid } from 'react-native'
//Native base
import { Icon } from 'native-base'
// Components from Moment.js
import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'
//API methods
import { edit_post } from '../../services/post'

/* Redux */
import { connect } from 'react-redux'

class EditPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            postCreator: this.props.navigation.getParam('associate'),
            postMessage: this.props.navigation.getParam('postMessage'),
            taggedAssociates: this.props.navigation.getParam('taggedAssociates'),
            strength: this.props.navigation.getParam('strength'),
            epoch: this.props.navigation.getParam('time'),
            isChanged: false
        }
        this.associateList=[]

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

    static navigationOptions = ({ navigation }) => {
        return {

            headerRight: (
                navigation.getParam('isChanged') ?
                    <Icon name='md-checkmark' type='Ionicons' style={
                        {
                            color: 'white',
                            margin: 19
                        }
                    } onPress={navigation.getParam('editPostHandler')}
                    />
                    : <View style={{ magin: 19 }}></View>
            ),
            headerLeft: (
                <Icon name='ios-arrow-back' type='Ionicons' style={
                    {
                        color: 'white',
                        padding: 19 
                    }
                } 
                onPress={() => {
                    console.log(navigation.getParam('isChanged'))
                    if (navigation.getParam('isChanged')) {
                        Alert.alert(
                            'Discard Changes?',
                            'Are you sure you want to discard the changes?',
                            [
                                {
                                    text: 'No',
                                    style: 'cancel'
                                },
                                {
                                    text: 'Yes', onPress: () => {
                                        Keyboard.dismiss()
                                        ToastAndroid.showWithGravityAndOffset(
                                            'Changes unsaved',
                                            ToastAndroid.SHORT,
                                            ToastAndroid.BOTTOM,
                                            25,
                                            100,
                                        );
                                        navigation.goBack()
                                    }
                                }
                            ],
                            { cancelable: false },
                        )
                    }
                    else {
                        navigation.goBack()
                    }
                }}
                />
            )
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ isChanged: this.state.isChanged, editPostHandler: this.editPostHandler }); 
        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Keyboard.dismiss()
            this.goBack()
            return true;
        });
    }

    editPostHandler = () => {
        ToastAndroid.showWithGravityAndOffset(
            'Coming soon',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            100,
        );
        // if(this.state.postMessage.length > 0) {
        //     const payload = {
        //         Data: {
        //             post_id: this.props.navigation.getParam('postId'),
        //             tenant_id: this.props.accountAlias,
        //             associate_id: this.props.associate_id,
        //             message: this.state.postMessage,
        //             type: this.props.navigation.getParam('type'),
        //             sub_type: this.state.strength,
        //             ops: "edit_post",
        //             tagged_associates: this.state.taggedAssociates,
        //             privacy: {
        //                 type: "tenant",
        //                 id: this.props.accountAlias
        //             },
        //             time: this.state.epoch
        //         }
        //     }
        //     //Authorization headers
        //     const headers = {
        //         headers: {
        //             Authorization: this.props.idToken
        //         }
        //     }

        //     if (this.props.isConnected) {
        //         try {
        //             edit_post(payload, headers).then((res) => {
        //                 console.log('Edit Post', res)
        //                 if (res.status === 200) {
        //                     // this.props.navigation.state.params.returnData({
        //                     //     message: this.state.postMessage
        //                     // })
        //                     // this.props.navigation.goBack()
        //                 }
        //             }).catch((e) => {
        //                 console.log(e)
        //             })
        //         }
        //         catch (e) {
        //             console.log(e)
        //         }
        //     }
        //     else {
        //         ToastAndroid.showWithGravityAndOffset(
        //             'Please, connect to the internet',
        //             ToastAndroid.SHORT,
        //             ToastAndroid.BOTTOM,
        //             25,
        //             100,
        //         );
        //     }

        //     this.props.navigation.state.params.returnData({
        //         message: this.state.postMessage
        //     })
        //     this.props.navigation.goBack()
        // }
        // else {
        //     ToastAndroid.showWithGravityAndOffset(
        //         'Post cannot be empty',
        //         ToastAndroid.LONG,
        //         ToastAndroid.BOTTOM,
        //         25,
        //         100,
        //     );
        // }
        
    }

    async goBack() {
        if(this.state.isChanged) {
            Alert.alert(
                'Discard Changes?',
                'Are you sure you want to discard the changes?',
                [
                    {
                        text: 'No',
                        style: 'cancel'
                    },
                    {
                        text: 'Yes', onPress: () => {
                            Keyboard.dismiss()
                            ToastAndroid.showWithGravityAndOffset(
                                'Changes unsaved',
                                ToastAndroid.SHORT,
                                ToastAndroid.BOTTOM,
                                25,
                                100,
                            );
                            this.props.navigation.goBack()
                        }
                    }
                ],
                { cancelable: false },
            )
        }
        else {
            await this.props.navigation.goBack()
        }
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    render() {
        this.associateList = []
        return(
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scroll} 
                    keyboardShouldPersistTaps= 'handled'
                >
                    <View style={styles.headerContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
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
                            <Text style={{ marginHorizontal: 10, color: '#333', fontWeight: '500', fontSize: 16 }}>{this.state.postCreator}</Text>
                        </View>
                        <Moment style={{ fontSize: 12 }} element={Text} fromNow>{this.state.epoch * 1000}</Moment>

                    </View>
                    
                    <View style={styles.horizontalLine}></View>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: "100%",
                        padding: 10,
                        paddingHorizontal: 15}}>
                        <Text style={styles.postText}>
                            {this.state.taggedAssociates.map((associate, index) => {
                                this.associateList.push((<Text style={styles.associate} key={index}>@{associate.associate_name + " "}</Text>))
                            })}
                            {this.associateList}
                        </Text>
                        <TextInput
                            placeholder='Edit your message here...'
                            placeholderTextColor='#444'
                            value={this.state.postMessage}
                            autoFocus= {true}
                            style={styles.editPost}
                            multiline={true}
                            selectionColor='#1c92c4'
                            onChangeText={(text) => {
                                this.setState({ postMessage: text, isChanged: true })
                                this.props.navigation.setParams({ isChanged: true });    
                            }}
                        />
                        <Text style={styles.strength}> #{this.state.strength}</Text>
                    </View>
                </ScrollView>

            </View>
        )
    }
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5
    },
    scroll: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "100%",
        paddingHorizontal: 15
    },
    horizontalLine: {
        width: '100%',
        flexDirection: 'row',
        height: 1 / 3,
        backgroundColor: '#c9cacc',
        marginVertical: 5
    },
    editPost: {
        // padding: 10,
        // paddingHorizontal: 15,
        width: "100%",
        textAlign: 'left',
        fontSize: 17
        // backgroundColor: '#efefef'
    },
    associate: {
        color: '#1c92c4',
        fontWeight: 'bold'
    },
    postText: {
        fontFamily: "OpenSans-Regular",
        fontWeight: '400',
        color: '#000',
        fontSize: 15
    },
    strength: {
        color: '#111',
        fontWeight: 'bold',
        fontSize: 17
    }
})

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        emailAddress: state.user.emailAddress,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected,
        idToken: state.user.idToken
    };
}

export default connect(mapStateToProps, null)(EditPost)