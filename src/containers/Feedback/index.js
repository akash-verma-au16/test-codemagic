import React, { Component } from 'react';
import { View, Text, BackHandler, StyleSheet, Image, Dimensions, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
//Emoji images
import not_good from '../../assets/bad_face.png'
import good from '../../assets/smiley_face.png'
import very_good from '../../assets/big_smiley_face.png'
import backgroundImage from '../../assets/rsz_gradient-background.png'

export default class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackText: ""
        };
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    render() {
        return (
            <ImageBackground source={backgroundImage} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <Text style={styles.feedbackQue}>
                        What do you think of our App? 
                    </Text>
                    <View style={styles.emojiContainer}>
                        <View style={styles.emojiView}>
                            <Image source={not_good} style={styles.emoji}/>
                            <Text style={styles.emojiText}>Not Good</Text>
                        </View>
                        <View style={styles.emojiView}>
                            <Image source={good} style={styles.emoji}/>
                            <Text style={styles.emojiText}>Good</Text>
                        </View>
                        <View style={styles.emojiView}>
                            <Image source={very_good} style={styles.emoji}/>
                            <Text style={styles.emojiText}>Very Good</Text>
                        </View>
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
                        <TouchableOpacity style={styles.button} activeOpacity={0.9}>
                            <Text style={styles.signUp}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
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
    emojiText: {
        fontSize: 18,
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
        marginTop: 15
    },
    signUp: {
        color: '#47309C',
        fontWeight: 'bold',
        fontSize: 21
    }
})