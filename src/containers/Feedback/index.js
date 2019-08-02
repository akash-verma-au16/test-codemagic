import React, { Component } from 'react';
import { View, Text, BackHandler } from 'react-native';

export default class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                <Text> Feedback </Text>
            </View>
        );
    }
}
