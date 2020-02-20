import React, { Component } from 'react'
import { View, StyleSheet, TextInput, Dimensions, KeyboardAvoidingView, ToastAndroid, ActivityIndicator } from 'react-native'
import { Button, Text } from 'native-base'
import { changePassword } from '../../services/bAuth'
import { connect } from 'react-redux'

const regexForNewpass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
export class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPass: '',
            newPass: '',
            confirmPass: '',
            showNote: false,
            validNewPass: false,
            isLoading: false
        }
    }

    errorToast = (data) => {
        return(
            ToastAndroid.showWithGravity(
                data.message,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
            )
        )
    }

    saveChanges = () => {
        this.setState({ isLoading: true });
        const { oldPass, newPass, confirmPass, validNewPass } = this.state;
        const { accessToken, accountAlias } = this.props;
        if (oldPass == '' || newPass == '' || confirmPass == '') {
            ToastAndroid.showWithGravity(
                'All fields are required!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            this.setState({ isLoading: false });
            return;
        }
        else if (oldPass === newPass) {
            ToastAndroid.showWithGravity(
                'New password and old password must not be same!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            this.setState({ isLoading: false });
            return;
        }
        else if (newPass.trim() !== confirmPass.trim()) {
            ToastAndroid.showWithGravity(
                'New Password and Confrim Password should match!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            this.setState({ isLoading: false });
            return;
        }
        else if (!validNewPass) {
            this.setState({ showNote: true });
            ToastAndroid.showWithGravity(
                'Enter a valid new password as shown in note!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            this.setState({ isLoading: false });
            return;
        }
        else {
            const headers = {
                headers: {
                    Authorization: accessToken
                }
            };
            const payload = {
                old_password: oldPass.trim(),
                new_password: newPass.trim(),
                access_token: accessToken,
                tenant_id: accountAlias
            }
            try {
                changePassword(payload, headers).then(res => {
                    if (res.status == 200) {
                        const response = res.data
                        ToastAndroid.showWithGravity(
                            response.message,
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                        );
                        this.setState({ isLoading: false });
                        this.props.navigation.goBack()
                        return;
                    }

                }).catch(e => {
                    const errorResponse = e.response.data
                    this.setState({ isLoading: false });
                    switch (errorResponse.code) {
                    case "LimitExceededException":
                        this.errorToast(errorResponse)
                        break;
                    case "INVALID_PASSWORD":
                        this.errorToast(errorResponse)
                        break;
                    case "USER_INCORRECT_PASSWORD":
                        this.errorToast(errorResponse)
                        break;
                    case "ATTEMPT_LIMIT_EXCEED":
                        this.errorToast(errorResponse)
                        break;
                    default:
                        break;
                    }
                })
            }
            catch (error) {
                ToastAndroid.showWithGravity(
                    'Something went wrong, please try again!',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                );
                this.setState({ isLoading: false });

            }
        }

    }

    validateNewPass = (newPass) => {
        this.setState({ newPass }, () => {
            if (newPass == '') {
                this.setState({ showNote: false });
                return;
            }
            else if (!regexForNewpass.test(newPass)) {
                this.setState({ showNote: true });
            }
            else {
                this.setState({ showNote: false, validNewPass: true });
            }
        })
    }

    render() {
        const { navigation } = this.props;
        const { oldPass, newPass, confirmPass, showNote, isLoading } = this.state;
        return (
            <KeyboardAvoidingView style={styles.container}>
                <View style={styles.wrapperView}>
                    <Text style={styles.labelText}>Old Password</Text>
                    <TextInput style={styles.textInput} placeholder='Old Password' value={oldPass} onChangeText={oldPass => this.setState({ oldPass })} />
                </View>
                <View style={styles.wrapperView}>
                    <Text style={styles.labelText}>New Password</Text>
                    <TextInput style={styles.textInput} placeholder='New Password' value={newPass} onChangeText={newPass => this.validateNewPass(newPass)} />
                </View>
                <View style={styles.wrapperView}>
                    <Text style={styles.labelText}>Confirm Password</Text>
                    <TextInput style={styles.textInput} placeholder='Confirm Password' value={confirmPass} onChangeText={confirmPass => this.setState({ confirmPass })} />
                </View>
                {
                    showNote &&
                    <Text style={styles.note}>
                        Note: Your password must contain: a number, a special symbol, a lowercase character, an uppercase character and at least 8 characters !
                    </Text>
                }
                <Button style={styles.buttonBase} primary onPress={this.saveChanges}>
                    {
                        isLoading ?
                            <ActivityIndicator size='small' color='#fff' />
                            :
                            <Text>Save Changes</Text>
                    }
                </Button>
                <Button style={styles.buttonBase} light onPress={() => navigation.goBack()}><Text>Cancel</Text></Button>
            </KeyboardAvoidingView>
        )
    }
}
const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        width: width
    },
    textInput: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        width: '100%',
        paddingHorizontal: 10
    },
    wrapperView: {
        width: '100%',
        marginVertical: 5
    },
    labelText: {
        fontSize: 16,
        fontWeight: '300',
        paddingVertical: 5
    },
    buttonBase: {
        borderRadius: 5,
        width: '100%',
        justifyContent: 'center',
        marginVertical: 10
    },
    note: {
        textAlign: 'left',
        fontSize: 12,
        color: '#f59356'
    }
})

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        isConnected: state.system.isConnected,
        accessToken: state.user.accessToken
    };
}

export default connect(mapStateToProps, null)(ChangePassword)
