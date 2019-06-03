import React from 'react';
import {
    View,
    Text,
    BackHandler,
    RefreshControl,
    ToastAndroid,
    ScrollView,
    StyleSheet,
    Dimensions
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"

//Native base 
import { Icon } from 'native-base'

import { list_likes } from '../../services/post'
//Custom Data
// import { data } from './data'

//Moment.js
import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'

//redux
import { connect } from 'react-redux'

class Likes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            postId: this.props.navigation.getParam('postId'),
            peopleListrefresh: false,
            noData: false
        }
        this.peopleList = []
        this.people = []
        this.loadPeople = this.loadPeople.bind(this)

        //formatting update locale
        Moment.globalMoment = moment;
        moment.updateLocale('en', {
            relativeTime: {
                past: function (input) {
                    return input === 'just now'
                        ? input
                        : input + ' ago'
                },
                s: 'just now',
                future: "in %s",
                ss: '%ds',
                m: "%dm",
                mm: "%dm",
                h: "%dh",
                hh: "%dh",
                d: "%dd",
                dd: "%dd",
                M: "%dm",
                MM: "%dm",
                y: "%dy",
                yy: "%dy"
            }
        });
    }

    componentWillMount() {
        this.setState({ peopleListrefresh: true })
        this.fetchPeopleList()
    }

    componentDidMount() {
        //Detecting network connectivity change
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });
    }

    handleConnectivityChange = (isConnected) => {
        if(isConnected) {
            this.setState({
                peopleListrefresh: true
            },() => this.fetchPeopleList())
        }
    }

    async goBack() {
        await this.props.navigation.goBack()
    }

    componentWillUnmount() {
        this.backHandler.remove();
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    showToast() {
        ToastAndroid.showWithGravityAndOffset(
            'Please, Connect to the internet',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            100,
        );
    }
    //Authorization headers
    headers = {
        headers: {
            Authorization: this.props.idToken
        }
    }

    fetchPeopleList = () => {
        if(this.props.isConnected) {
            const payload = {
                post_id: this.state.postId,
                tenant_id: this.props.accountAlias,
                associate_id: this.props.associate_id
            }
            try {
                list_likes(payload,this.headers).then((res) => {
                    console.log(res)
                    if(res.status == 200) {
                        if (res.data.data.Items.length == 0) {
                            this.setState({ noData: true, peopleListrefresh: false })
                            return                            
                        }
                        else {
                            this.people = res.data.data.Items
                            this.loadPeople(this.people)
                        }
                    }
                })
            }
            catch(e) {
                console.log(e)
            }
        }
        else {
            ToastAndroid.showWithGravityAndOffset(
                'Please, Connect to the internet',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
        }
    }

    loadPeople = (data) => {
        this.peopleList = []
        data.map((item, index) => {
            this.peopleList.push(
                <View style={styles.tileContainer} key={index}>
                    <View style={styles.tileView}>
                        <View style={{alignItems: 'center', justifyContent: 'center', width: '20%'}}>
                            <View style={styles.iconView}>
                                <Icon name='person' style={{ fontSize: 26, color: 'white' }} />
                            </View>
                        </View>
                        <View style={styles.textViewWrapper}>
                            <Text style={styles.name}>{this.props.associateList[item.associate_id]}</Text>
                            <Moment style={{ fontSize: 14, paddingVertical: 3 }} element={Text} fromNow>{item.time * 1000}</Moment>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 1/3, backgroundColor: '#c9cacc', marginTop: 5 }}></View>
                </View>
            )
        })
        this.setState({ peopleListrefresh: false })
    }

    render() {
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 5 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.peopleListrefresh}
                            onRefresh={() => {
                                if (this.props.isConnected) {
                                    if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                        this.fetchPeopleList()
                                    }
                                }
                                else {
                                    this.showToast()
                                }
                            }}
                        />
                    }>
                    {!this.state.noData ? this.peopleList : <View style={{
                        alignItems: 'center',
                        justifyContent:'center'
                    }}>
                        <Text style={{margin: 20}}>No Likes for this post</Text>
                    </View>}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tileContainer: {
        width: Dimensions.get('window').width
    },
    tileView: {
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconView: {
        flexDirection: 'column',
        borderRadius: 50,
        backgroundColor: '#1c92c4',
        height: 50,
        aspectRatio: 1/1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    textViewWrapper: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: '80%',
        padding: 10,
        paddingHorizontal: 10,
        alignItems: 'flex-start', 
        justifyContent: 'space-between'
    },
    name: {
        textAlign: 'left',
        fontFamily: "OpenSans-Regular",
        fontSize: 17,
        fontWeight: 'bold',
        color: '#111'
    }
})

const mapStateToProps = (state) => {
    return {
        associateList: state.user.associateList,
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected
    };
}

export default connect(mapStateToProps, null)(Likes)