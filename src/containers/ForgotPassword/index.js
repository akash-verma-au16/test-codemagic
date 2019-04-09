import React from 'react';
import {
    Keyboard,
    ImageBackground,
    Image,
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
import image from '../../assets/image.png'
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

        /* Refs are used to redirect the focus to the next component using keyboard button */
        this.textInputAccountAlias = React.createRef();
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
                if (this.state.accountAlias && this.state.email) {
                    if(this.props.isConnected) {
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
                            text: 'Please, connect to the internet',
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
                    text: 'Something went wrong',
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