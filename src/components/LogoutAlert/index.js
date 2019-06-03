import React from "react";
import { Alert } from 'react-native'

class LogoutAlert extends React.Component {
    constructor(super) {
        super(props)
    }

    render() {
        retunr(
            Alert.alert(
                'Session expired',
                'Please, login again to continue.',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            )
        )
    }
}