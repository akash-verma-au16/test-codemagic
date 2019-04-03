import React, { Component } from 'react';
import {
    View,
    Modal,
    Text
} from 'react-native';
import {
    Spinner
} from 'native-base'
export default class LoadingModal extends Component {
    
    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={this.props.enabled}
                hardwareAccelerated={true}
                onRequestClose={() => {

                }}

            >
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#00000077'
                    }}
                    
                >
                    <Spinner color='white' />
                    <Text style={{color:'white'}}>Please Wait..</Text>
                    
                </View>
            
            </Modal>
        );
    }
}
