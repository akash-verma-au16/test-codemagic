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
import { forceChangePassword } from '../../services/bAuth'

/* Styles */
import styles from '../ForgotPassword/style'
class ForceChangePassword extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isButtonLoading: false,
            otp: "",
            password: "",
            confirmPassword:"",
            shift: new Animated.Value(0),
            fade:new Animated.Value(1)
        }
        this.keyboardDidShowHandler = null
        this.keyboardDidHideHandler = null
        /* Refs are used to redirect the focus to the next component using keyboard button */
        this.textInputPassword = React.createRef();
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

    forceChangePasswordHandler = () => {
        /* Hiding the keyboard to prevent Toast overlap */
        Keyboard.dismiss()
        this.setState({
            isButtonLoading: true
        }, () => {
            try {
                /* extracting data from login page */
                const email = this.props.navigation.getParam('email')
                const accountAlias = this.props.navigation.getParam('accountAlias')
                const oldPassword = this.props.navigation.getParam('password')
                /* check the availability of data */
                if (oldPassword && this.state.confirmPassword && this.state.password && email && accountAlias) {

                    if(this.state.confirmPassword!==this.state.password){
                        Toast.show({
                            text: 'Password and Confirm password does not match',
                            type: 'danger',
                            duration:3000
                        })
                        this.setState({ isButtonLoading: false })
                        return
                    }
                    forceChangePassword({
                        accountAlias: accountAlias,
                        email: email,
                        password: oldPassword,
                        new_password: this.state.password
                    }).then(() => {

                        Toast.show({
                            text: 'Password Changed. Login to Continue...',
                            type: "success"
                        })
                        this.setState({ isButtonLoading: false })
                        this.props.navigation.navigate('LoginPage')
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
                            {/* This wrapper will shrink based on screen size making room for other components */}
                            <View style={styles.imageWrapper}>
                                <Animated.View style={[styles.imageContainer,{opacity:fade}]}>
                                    <Image source={key} style={styles.icon} />
                                </Animated.View>
                            </View>
                            <View
                                style={styles.triangle}
                            />
                            <Animated.View style={[styles.customForm, { transform: [{ translateY: shift }] }]}>
                                <Text style={styles.header}>Enter New Password</Text>
                                <Text style={styles.text}
                                >Your password should contain an uppercase,lowercase,number and special character</Text>
                                <TextInput
                                    placeholder='New Password'
                                    value={this.state.password}
                                    onChangeText={(text) => this.setState({ password: text })}
                                    onSubmitEditing={() => this.textInputPassword._root.focus()}
                                    color='black'
                                    secureTextEntry
                                />
                                <TextInput
                                    placeholder='Confirm Password'
                                    value={this.state.confirmPassword}
                                    onChangeText={(text) => this.setState({ confirmPassword: text })}
                                    inputRef={input => this.textInputPassword = input}
                                    onSubmitEditing={this.forceChangePasswordHandler}
                                    color='black'
                                    secureTextEntry
                                />

                                <RoundButton
                                    onPress={this.forceChangePasswordHandler}
                                    value='Submit'
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

export default connect(mapStateToProps, mapDispatchToProps)(ForceChangePassword)