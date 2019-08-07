import React, { Component } from 'react';
import { View, Text, BackHandler, StyleSheet, Image, Dimensions, ImageBackground, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator, ScrollView, Alert } from 'react-native';
//Emoji images
import not_good from '../../assets/bad_face.png'
import good from '../../assets/smiley_face.png'
import very_good from '../../assets/big_smiley_face.png'
import backgroundImage from '../../assets/rsz_gradient-background.png'

/* Redux */
import { connect } from 'react-redux'

//Services
import feedbackLogger from '../../services/feedbackLogger'

class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackText: "",
            userAns:"",
            activeNotGood: false,
            activeGood: false,
            activeVeryGood: false,
            isLoading: false
        };
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack()
            return true
        })
    }

    goBack() {
        if(this.state.feedbackText !== "" || this.state.userAns !=="") {
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

    submitFeedback = () => {
        
        if(this.state.userAns == "") {
            ToastAndroid.showWithGravityAndOffset(
                'Please share your experience',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
            return
        }

        if(this.state.feedbackText == "") {
            ToastAndroid.showWithGravityAndOffset(
                'Please write something...',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
            return
        }
        this.setState({isLoading: true})

        const payload = {
            tenantId: this.props.accountAlias,
            userName: this.props.firstName + " " + this.props.lastName,
            email: this.props.email,
            userAns: this.state.userAns,
            feedback: this.state.feedbackText
        }

        //Log user feedback to Slack
        feedbackLogger(payload)

        this.setState({isLoading: false})
        this.props.navigation.goBack()
        
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    render() {
        return (
            <ImageBackground source={backgroundImage} style={{ width: '100%', height: '100%' }}>
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                    <Text style={styles.feedbackQue}>
                        What do you think of our App? 
                    </Text>
                    <View style={styles.emojiContainer}>
                        <TouchableOpacity style={styles.emojiView} onPress={() => this.setState({ userAns: "Not Good", activeNotGood: true, activeGood: false, activeVeryGood: false})}>
                            <Image source={not_good} style={styles.emoji}/>
                            <Text style={this.state.activeNotGood ? styles.activeText : styles.inactiveText}>Not Good</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.emojiView} onPress={() => this.setState({ userAns: "Good", activeNotGood: false, activeGood: true, activeVeryGood: false })}>
                            <Image source={good} style={styles.emoji}/>
                            <Text style={this.state.activeGood ? styles.activeText : styles.inactiveText}>Good</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.emojiView} onPress={() => this.setState({ userAns: "Very Good", activeNotGood: false, activeGood: false, activeVeryGood: true})}>
                            <Image source={very_good} style={styles.emoji}/>
                            <Text style={this.state.activeVeryGood ? styles.activeText : styles.inactiveText}>Very Good</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.feedbackView}>
                        <Text style={styles.feedbackQue}>
                            Please share your valuable feedback to us.
                        </Text>
                        <TextInput
                            multiline={true}
                            onChangeText={(text) => this.setState({ feedbackText: text })}
                            value={this.state.feedbackText}
                            style={styles.feedbackInput}
                            placeholder='Write your feedback here...'
                            placeholderTextColor='rgba(0, 0, 0, 0.3)'
                            selectionColor='#47309C' 
                            maxLength={200}
                        />
                    </View> 
                    <View style={{flex: 1, justifyContent: 'flex-end', width: '100%'}}>
                        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={this.submitFeedback}>
                            {
                                this.state.isLoading ?
                                    <ActivityIndicator size="small" color="#47309C" />
                                    :
                                    <Text style={styles.signUp}>SUBMIT</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', 
        justifyContent:'flex-start',
        padding: 20,
        width: Dimensions.get('window').width
    },
    feedbackQue: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: '500',
        marginTop: 50
    },
    emojiContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20
    },
    emojiView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    emoji:{
        height: 30,
        width: 30
    },
    inactiveText: {
        fontSize: 17,
        color: '#a1a1a1',
        textAlign: 'center'
    },
    activeText: {
        fontSize: 19,
        color: '#FFF',
        textAlign: 'center'
    },
    feedbackInput: {
        fontSize: 17,
        color: '#000',
        borderWidth: 1,
        borderColor:'#fbfbfb',
        width: '100%',
        backgroundColor: '#fafafa',
        marginTop: 20,
        justifyContent: 'flex-start',
        height: 180,
        textAlignVertical: "top",
        borderRadius: 7
    },
    feedbackView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: "100%"
    },
    button: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 7,
        marginTop: 15,
        alignSelf: 'flex-end'
    },
    signUp: {
        color: '#47309C',
        fontWeight: 'bold',
        fontSize: 21
    }
})

const mapStateToProps = (state) => {
    return {
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        isAuthenticate: state.isAuthenticate,
        isConnected: state.system.isConnected,
        email: state.user.emailAddress,
        accountAlias: state.user.accountAlias
    };
}

export default connect(mapStateToProps, null)(Feedback)