import React from 'react';
import {
    StyleSheet,
    Keyboard,
    ImageBackground,
    TouchableOpacity,
    Animated,
    BackHandler
} from 'react-native';

/* Native Base */
import {
    Form,
    Container,
    Content,
    Toast,
    Text,
    View
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
/* Services */
import { login } from '../../services/bAuth'
import { read_member } from '../../services/tenant'
import { configureFirebase } from '../../services/firebase'
/* Utilities */
import toSentenceCase from '../../utilities/toSentenceCase'
import clearStackNavigate from '../../utilities/clearStackNavigate'
class LoginPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isShowingKeyboard: false,
            isSignInLoading: false,
            accountAlias: "",
            email: "",
            password: "",
            logoShift: new Animated.Value(-50),
            logoFade: new Animated.Value(0),
            sloganFade: new Animated.Value(0)
        }

        /* Refs are used to redirect the focus to the next component using keyboard button */
        this.textInputAccountAlias = React.createRef();
        this.textInputEmail = React.createRef();
        this.textInputPassword = React.createRef();
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true
        })
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }
    loadComponents = () => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(
                    this.state.logoShift,
                    {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    this.state.logoFade,
                    {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true
                    }
                )
            ]),
            Animated.timing(
                this.state.sloganFade,
                {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }
            )
        ]).start()
    }

    forgotPasswordHandler=()=>{
        this.setState({password:''})
        this.props.navigation.navigate('ForgotPassword',{
            accountAlias: this.state.accountAlias,
            email: this.state.email
        })
    }
    signinHandler = () => {
        /* Hiding the keyboard to prevent Toast overlap */
        Keyboard.dismiss()
        this.setState({
            isSignInLoading: true
        }, () => {
            try {
                if (this.state.accountAlias && this.state.email && this.state.password) {
                    login({
                        accountAlias: this.state.accountAlias,
                        email: this.state.email,
                        password: this.state.password
                    }).then((response) => {
                        /* Restricting Super Admin Access as no Tenant Name is available to fetch */
                        if (this.state.accountAlias.trim().toLowerCase() === 'default') {
                            Toast.show({
                                text: 'No Access for Super Admin',
                                type: "danger"
                            })
                            this.setState({ isSignInLoading: false })
                            return
                        }

                        read_member({
                            tenant_id: this.state.accountAlias.toLowerCase().trim(),
                            email: this.state.email.toLowerCase().trim()
                        }).then(res => {
                            let firstName = toSentenceCase(response.data.payload.idToken.payload.given_name);
                            let lastName = toSentenceCase(response.data.payload.idToken.payload.family_name);
                            const payload = {
                                accountAlias: this.state.accountAlias.toLowerCase().trim(),
                                tenant_name: this.state.accountAlias.toLowerCase().trim(),
                                associate_id:res.data.data.associate_id,
                                firstName: firstName,
                                lastName: lastName,
                                phoneNumber: response.data.payload.idToken.payload.phone_number,
                                emailAddress: response.data.payload.idToken.payload.email.toLowerCase()
                            };
                            Toast.show({
                                text: 'Welcome ' + response.data.payload.idToken.payload.given_name + '!',
                                type: "success"
                            })
                            this.props.authenticate(payload);
                            //configure firebase for push notification
                            const email=this.state.email.toLowerCase().trim()
                            configureFirebase({
                                firstName,
                                lastName,
                                email
                            })
                            clearStackNavigate('TabNavigator', this.props)
                            
                        }).catch((error) => {
                            
                            Toast.show({
                                text: error.response.data.code,
                                type: 'danger',
                                duration:3000
                            })
                            this.setState({ isSignInLoading: false });
                        })
                    }).catch((error) => {
                        try {
                            switch (error.response.data.code) {
                            case "ForceChangePassword":
                                
                                Toast.show({
                                    text: 'Please change the password to continue',
                                    type: 'success',
                                    duration: 3000
                                })
                                /* navigate to forceChangePassword */
                                this.props.navigation.navigate('ForceChangePassword', {
                                    accountAlias: this.state.accountAlias,
                                    email: this.state.email,
                                    password:this.state.password
                                })
                                break;
                            case "ResourceNotFoundException":
                                Toast.show({
                                    text: 'Account not found please contact your administrator',
                                    type: 'danger',
                                    duration:3000
                                })
                                break;
                            case "TenantDoesNotExist":
                                Toast.show({
                                    text: 'Account not found please contact your administrator',
                                    type: 'danger',
                                    duration:3000
                                })
                                break;
                            case "UserNotFound":
                                Toast.show({
                                    text: 'Invalid username or password',
                                    type: 'danger',
                                    duration:3000
                                })
                                break;
                            default:
                                Toast.show({
                                    text: error.response.data.message,
                                    type: 'danger',
                                    duration:3000
                                })
                            }

                        } catch (error) {
                            Toast.show({
                                text: 'Please check your internet connection',
                                type: 'danger',
                                duration:3000
                            })
                        }
                        this.setState({ isSignInLoading: false })
                    })
                } else {
                    Toast.show({
                        text: 'All fields are required',
                        type: "danger"
                    })
                    this.setState({ isSignInLoading: false })
                }
            } catch (error) {
                Toast.show({
                    text: 'Please check your internet connection',
                    type: "danger"
                })
                this.setState({ isSignInLoading: false })
            }
        })
    }

    render() {
        const { logoFade, logoShift, sloganFade } = this.state
        return (

            <Container>
                <Content
                    contentContainerStyle={styles.container}
                    
                >
                    <ImageBackground
                        source={image}
                        style={styles.image}
                        onLoadEnd={this.loadComponents}
                    >

                        <Form style={styles.form}>
                            <Animated.View style={[{ transform: [{ translateY: logoShift }], opacity: logoFade, alignItems: 'center' }]}>
                                <Logo />
                                <Animated.View style={{ opacity: sloganFade }}>
                                    <Slogan style={{ marginBottom: 15 }} />
                                </Animated.View>

                            </Animated.View>
                            <View style={styles.container} ></View>

                            <Animated.View style={[{ alignItems: 'center' }, { opacity: logoFade }]}>
                                <TextInput
                                    placeholder='Account Alias'
                                    value={this.state.accountAlias}
                                    onChangeText={(text) => this.setState({ accountAlias: text })}
                                    inputRef={input => this.textInputAccountAlias = input}
                                    onSubmitEditing={() => this.textInputEmail._root.focus()}
                                />

                                <TextInput
                                    placeholder='Username'
                                    value={this.state.email}
                                    onChangeText={(text) => this.setState({ email: text })}
                                    inputRef={input => this.textInputEmail = input}
                                    onSubmitEditing={() => this.textInputPassword._root.focus()}
                                />
                                <TextInput
                                    placeholder='Password'
                                    value={this.state.password}
                                    onChangeText={(text) => this.setState({ password: text })}
                                    inputRef={input => this.textInputPassword = input}
                                    onSubmitEditing={this.signinHandler}
                                    secureTextEntry
                                />
                                <RoundButton
                                    onPress={this.signinHandler}
                                    value='Sign In Now!'
                                    isLoading={this.state.isSignInLoading}
                                />
                                <TouchableOpacity onPress={this.forgotPasswordHandler}>
                                    <Text style={styles.navigationLink}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </Form>

                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    form: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        paddingTop: 70
    },
    image: {
        width: '100%',
        height: '100%'
    },
    navigationLink: {
        color: '#fff',
        marginBottom: 15
    }
});

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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)