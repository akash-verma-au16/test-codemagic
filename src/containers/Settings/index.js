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
    Switch
} from 'react-native';

/* Redux */
import { connect } from 'react-redux'
import { auth, dev } from '../../store/actions'
import { StackActions, NavigationActions } from 'react-navigation';
/* Native Base */
import {
    Container,
    Content,
    Icon,
    H3
} from 'native-base';
/* Services */
import { logout } from '../../services/bAuth'
import { unregister, get_status, enable_status, disable_status } from '../../services/pushNotification'
/* Custom Components */
import LoadingModal from '../LoadingModal'

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isSwitchOn: false,
            switchLoader: true
        }
        this.signOut = this.signOut.bind(this)
    }

    async goBack() {
        await this.props.navigation.goBack()
    }

    componentWillMount() {
        this.getStatus()
    }

    statusApiPayload = {
        tenant_id: this.props.accountAlias,
        associate_id: this.props.associate_id
    }

    getStatus = () => {
        try {
            if (this.props.isConnected) {
                get_status(this.statusApiPayload).then(async(response) => {
                    console.log(response.data.is_push_disabled)
                    if(response.data.is_push_disabled == 'True') {
                        this.setState({
                            isSwitchOn: true
                        })
                    }
                    else {
                        this.setState({
                            isSwitchOn: false
                        })
                    }
                    // }
                }).catch((e) => {
                    throw e
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

    enableStatus = () => {
        try {
            if (this.props.isConnected) {
                enable_status(this.statusApiPayload).then((response) => {
                    if (response.status == 200) { 
                        console.log(response)
                        this.setState({
                            isSwitchOn: true
                        })
                    }
                }).catch((e) => {
                    throw e
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
        try {
            if (this.props.isConnected) {
                disable_status(this.statusApiPayload).then((response) => {
                    // if (response.data.is_push_disabled == true) {
                    console.log(response)
                    this.setState({
                        isSwitchOn: false
                    })
                    // }
                }).catch((e) => {
                    throw e
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
            onPress: () => this.toast()
        },
        {
            key: 'User Agreement',
            icon: 'md-document',
            onPress: () => this.toast()
        },
        {
            key: 'App Version : 1.13',
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
            if(value == true) {
                console.log('enable')
                this.enableStatus()
            }
            else {
                console.log('disable')
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
        color: '#1c92c4'
    }
})
const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        email: state.user.emailAddress,
        isConnected: state.system.isConnected,
        associate_id: state.user.associate_id
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        clearData: () => dispatch({ type: dev.CLEAR_DATA })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)