import React, { PureComponent } from "react";
import { View, Text, Dimensions, StyleSheet} from 'react-native';

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
    return (
        <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
    );
}

export default class OfflineNotice extends PureComponent {
    render() {
        if (!this.props.isConnected) {
            return (
                <MiniOfflineSign />
            )
        }
        return null;

    }
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 30,
        width
    },
    offlineText: { color: '#fff' }
});
