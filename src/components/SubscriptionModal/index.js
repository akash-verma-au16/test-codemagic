import React, { Component } from 'react'
import { Text, View, Modal, StyleSheet, WebView, Button } from 'react-native'
import { SubscriptionAgreement } from '../../../config'
import RoundButton from '../../components/RoundButton'

export class SubscriptionModal extends Component {
    render() {
        return (
            <Modal
                animationType='slide'
                visible={this.props.visible}
                transparent>
                <View style={styles.modalView}>
                    <WebView source={{ uri: SubscriptionAgreement }} style={{ width: '100%', marginBottom: 15 }} />
                    <Button title='Subscribe' onPress={this.props.subscribe} color='#47309C' style={{ borderRadius: 5, height: 50 }} />
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: '100%',
        padding: 20
    }
})

export default SubscriptionModal;
