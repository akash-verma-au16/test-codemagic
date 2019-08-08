import React, { PureComponent } from "react";
import { View, Text, Dimensions, StyleSheet} from 'react-native';
import NetInfo from "@react-native-community/netinfo"
import { connect } from 'react-redux';
import { system } from '../../store/actions'

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
    return (
        <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
    );
}

class OfflineNotice extends PureComponent {
    constructor(props) {
        super(props)
        this.props.initialStatus(this.props.isConnected)
    }
    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = isConnected => {
        this.props.updateStatus(isConnected? 
            true : 
            false)
    }

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

const mapDispatchToProps = (dispatch) => {
    return {
        initialStatus: (value) => dispatch({ type: system.NETWORK_STATUS, payload: value}),
        updateStatus: (value) => dispatch({ type: system.NETWORK_STATUS, payload: value})
    }
}

export default connect(null, mapDispatchToProps)(OfflineNotice)