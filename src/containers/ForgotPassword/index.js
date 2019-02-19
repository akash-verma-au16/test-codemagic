import React from 'react';
import {
    Keyboard,
    ImageBackground,
    Image,
    TouchableOpacity,
    Animated,
    Platform
} from 'react-native';
import {
    Form,
    Container,
    Content,
    Toast,
    View,
    Text
} from 'native-base';
/* Redux */
import { connect } from 'react-redux'
import { auth } from '../../store/actions'
/* Custom components */
import Logo from '../../components/Logo'
import Slogan from '../../components/Slogan'
import TextInput from '../../components/TextInput'
import RoundButton from '../../components/RoundButton'
/* Assets */
import image from '../../assets/image.jpg'
import key from '../../assets/key.png'
/* Services */
import { forgotPassword } from '../../services/bAuth'
/* Styles */
import styles from './style'

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props)
        /* prepopulate fields if data is available */
        this.state = {
            isButtonLoading: false,
            accountAlias: this.props.navigation.getParam('accountAlias',''),
            email: this.props.navigation.getParam('email',''),
            shift: new Animated.Value(0),
            fade:new Animated.Value(1)
        }
        this.keyboardDidShowHandler = null
        this.keyboardDidHideHandler = null
        /* Refs are used to redirect the focus to the next component using keyboard button */
        this.textInputAccountAlias = React.createRef();
        this.textInputEmail = React.createRef(); 
    }

    componentDidMount() {
        /*Custom logic for android as scroll is handled by content container on IOS */
        if (Platform.OS === 'android') {
            this.keyboardDidShowHandler = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow)
            this.keyboardDidHideHandler = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide)
        }
    }

    handleKeyboardDidShow = (event) => {
        const keyboardHeight = event.endCoordinates.height;
        Animated.parallel([
            Animated.timing(
                this.state.shift,
                {
                    toValue: -keyboardHeight,
                    duration: 500,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                this.state.fade,
                {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                }
            )
        ]).start()
        
    }

    handleKeyboardDidHide = () => {

        Animated.parallel([
            Animated.timing(
                this.state.shift,
                {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                }
            ),Animated.timing(
                this.state.fade,
                {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                }
            )
        ]).start();
        
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            this.keyboardDidShowHandler.remove()
            this.keyboardDidHideHandler.remove()
        }
    }

    forgotPasswordHandler = () => {
        /* Hiding the keyboard to prevent Toast overlap */
        Keyboard.dismiss()
        this.setState({
            isButtonLoading: true
        }, () => {
            try {
                if (this.state.accountAlias && this.state.email) {
                    forgotPassword({
                        accountAlias: this.state.accountAlias,
                        email: this.state.email
                    }).then(() => {

                        Toast.show({
                            text: 'OTP has been sent',
                            type: "success"
                        })

                        this.props.navigation.navigate('ConfirmPassword', {
                            accountAlias: this.state.accountAlias,
                            email: this.state.email
                        })
                        this.setState({ isButtonLoading: false })
                    }).catch((error) => {
                        if (error.response.data.code) {
                            Toast.show({
                                text: error.response.data.message,
                                type: "danger"
                            })
                        } else {
                            Toast.show({
                                text: 'Invalid Credentials',
                                type: "danger"
                            })
                        }

                        this.setState({ isButtonLoading: false })
                    })
                } else {
                    Toast.show({
                        text: 'All fields are required',
                        type: "danger"
                    })
                    this.setState({ isButtonLoading: false })
                }

            } catch (error) {
                Toast.show({
                    text: 'Please check your internet connection',
                    type: "danger"
                })
                this.setState({ isButtonLoading: false })
            }
        })
    }

    render() {
        const { shift,fade } = this.state;
        return (
            <Container>
                <Content
                    contentContainerStyle={styles.container}
                >
                    <ImageBackground
                        source={image}
                        style={styles.image}
                    >

                        <Form style={styles.form}>

                            <Logo />

                            <Slogan />
                            <View style={styles.imageWrapper}>
                                {/* This wrapper will shrink based on screen size making room for other components */}
                                <Animated.View style={[styles.imageContainer,{opacity:fade}]}>
                                    <Image source={key} style={styles.icon} />
                                </Animated.View>
                            </View>
                            <View
                                style={styles.triangle}
                            />
                            <Animated.View style={[styles.customForm, { transform: [{ translateY: shift }] }]}>
                                <Text style={styles.header}>Forgot Password?</Text>
                                <Text style={styles.text}
                                >We just need your registered Email id to send you password reset instructions</Text>
                                <TextInput
                                    placeholder='Account Alias'
                                    value={this.state.accountAlias}
                                    onChangeText={(text) => this.setState({ accountAlias: text })}
                                    inputRef={input => this.textInputAccountAlias = input}
                                    onSubmitEditing={() => this.textInputEmail._root.focus()}
                                    color='black'
                                />

                                <TextInput
                                    placeholder='Registered Email Id'
                                    value={this.state.email}
                                    onChangeText={(text) => this.setState({ email: text })}
                                    inputRef={input => this.textInputEmail = input}
                                    onSubmitEditing={this.forgotPasswordHandler}
                                    color='black'
                                />

                                <RoundButton
                                    onPress={this.forgotPasswordHandler}
                                    value='Reset Password'
                                    isLoading={this.state.isButtonLoading}
                                />
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginPage')}>
                                    <Text style={styles.navigationLink}>Back to Login Page</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </Form>

                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticate: state.isAuthenticate
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        authenticate: (props) => dispatch({ type: auth.AUTHENTICATE_USER, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)