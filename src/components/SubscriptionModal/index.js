import React, { Component } from 'react'
import { Text, View, Modal, StyleSheet, Button, Dimensions, TouchableNativeFeedback, Linking, WebView } from 'react-native'
import { SubscriptionAgreement } from '../../../config'

const { width } = Dimensions.get('window')
export class SubscriptionModal extends Component {

    render() {
        return (
            <Modal
                animationType='slide'
                visible={this.props.visible}
                transparent>
                <TouchableNativeFeedback style={styles.cross} onPress={this.props.onRequestClose}>
                    <Text style={{ color: '#333', fontSize: 20, textAlign: 'center' }}>X</Text>
                </TouchableNativeFeedback>
                <View style={styles.modalView}>
                    <WebView
                        ref={(ref) => { this.webview = ref; }}
                        source={{ uri: SubscriptionAgreement }} style={{ width: width, marginBottom: 15 }}
                        injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                        scalesPageToFit={false}
                        onNavigationStateChange={async (event) => {
                            if (event.url !== SubscriptionAgreement) {
                                await this.webview.goBack();
                                Linking.openURL(event.url);
                            }
                        }}
                    />
                    <Button title='Subscribe' onPress={this.props.subscribe} color='#47309C' style={{ borderRadius: 5, height: 50 }} />
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: width
    },
    cross: {
        position: 'absolute',
        width: 100,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: 'green'
    }
})

export default SubscriptionModal;
