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
    Platform,
    Alert
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
import DeviceInfo from 'react-native-device-info';

import { file_download } from '../../services/profile'
import { user } from '../../store/actions'
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
import { register_device } from '../../services/pushNotification'
import { get_associate_name, liked_post } from '../../services/post'
import slackLogger from '../../services/slackLogger'

class LoginPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isShowingKeyboard: false,
            isSignInLoading: false,
            email: "",
            password: "",
            logoShift: new Animated.Value(-50),
            logoFade: new Animated.Value(0),
            sloganFade: new Animated.Value(0)
        }
        this.tenantName = ""
        /* Refs are used to redirect the focus to the next component using keyboard button */
        this.textInputEmail = React.createRef();
        this.textInputPassword = React.createRef();
        this.contentView = React.createRef()
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack)
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    _keyboardDidShow = () => {
        this.setState({ isShowingKeyboard: true })
    }

    _keyboardDidHide = () => {
        this.setState({ isShowingKeyboard: false })
    }
    /* Restore Likes from the server */
    likeSyncHandler = (payload, header) => {
        liked_post(payload, header)
            .then((response) => {
                response.data.data.map((postId) => {
                    /* Store likes */
                    AsyncStorage.setItem(postId, 'true')
                })
            })
            .catch(() => {
                // error
            })
    }

    goBack() {
        Alert.alert(
            'Exit App?',
            'Are you sure you want to exit the app?',
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                {
                    text: 'Yes', onPress: () => {
                        BackHandler.exitApp()
                    }
                }
            ],
            { cancelable: false },
        )
        return true
    }

    componentWillUnmount() {
        this.backHandler.remove()
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
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
    }

    forgotPasswordHandler = () => {
        this.setState({ password: '' })
        this.props.navigation.navigate('ForgotPassword', {
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
                    tenant_id: payload.accountAlias,
                    associate_id: payload.associate_id,
                    platform: Platform.OS,
                    device_token: token
                }
                const headers = {
                    headers: {
                        Authorization: payload.accessToken
                    }
                }

                register_device(payload_2, headers).then(() => {

                }).catch(() => {
                })
                // Send token to slack
                slackLogger({
                    name: payload.firstName + ' ' + payload.lastName,
                    email: payload.emailAddress,
                    platform: Platform.OS,
                    token: token
                })
            } else {
                //Show warning
                return false
            }

        } catch (error) {
            // Error retrieving data
        }
    }

    showNewUserAlert = () => {
        Alert.alert(
            'New to HappyWorks?',
            '',
            [
                {
                    text: 'No', onPress: () => {
                        Toast.show({
                            text: 'Invalid credentials',
                            type: 'danger',
                            duration: 3000
                        })
                    },
                    style: 'cancel'
                },
                {
                    text: 'Yes', onPress: () => {
                        this.props.navigation.navigate('Welcome')
                    }
                }
            ],
            { cancelable: false },
        )
    }

    signinHandler = () => {
        /* Hiding the keyboard to prevent Toast overlap */
        Keyboard.dismiss()
        this.setState({
            isSignInLoading: true
        }, () => {
            try {
                if (this.state.email && this.state.password) {
                    login({
                        email: this.state.email,
                        password: this.state.password
                    }).then((response) => {

                        // store token expire time in the local storage
                        AsyncStorage.setItem('accessTokenExp', JSON.stringify(response.data.payload.accessToken.payload.exp))
                        const accountAlias = response.data.payload.tenant_id
                        /* Restricting Super Admin Access as no Tenant Name is available to fetch */
                        if (accountAlias.trim().toLowerCase() === 'default') {
                            Toast.show({
                                text: 'No Access for Super Admin',
                                type: "danger"
                            })
                            this.setState({ isSignInLoading: false })
                            return
                        }
                        read_tenant({
                            tenant_id: accountAlias.toLowerCase().trim()
                        }, {
                            headers: {
                                Authorization: response.data.payload.accessToken.jwtToken
                            }
                        }).then((tenantRes) => {
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
                                    tenant_id: accountAlias.toLowerCase().trim(),
                                    email: this.state.email.toLowerCase().trim()
                                }, {
                                    headers: {
                                        Authorization: response.data.payload.accessToken.jwtToken
                                    }
                                }).then(res => {
                                    let firstName = toSentenceCase(response.data.payload.idToken.payload.given_name);
                                    let lastName = toSentenceCase(response.data.payload.idToken.payload.family_name);
                                    const payload = {
                                        accountAlias: accountAlias.toLowerCase().trim(),
                                        tenant_name: tenantRes.data.data[0].tenant_name,
                                        associate_id: res.data.data.associate_id,
                                        firstName: firstName,
                                        lastName: lastName,
                                        phoneNumber: response.data.payload.idToken.payload.phone_number,
                                        emailAddress: response.data.payload.idToken.payload.email.toLowerCase(),
                                        idToken: response.data.payload.idToken.jwtToken,
                                        accessToken: response.data.payload.accessToken.jwtToken,
                                        refreshToken: response.data.payload.refreshToken.token
                                    };

                                    this.likeSyncHandler({
                                        tenant_id: payload.accountAlias,
                                        associate_id: payload.associate_id
                                    },
                                    {
                                        headers: {
                                            Authorization: payload.accessToken
                                        }
                                    })
                                    this.props.authenticate(payload);
                                    //Activate Push Notofication
                                    if (!this.sendToken(payload))
                                        return
                                    try {
                                        get_associate_name({ tenant_id: payload.accountAlias }, {
                                            headers: {
                                                Authorization: response.data.payload.accessToken.jwtToken
                                            }
                                        }).then(async (res) => {
                                            res.data.data.map((item) => {
                                                AsyncStorage.setItem(item.associate_id, item.full_name)
                                            })

                                            /* Request image*/
                                            const file_download_payload = {
                                                tenant_name: this.props.tenant_name + this.props.accountAlias,
                                                file_name: 'logo.png',
                                                associate_email: this.props.email
                                            }
                                            const header = {
                                                headers: {
                                                    Authorization: this.props.accessToken
                                                }
                                            }

                                            this.props.navigation.setParams({'associateId': this.props.associate_id })
                                            
                                            file_download(file_download_payload, header).then((response) => {
                                                this.props.imageUrl(response.data.data['download-signed-url'])
                                                this.props.navigation.navigate('TabNavigator')
                                            }).catch(() => { })

                                        }).catch(() => {
                                        })
                                    }
                                    catch (e) {/* error */ }
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
                                    email: this.state.email,
                                    password: this.state.password
                                })
                                this.setState({ password: '' })
                                break;
                            case "ResourceNotFoundException":
                                Toast.show({
                                    text: 'Account not found please contact your administrator',
                                    type: 'danger',
                                    duration: 3000
                                })
                                break;
                            case "TenantDoesNotExist":
                                this.showNewUserAlert()
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
                                text: 'Something went wrong, please try again later.',
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
                    text: "Something went wrong, please try again.",
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
                    contentContainerStyle={this.state.isShowingKeyboard ? null : styles.container}
                    ref={ref => this.contentView = ref}
                >
                    <View
                        style={styles.image}
                        onLayout={this.loadComponents}
                    >
                        <Form style={styles.form}>
                            <Animated.View style={[{ transform: [{ translateY: logoShift }], opacity: logoFade, alignItems: 'center' }]}>

                                <Image
                                    source={logo}
                                    resizeMode={'cover'}
                                    style={{ height: 250, aspectRatio: 1 / 1 }}
                                />

                            </Animated.View>
                            <View style={styles.container} ></View>

                            <Animated.View style={[{ alignItems: 'center' }, { opacity: logoFade }]}>
                                <TextInput
                                    placeholder='Username'
                                    value={this.state.email}
                                    onChangeText={(text) => this.setState({ email: text })}
                                    inputRef={input => this.textInputEmail = input}
                                    onSubmitEditing={() => {
                                        this.textInputPassword._root.focus()
                                        this.contentView._root.scrollToEnd()
                                    }}
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
                                    value='Sign In'
                                    isLoading={this.state.isSignInLoading}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '80%' }}>
                                    <TouchableOpacity onPress={this.forgotPasswordHandler}>
                                        <Text style={styles.navigationLink}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Welcome')}>
                                        <Text style={styles.navigationLink}>New to Happyworks?</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.appVersion}>App Version: {DeviceInfo.getVersion()}({DeviceInfo.getBuildNumber()})</Text>
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
        marginBottom: 5,
        fontWeight: 'bold'
    },
    color111: {
        color: '#111'
    },
    appVersion: {
        marginBottom: 10,
        fontSize: 12
    }
});

const mapStateToProps = (state) => {
    return {
        isAuthenticate: state.isAuthenticate,
        isConnected: state.system.isConnected,
        imagelink: state.user.imageUrl,
        tenant_name: state.user.tenant_name,
        email: state.user.emailAddress,
        accountAlias: state.user.accountAlias,
        accessToken: state.user.accessToken,
        associate_id: state.user.associate_id
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        authenticate: (props) => dispatch({ type: auth.AUTHENTICATE_USER, payload: props }),
        imageUrl: (props) => dispatch({ type: user.UPDATE_IMAGE, payload: props }),
        updatePushNotifStatus: (props) => dispatch({ type: user.UPDATE_PUSH_STATUS, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)