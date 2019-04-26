import React from 'react'
import { View, BackHandler, ScrollView, RefreshControl, StyleSheet, Image, Text, Dimensions } from 'react-native'
import {
    Container,
    Toast
} from 'native-base';
import NetInfo from "@react-native-community/netinfo"

import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux'
import { inapp_notification } from '../../services/inAppNotification'

// import thumbnail from '../../assets/thumbnail.jpg'

class InAppNotifier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false
        }

        this.endorsementData = [
            { name: 'Creativity', source: require('../../assets/endorsements/creativity.png') },
            { name: 'Curiosity', source: require('../../assets/endorsements/curiosity.png') },
            { name: 'Judgement', source: require('../../assets/endorsements/judgement.png') },
            { name: 'Perspective', source: require('../../assets/endorsements/perspective.png') },
            { name: 'Bravery', source: require('../../assets/endorsements/bravery.png') },
            { name: 'Perseverance', source: require('../../assets/endorsements/perseverance.png') },
            { name: 'Zest', source: require('../../assets/endorsements/zest.png') },
            { name: 'Honesty', source: require('../../assets/endorsements/honesty.png') },
            { name: 'Social Intelligence', source: require('../../assets/endorsements/socialIntelligence.png') },
            { name: 'Kindness', source: require('../../assets/endorsements/kindness.png') },
            { name: 'Love', source: require('../../assets/endorsements/love.png') },
            { name: 'Leadership', source: require('../../assets/endorsements/leadership.png') },
            { name: 'Fairness', source: require('../../assets/endorsements/fairness.png') },
            { name: 'Teamwork', source: require('../../assets/endorsements/teamwork.png') },
            { name: 'Forgiveness', source: require('../../assets/endorsements/forgiveness.png') },
            { name: 'Love of Learning', source: require('../../assets/endorsements/loveOfLearning.png') },
            { name: 'Spirituality', source: require('../../assets/endorsements/spirituality.png') },
            { name: 'Self-Regulation', source: require('../../assets/endorsements/selfRegulation.png') },
            { name: 'Humility', source: require('../../assets/endorsements/humility.png') },
            { name: 'Appreciation', source: require('../../assets/endorsements/appreciation.png') },
            { name: 'Prudence', source: require('../../assets/endorsements/prudence.png') },
            { name: 'Hope', source: require('../../assets/endorsements/hope.png') },
            { name: 'Humor', source: require('../../assets/endorsements/humor.png') },
            { name: 'Gratitude', source: require('../../assets/endorsements/gratitude.png') }

        ]
        this.onRefresh = this.onRefresh.bind(this)
        this.loadNotifications = this.loadNotifications.bind(this)
        this.payloadBackup = []
        this.notificationList = []
    }

    loadNotifications = () => {
        const payload = {
            associate_id: this.props.associate_id,
            tenant_id: this.props.accountAlias
        }
        try {
            if (payload.tenant_id !== "" && payload.associate_id !== "") {
                inapp_notification(payload).then(response => {
                    if (this.payloadBackup.length === response.data.in_app_data.length) {
                        if (response.data.in_app_data.length == 0) {
                            this.notificationList = []
                            this.notificationList.push(
                                <Text style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 20 }} key={0}>No new notifications</Text>
                            )
                        }
                        this.setState({ refreshing: false })
                    } else {
                        //Change in Payload
                        this.payloadBackup = response.data.in_app_data
                        if (this.notificationList.length !== 0) {
                            this.notificationList = []
                        }
                        this.createNotificationTile(response.data.in_app_data)
                        this.setState({ refreshing: false })
                    }
                }).catch((error) => {
                    this.setState({ refreshing: false })
                    console.log(error)
                })
            }
        }
        catch (error) {
            this.setState({ refreshing: false })
            console.log("Error")
        }
        this.setState({refreshing: true})
    }

    createNotificationTile = (data) => {
        data.map((item, index) => {
            const imageData = this.endorsementData.filter((endorse) => {
                if(item.type_details.type == 'endorse'){
                    return item.type_details.sub_type == endorse.name
                }else {
                    return item.type_details.type == endorse.name.toLowerCase()
                }
            })
            this.notificationList.push(
                <View style={styles.notificationContainer} key={index}>
                    <View style={styles.notificationView}>
                        <View style = {styles.iconView}>
                            <Image 
                                source= {imageData[0].source}
                                style={{ height: 40, aspectRatio: 1 / 1 }}
                            />
                        </View>
                        <View style={styles.notificationMsgView}>
                            {
                                (item.type_details.type === 'endorse' 
                                    ? <Text style={[styles.notificationText, { fontSize: 15 }]}>{item.body} by {item.taggie_associate_name} for {item.type_details.sub_type}</Text>
                                    : <Text style={[styles.notificationText, { fontSize: 15 }]}>{item.taggie_associate_name} {item.body}</Text>
                                )
                                
                            }
                            <Text style={[styles.notificationText, {paddingTop: 5}]}>{item.date_created}</Text>
                        </View>
                    </View>
                    <View style={{ height: 1, width: '100%', backgroundColor: '#c9cacc' }}></View>
                </View>
            )
        })
        this.setState({refreshing: false})
    }

    async goBack() {
        await this.props.navigation.goBack()
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        this.backHandler.remove();
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = (isConnected) => {
        if(isConnected) {
            this.loadNotifications()
        }
    }

    onRefresh() {
        if(this.props.isConnected) {
            this.setState({ refreshing: true }, this.loadNotifications())
        } else {
            this.setState({ refreshing: false }, () => {
                Toast.show({
                    text: 'Please connect to the internet.',
                    type: 'danger',
                    duration: 2000
                })
            })
        }
    }

    render() {
        return(
            <Container style={{ backgroundColor: '#eee' }}>
                <ScrollView
                    refreshControl = {
                        <RefreshControl
                            refreshing={this.state.refreshing} 
                            onRefresh={this.onRefresh}
                        />
                    }
                    contentContainerStyle={styles.container}
                >
                    {this.notificationList}
                </ScrollView>
                <NavigationEvents
                    onWillFocus={() => {
                        if (this.props.isConnected) {
                            if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                this.loadNotifications()
                            }
                        }
                    }}
                />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#eee',
        paddingTop: 3,
        paddingHorizontal: 5, 
        paddingBottom: 0
    },
    notificationContainer: { 
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
        // height: 90,
        paddingTop: 10
        // width: '100%'
    },
    notificationView : {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        // width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    iconView: {
        height: 65,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width * 0.20
    },
    notificationMsgView: {
        width: Dimensions.get('window').width * 0.80,
        justifyContent: 'center'
    },
    notificationText: {
        flex: 1,
        flexWrap: 'wrap',
        textAlign: 'left',
        fontFamily: "OpenSans-Regular",
        paddingRight: 7
    }
})

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected

    };
}

export default connect(mapStateToProps, null)(InAppNotifier)