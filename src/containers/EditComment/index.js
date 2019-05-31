import React from 'react'
import { View, Text, ScrollView, StyleSheet, ToastAndroid, Keyboard, Alert, Dimensions, TextInput, BackHandler } from 'react-native'
//Native base
import { Icon } from 'native-base'
// Components from Moment.js
import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'
// API Methods
import { edit_comment } from '../../services/comments'
/* Redux */
import { connect } from 'react-redux'

class EditComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            associate: this.props.navigation.getParam('associate'),
            comment: this.props.navigation.getParam('comment'),
            epoch: this.props.navigation.getParam('time'),
            isChanged: false
        }
        console.log("Input epoch:", this.state.epoch)

        this.associateList = []

        this.textInputRef = React.createRef();

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

        console.log(this.state)
    }

    static navigationOptions = ({ navigation }) => {
        return {

            headerRight: (
                <Icon name='md-checkmark' type='Ionicons' style={
                    {
                        color: 'white',
                        margin: 19
                    } 
                } onPress={navigation.getParam('editCommentHandler')}
                />
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
        this.props.navigation.setParams({ isChanged: this.state.isChanged, editCommentHandler: this.editCommentHandler });        
        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });
    }

    editCommentHandler = () => {
        console.log("Input epoch:", this.state.epoch)
        const payload = {
            "Data": {
                "post_id": this.props.navigation.getParam('postId'),
                "tenant_id": this.props.accountAlias,
                "ops": "update_comment",
                "comment": {
                    "comment_id": this.props.navigation.getParam('commentId'),
                    "associate_id": this.props.associate_id,
                    "time": this.state.epoch,
                    "message": this.state.comment
                }
            }
        }
        console.log('Data', payload)
        //Authorization headers
        const headers = {
            headers: {
                Authorization: this.props.idToken
            }
        }
        if (this.props.isConnected) {
            try {
                edit_comment(payload, headers).then((res) => {
                    console.log('Edit comment', res)
                    if(res.status === 200) {
                        this.props.navigation.state.params.returnData({
                            message: this.state.comment
                        })
                        this.props.navigation.goBack()
                    }
                }).catch((e) => {
                    console.log(e)
                })
            }
            catch(e) {
                console.log(e)
            }
        }
        else {
            ToastAndroid.showWithGravityAndOffset(
                'Please, connect to the internet',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
        }
    }

    goBack() {
        if (this.state.isChanged) {
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
            this.props.navigation.goBack()
        }
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    render() {
        this.associateList = []
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scroll} 
                    keyboardShouldPersistTaps="handled"
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
                            <Text style={{ marginHorizontal: 10, color: '#333', fontWeight: '500', fontSize: 16 }}>{this.state.associate}</Text>
                        </View>
                        <Moment style={{ fontSize: 12 }} element={Text} fromNow>{this.state.epoch * 1000}</Moment>

                    </View>

                    <View style={styles.horizontalLine}></View>
                    
                    <TextInput 
                        placeholder='Edit your comment...'
                        placeholderTextColor='#444'
                        value={this.state.comment}
                        autoFocus={true} 
                        blurOnSubmit={false}
                        style={styles.editComment}
                        multiline={true}
                        selectionColor='#1c92c4'
                        onChangeText={(text) => {
                            this.setState({ comment: text, isChanged: true })
                            this.props.navigation.setParams({ isChanged: this.state.isChanged });  
                        }}
                    />

                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5
    },
    scroll: {
        alignItems: 'center',
        justifyContent: 'flex-start'
        // width: Dimensions.get('window').width
    },
    headerContainer: {
        flex: 1,
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
    editComment: {
        padding: 10,
        paddingHorizontal: 15,
        width: "100%",
        textAlign: 'left',
        fontSize: 17
        // backgroundColor: '#efefef'
    }
})

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isConnected: state.system.isConnected,
        idToken: state.user.idToken
    };
}

export default connect(mapStateToProps, null)(EditComment) 