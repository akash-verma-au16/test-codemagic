import React from 'react';
import {
    StyleSheet,
    Keyboard,
    Image,
    TouchableOpacity,
    Animated,
    BackHandler,
    ToastAndroid,
    AsyncStorage,
    Platform
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

import { file_download } from '../../services/profile'
import {user} from '../../store/actions'
/* Redux */
import { connect } from 'react-redux'
import { auth } from '../../store/actions'
/* Custom components */
// import Logo from '../../components/Logo'
// import Slogan from '../../components/Slogan'
import TextInput from '../../components/TextInput'
import RoundButton from '../../components/RoundButton'

/* Assets */
// import image from '../../assets/image.png'
import logo from '../../assets/Logo_High_black.png'
/* Services */
import { login } from '../../services/bAuth'
import { read_member, read_tenant } from '../../services/tenant'
/* Utilities */
import toSentenceCase from '../../utilities/toSentenceCase'
/* Push notification */
import {register_device} from '../../services/pushNotification'
import { get_associate_name } from '../../services/post'
import slackLogger from '../../services/slackLogger'
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
        this.tenantName = ""
        /* Refs are used to redirect the focus to the next component using keyboard button */
        this.textInputAccountAlias = React.createRef();
        this.textInputEmail = React.createRef();
        this.textInputPassword = React.createRef();
        this.associateList = {}
        this.getAssociateNames = this.getAssociateNames.bind(this)
        
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
        // Animated.sequence([
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
        ]).start()
        // Animated.timing(
        //     this.state.sloganFade,
        //     {
        //         toValue: 1,
        //         duration: 500,
        //         useNativeDriver: true
        //     }
        // )
        // ]).start()
    }

    getAssociateNames = async (tenantId) => {
        try {
            await get_associate_name({ tenant_id: tenantId }).then((res) => {
                res.data.data.map((item) => {
                    this.associateList[item.associate_id] = item.full_name
                })
            })  
        }
        catch(e) {/* error */}
    }

    forgotPasswordHandler=()=>{
        this.setState({password:''})
        this.props.navigation.navigate('ForgotPassword',{
            accountAlias: this.state.accountAlias,
            email: this.state.email
        })
    }

    sendToken = async (payload) => {
        try {
            //Check if previous token exists
            const token = await AsyncStorage.getItem('token');

            if (token) {
                // We have token!!
                const payload_2 = {
                    tenant_id : payload.accountAlias,
                    associate_id:payload.associate_id,
                    platform : Platform.OS,
                    device_token : token
                }
                register_device(payload_2)
                //Send token to slack
                slackLogger({
                    name: payload.firstName + ' ' + payload.lastName,
                    email: payload.emailAddress,
                    platform: Platform.OS,
                    token: token
                })
            } else {
                //Show warning
                alert('We were unable to register your device for push notifications, Please restart the app and check for working internet connection.')
                return false
            }
            
        } catch (error) {
            // Error retrieving data
        }
    }
    /* Get image from S3 */
    handleImageDownload = () => { 
        /* Request image*/
        const payload = {
            tenant_name: this.props.tenant_name + this.props.accountAlias,
            file_name: 'logo.png',
            associate_email: this.props.email
        }
        file_download(payload).then((response) => {
            this.props.imageUrl(response.data.data['download-signed-url'])
        }).catch(() => {
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
                        read_tenant({
                            tenant_id: this.state.accountAlias.toLowerCase().trim()
                        },{
                            headers: {
                                Authorization: response.data.payload.idToken.jwtToken
                            }
                        }).then(async(tenantRes) => {
                            await this.getAssociateNames(this.state.accountAlias)
                            // this.tenantName = tenantRes.data.data[0].tenant_name
                            if (tenantRes.data.data[0].is_disabled) {
                                ToastAndroid.showWithGravityAndOffset(
                                    'No Internet Connection',
                                    ToastAndroid.LONG,
                                    ToastAndroid.TOP,
                                    25,
                                    100,
                                );
                            } else {
                                read_member({
                                    tenant_id: this.state.accountAlias.toLowerCase().trim(),
                                    email: this.state.email.toLowerCase().trim()
                                }, {
                                    headers: {
                                        Authorization: response.data.payload.idToken.jwtToken
                                    }
                                }).then(res => {
                                    let firstName = toSentenceCase(response.data.payload.idToken.payload.given_name);
                                    let lastName = toSentenceCase(response.data.payload.idToken.payload.family_name);
                                    const payload = {
                                        accountAlias: this.state.accountAlias.toLowerCase().trim(),
                                        tenant_name: tenantRes.data.data[0].tenant_name,
                                        associate_id: res.data.data.associate_id,
                                        firstName: firstName,
                                        lastName: lastName,
                                        phoneNumber: response.data.payload.idToken.payload.phone_number,
                                        emailAddress: response.data.payload.idToken.payload.email.toLowerCase(),
                                        idToken: response.data.payload.idToken.jwtToken,
                                        associateList: this.associateList

                                    };
                                   
                                    this.props.authenticate(payload);
                                    //Activate Push Notofication
                                    this.handleImageDownload()
                                    if(!this.sendToken(payload))
                                        return
                                    this.props.navigation.navigate('TabNavigator')
                                }).catch((error) => {
                                    this.setState({ isSignInLoading: false });
                                    if (this.props.isConnected) {
                                        Toast.show({
                                            text: error.response.data.code,
                                            type: 'danger',
                                            duration: 3000
                                        })
                                    }
                                    else {
                                        Toast.show({
                                            text: 'Please connect to the internet.',
                                            type: 'danger',
                                            duration: 3000
                                        })
                                    }
                                })
                            }

                        }).catch(() => {
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
                                    password: this.state.password
                                })
                                break;
                            case "ResourceNotFoundException":
                                Toast.show({
                                    text: 'Account not found please contact your administrator',
                                    type: 'danger',
                                    duration: 3000
                                })
                                break;
                            case "TenantDoesNotExist":
                                Toast.show({
                                    text: 'Tenant does not exist',
                                    type: 'danger',
                                    duration: 3000
                                })
                                break;
                            case "UserNotFound":
                                Toast.show({
                                    text: 'Invalid username',
                                    type: 'danger',
                                    duration: 3000
                                })
                                break;
                            default:
                                Toast.show({
                                    text: error.response.data.message,
                                    type: 'danger',
                                    duration: 3000
                                })
                            }

                        } catch (error) {
                            Toast.show({
                                text: 'Please check your internet connection',
                                type: 'danger',
                                duration: 3000
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
                    text: "Something went wrong, please try again later.",
                    type: "danger"
                })
                this.setState({ isSignInLoading: false })
            }
        })
    }

    render() {
        const { logoFade, logoShift } = this.state //sloganFade removed
        return (

            <Container>
                <Content
                    contentContainerStyle={styles.container} >
                    <View
                        style={styles.image}
                        onLayout={this.loadComponents}
                    >
                        <Form style={styles.form}>
                            <Animated.View style={[{ transform: [{ translateY: logoShift }], opacity: logoFade, alignItems: 'center' }]}>
                                
                                <Image 
                                    // source={require('../../assets/Logo_High_black.png')} 
                                    source={logo}
                                    resizeMode= {'cover'}
                                    style = {{height: 250, aspectRatio: 1 / 1}}
                                />

                            </Animated.View>
                            <View style={styles.container} ></View>

                            <Animated.View style={[{ alignItems: 'center' }, { opacity: logoFade }]}>
                                <TextInput
                                    placeholder='Account Alias'
                                    value={this.state.accountAlias}
                                    onChangeText={(text) => this.setState({ accountAlias: text })}
                                    inputRef={input => this.textInputAccountAlias = input}
                                    onSubmitEditing={() => this.textInputEmail._root.focus()} 
                                    style={styles.color111}
                                />

                                <TextInput
                                    placeholder='Username'
                                    value={this.state.email}
                                    onChangeText={(text) => this.setState({ email: text })}
                                    inputRef={input => this.textInputEmail = input}
                                    onSubmitEditing={() => this.textInputPassword._root.focus()}
                                    keyboardType={'email-address'} 
                                    style={styles.color111}
                                />
                                <TextInput
                                    placeholder='Password'
                                    value={this.state.password}
                                    onChangeText={(text) => this.setState({ password: text })}
                                    inputRef={input => this.textInputPassword = input}
                                    onSubmitEditing={this.signinHandler} 
                                    style={styles.color111}
                                    secureTextEntry
                                />
                                <RoundButton
                                    onPress={this.signinHandler}
                                    value='Sign In Now!'
                                    isLoading={this.state.isSignInLoading}
                                    // isLight={true}
                                />
                                <TouchableOpacity onPress={this.forgotPasswordHandler}>
                                    <Text style={styles.navigationLink}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </Form>
                    </View>
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
        paddingTop: 0
    },
    image: {
        width: '100%',
        height: '100%'
    },
    navigationLink: {
        color: '#000',
        marginBottom: 15,
        fontWeight: 'bold'
    },
    color111: {
        color: '#111'
    }
});

const mapStateToProps = (state) => {
    return {
        isAuthenticate: state.isAuthenticate,
        isConnected: state.system.isConnected,
        imagelink:state.user.imageUrl,
        tenant_name:state.user.tenant_name,
        email:state.user.emailAddress,
        accountAlias: state.user.accountAlias
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        authenticate: (props) => dispatch({ type: auth.AUTHENTICATE_USER, payload: props }),
        imageUrl: (props) => dispatch({ type: user.UPDATE_IMAGE, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)