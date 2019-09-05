import React from 'react';
import {
    Keyboard,
    ImageBackground,
    TouchableOpacity,
    Animated,
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
            email: this.props.navigation.getParam('email',''),
            shift: new Animated.Value(0),
            fade:new Animated.Value(1)
        }

        /* Refs are used to redirect the focus to the next component using keyboard button */
        this.textInputEmail = React.createRef(); 
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('LoginPage')
            return true
        })
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }
    forgotPasswordHandler = () => {
        /* Hiding the keyboard to prevent Toast overlap */
        Keyboard.dismiss()
        this.setState({
            isButtonLoading: true
        }, () => {
            try {
                if (this.state.email) {
                    forgotPassword({
                        email: this.state.email
                    }).then((res) => {
                        Toast.show({
                            text: 'OTP has been sent',
                            type: "success"
                        })

                        this.props.navigation.navigate('ConfirmPassword', {
                            email: this.state.email,
                            message: res.data.message
                        })
                        this.setState({ isButtonLoading: false })
                    }).catch((error) => {
                        this.setState({ isButtonLoading: false })
                        if (this.props.isConnected && error.response.data.code) {
                            Toast.show({
                                text: error.response.data.message,
                                type: "danger"
                            })
                        } else if (!this.props.isConnected) {
                            Toast.show({
                                text: 'Please, connect to the internet',
                                type: "danger"
                            })
                        }else {
                            Toast.show({
                                text: 'Invalid Credentials',
                                type: "danger"
                            })
                        }

                        this.setState({ isButtonLoading: false })
                    })  
                    
                } else {
                    Toast.show({
                        text: 'Please enter an email',
                        type: "danger"
                    })
                    this.setState({ isButtonLoading: false })
                }

            } catch (error) {
                Toast.show({
                    text: error.response.data.code,
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
                            <View style={styles.imageWrapper}>
                                {/* This wrapper will shrink based on screen size making room for other components */}
                                <Animated.View style={[styles.imageContainer,{opacity:fade}]}>
                                    <Icon name='ios-key' style={styles.icon} />
                                </Animated.View>
                            </View>
                            <View
                                style={styles.triangle}
                            />
                            <Animated.View style={styles.customForm}>
                                <Text style={styles.header}>Forgot Password?</Text>
                                <Text style={styles.text}
                                >We just need your registered Email id to send you password reset instructions</Text>

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
                                    isLight={false}
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
        isAuthenticate: state.isAuthenticate,
        isConnected: state.system.isConnected
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        authenticate: (props) => dispatch({ type: auth.AUTHENTICATE_USER, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)