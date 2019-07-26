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
    Linking
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
import { unregister } from '../../services/pushNotification'
/* Custom Components */
import LoadingModal from '../LoadingModal'

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
        this.signOut = this.signOut.bind(this)
    }

    async goBack() {
        await this.props.navigation.goBack()
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
    data = [
        {
            key: 'Push Notification',
            icon: 'md-notifications',
            onPress: () => this.toast()
        },
        {
            key: 'Privacy Policy',
            icon: 'md-lock',
            onPress: () => Linking.openURL('http://joy-hw-privacy-policy.s3-website-ap-southeast-1.amazonaws.com')
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
                ToastAndroid.showWithGravityAndOffset(
                    'Please, connect to the internet',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    100,
                );

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
                        renderItem={
                            ({ item }) =>
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
                                    {item.onPress ?
                                        <Icon name='ios-arrow-forward' style={[
                                            styles.icon,
                                            { color: 'black' }
                                        ]} />
                                        : null}
                                </TouchableOpacity>
                        }
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