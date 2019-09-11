import React from 'react';
import {
    Keyboard,
    ImageBackground,
    TouchableOpacity,
    Animated,
    Alert,
    BackHandler
} from 'react-native';
import {
    Form,
    Container,
    Content,
    Toast,
    View,
    Text,
    Icon
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
import image from '../../assets/rsz_gradient-background.png'
import key from '../../assets/key.png'
/* Services */
import { confirmPassword } from '../../services/bAuth'
/* Styles */
import styles from '../ForgotPassword/style'
class ConfirmPassword extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isButtonLoading: false,
            otp: "",
            password: "",
            shift: new Animated.Value(0),
            fade:new Animated.Value(1)
        }
        this.message = this.props.navigation.getParam('message', 'We have sent OTP to your registered mobile number. Please check your message inbox')
        /* Refs are used to redirect the focus to the next component using keyboard button */
        this.textInputOtp = React.createRef();
        this.textInputPassword = React.createRef();
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            
            Alert.alert(
                'Are you sure?',
                'Otp has already been sent and will expire after going back',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'OK', onPress: () => {
                            this.props.navigation.navigate('LoginPage')
                        }
                    }
                ],
                { cancelable: false },
            )
            return true
        })
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }
    
    confirmPasswordHandler = () => {
        /* Hiding the keyboard to prevent Toast overlap */
        Keyboard.dismiss()
        this.setState({
            isButtonLoading: true
        }, () => {
            try {
                const email = this.props.navigation.getParam('email')

                if (this.state.otp && this.state.password && email) {
                    if(this.props.isConnected) {
                        confirmPassword({
                            email: email,
                            password: this.state.password,
                            otp: this.state.otp
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
                            text: 'Please connect to the internet',
                            type: "danger"
                        })
                        this.setState({ isButtonLoading: false })
                    }
                    
                } else {
                    Toast.show({
                        text: 'All fields are required',
                        type: "danger"
                    })
                    this.setState({ isButtonLoading: false })
                }

            } catch (error) {
                Toast.show({
                    text: 'Something went wrong.', // Please connect to the internet
                    type: "danger"
                })
                this.setState({ isButtonLoading: false })
            }
        })
    }

    render() {
        const { fade } = this.state;
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
                                    <Icon name='ios-keypad' style={styles.icon} />
                                </Animated.View>
                            </View>
                            <View
                                style={styles.triangle}
                            />
                            <Animated.View style={styles.customForm}>
                                <Text style={styles.header}>Enter OTP</Text>
                                <Text style={styles.text}
                                >{this.message}</Text>
                                <TextInput
                                    placeholder='One Time Password'
                                    value={this.state.otp}
                                    onChangeText={(text) => this.setState({ otp: text })}
                                    inputRef={input => this.textInputOtp = input}
                                    onSubmitEditing={() => this.textInputPassword._root.focus()}
                                    color='black'
                                    keyboardType='numeric'
                                />
                                <TextInput
                                    placeholder='New Password'
                                    value={this.state.password}
                                    onChangeText={(text) => this.setState({ password: text })}
                                    inputRef={input => this.textInputPassword = input}
                                    onSubmitEditing={this.confirmPasswordHandler}
                                    color='black'
                                    secureTextEntry
                                />

                                <RoundButton
                                    onPress={this.confirmPasswordHandler}
                                    value='Submit'
                                    isLoading={this.state.isButtonLoading}
                                    isLight={false}
                                />
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.navigationLink}>Back to Forgot Password</Text>
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
        isAuthenticate: state.isAuthenticate,
        isConnected: state.system.isConnected
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        authenticate: (props) => dispatch({ type: auth.AUTHENTICATE_USER, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPassword)