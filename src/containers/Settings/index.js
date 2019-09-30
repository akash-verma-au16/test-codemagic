import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Alert,
    BackHandler,
    ToastAndroid,
    AsyncStorage,
    Switch,
    Linking
} from 'react-native';

/* Redux */
import { connect } from 'react-redux'
import { auth, dev, user } from '../../store/actions'
import { StackActions, NavigationActions } from 'react-navigation';
/* Native Base */
import {
    Container,
    Content,
    Icon,
    H3
} from 'native-base';

import DeviceInfo from 'react-native-device-info';

/* Services */
import { logout } from '../../services/bAuth'
import { unregister, enable_status, disable_status } from '../../services/pushNotification'
// RBAC Handler function
import { checkIfSessionExpired } from '../RBAC/RBAC_Handler'
/* Custom Components */
import LoadingModal from '../LoadingModal'

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isSwitchOn: this.props.pushNotificationStatus,
            switchLoader: true
        }
        this.signOut = this.signOut.bind(this)
    }

    async goBack() {
        await this.props.navigation.goBack()
    }

    statusApiPayload = {
        tenant_id: this.props.accountAlias,
        associate_id: this.props.associate_id
    }

    enableStatus = () => {
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }
        try {
            if (this.props.isConnected) {
                enable_status(this.statusApiPayload,headers).then(() => {
                    this.props.updatePushNotifStatus({ pushNotifStatus: true })
                    // }
                }).catch((error) => {
                    const isSessionExpired = checkIfSessionExpired(error.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                    if (!isSessionExpired) {
                        this.enableStatus()
                        return
                    }
                    this.setState({ isSwitchOn: false })

                })
            }
            else {
                this.noInternetToast()
            }
        }
        catch {
            throw 'error'
        }
    }

    disableStatus = () => {
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }
        try {
            if (this.props.isConnected) {
                disable_status(this.statusApiPayload,headers).then((response) => {
                    if (response.status == 200) {
                        this.props.updatePushNotifStatus({ pushNotifStatus: false })
                    }
                }).catch((error) => {
                    const isSessionExpired = checkIfSessionExpired(error.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                    if (!isSessionExpired) {
                        this.enableStatus()
                        return
                    }
                    this.setState({ isSwitchOn: true })

                })
            }
            else {
                this.noInternetToast()
            }
        }
        catch {
            throw 'error'
        }

    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    static navigationOptions = () => {
        return {
            headerRight: (
                <React.Fragment />
            )
        };
    };
    toast = () => {
        ToastAndroid.showWithGravityAndOffset(
            'Coming soon',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            100,
        );
    }

    noInternetToast = () => {
        ToastAndroid.showWithGravityAndOffset(
            'Please, connect to the internet',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            100,
        );
    }

    data = [
        {
            key: 'Push Notification',
            icon: 'md-notifications'
        },
        {
            key: 'Privacy Policy',
            icon: 'md-lock',
            onPress: () => Linking.openURL('https://joy-hw-default-ind-m-prod.s3.ap-south-1.amazonaws.com/default/legal-documents/PrivacyPolicy.html')
        },
        {
            key: 'Feedback',
            icon: 'md-mail',
            onPress: () => this.props.navigation.navigate('Feedback')
        },
        {
            key: 'App Version : ' + DeviceInfo.getVersion() + '(' + DeviceInfo.getBuildNumber() + ')',
            icon: 'md-phone-portrait'
        },
        {
            key: 'Logout',
            icon: 'md-log-out',
            onPress: () => this.signOutHandler()
        }
    ]

    clearLikeHandler = async () => {
        try {
            // take backup of tokens
            const pushNotificationToken = await AsyncStorage.getItem('token');
            const redux = await AsyncStorage.getItem('reduxState');
            // format the system
            await AsyncStorage.clear()
            // restore the tokens
            if (pushNotificationToken) {
                AsyncStorage.setItem('token', pushNotificationToken)
            }
            if (redux) {
                AsyncStorage.setItem('reduxState', redux)
            }
        } catch (error) {
            // Error retrieving data
        }
    }
    signOut() {
        this.setState({ isLoading: true })
        const payload = {
            accountAlias: this.props.accountAlias,
            email: this.props.email
        }
        const payload_2 = {
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id
        }
        logout(payload).then(() => {
            // Signout
            this.props.deAuthenticate()
            this.clearLikeHandler()
            unregister(payload_2)
            this.setState({ isLoading: false })
            ToastAndroid.showWithGravityAndOffset(
                'Signed out Successfully',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'LoginPage' })]
            });
            this.props.navigation.dispatch(resetAction);
            return
        }).catch(() => {
            if (!this.props.isConnected) {
                this.setState({ isLoading: false })
                this.noInternetToast()

            } else {
                this.setState({ isLoading: false })
                ToastAndroid.showWithGravityAndOffset(
                    'Unable to communicate with server',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    100,
                );

            }
        })
    }

    switchHandler = (value) => {
        this.setState({
            isSwitchOn: value
        }, () => {
            if (value == true) {
                this.enableStatus()
            }
            else {
                this.disableStatus()
            }
        })
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                disabled={item.onPress ? false : true}
                style={{
                    flexDirection: 'row',
                    paddingVertical: 20,
                    justifyContent: 'space-between',
                    width: '100%',
                    borderColor: 'black',
                    borderBottomWidth: 1
                }}
                onPress={item.onPress}
            >
                <View style={{ flexDirection: 'row' }}>
                    <Icon name={item.icon} style={styles.icon} />

                    <H3 style={{
                        color: 'black',
                        textAlign: 'center'
                    }}
                    >
                        {item.key}
                    </H3>
                </View>
                {
                    item.key == 'Push Notification' ?
                        <Switch
                            value={this.state.isSwitchOn}
                            onValueChange={(value) => this.switchHandler(value)}
                        />
                        : null
                }
                {item.onPress && item.key !== 'Push Notification' ?
                    <Icon name='ios-arrow-forward' style={[
                        styles.icon,
                        { color: 'black' }
                    ]} />
                    : null}
            </TouchableOpacity>
        )
    }

    signOutHandler = () => {
        Alert.alert(
            'Logout?',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Yes', onPress: () => { this.signOut() }
                }
            ],
            { cancelable: false },
        )
    }
    render() {

        return (

            <Container>
                <Content
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    style={{
                        paddingHorizontal: 20
                    }}
                >
                    <FlatList
                        data={this.data}
                        extraData={this.state.isSwitchOn}
                        renderItem={this.renderItem}
                    />
                </Content>
                <LoadingModal
                    enabled={this.state.isLoading}
                />
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 20,
        paddingHorizontal: 10,
        color: '#47309C'
    }
})
const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        email: state.user.emailAddress,
        isConnected: state.system.isConnected,
        associate_id: state.user.associate_id,
        accessToken: state.user.accessToken,
        pushNotificationStatus: state.user.pushNotifStatus
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        clearData: () => dispatch({ type: dev.CLEAR_DATA }),
        updatePushNotifStatus: (props) => dispatch({ type: user.UPDATE_PUSH_STATUS, payload: props}),
        updateNewTokens: (props) => dispatch({ type: auth.REFRESH_TOKEN, payload: props })

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)