import React, { Component } from 'react'
import { Text, View, Modal, StyleSheet, Button, Dimensions, TouchableNativeFeedback, Linking, WebView, StatusBar } from 'react-native'
import { SubscriptionAgreement } from '../../../config'

const { width, height } = Dimensions.get('window')
const statusBarHeight = StatusBar.currentHeight
//Styles
const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: width,
        height: height - statusBarHeight,
        alignItems: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    crossView: {
        backgroundColor: '#47309C',
        width: width,
        height: 30
    },
    cross: { color: '#fff', fontSize: 25, textAlign: 'center', backgroundColor: '#47309C' },
    webViewConfig: { width: width, opacity: 0.99, marginVertical: 10 }
})

export class SubscriptionModal extends Component {

    render() {
        return (
            <>
                <Modal
                    animationType='slide'
                    presentationStyle='pageSheet'
                    visible={this.props.visible}>
                    <View style={styles.modalView}>
                        <TouchableNativeFeedback style={styles.crossView} onPress={this.props.onRequestClose}>
                            <Text style={styles.cross}>X</Text>
                        </TouchableNativeFeedback>
                        <WebView
                            ref={(ref) => { this.webview = ref; }}
                            source={{ uri: SubscriptionAgreement }} style={styles.webViewConfig}
                            scalesPageToFit={true}
                            onNavigationStateChange={async (event) => {
                                if (event.url !== SubscriptionAgreement) {
                                    await this.webview.goBack();
                                    Linking.openURL(event.url);
                                }
                            }}
                        />
                        <Button title='Subscribe' onPress={this.props.subscribe} color='#47309C' />
                    </View>
                </Modal>
            </>
        )
    }
}

export default SubscriptionModal;
