import React from 'react';
import {
    View,
    Text,
    BackHandler,
    RefreshControl,
    ToastAndroid,
    ScrollView
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"

import { list_likes } from '../../services/post'
import Like from '../../components/Like/index'
//Custom Data
// import { data } from './data'

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
    }

    componentWillMount() {
        this.fetchPeopleList()
        this.setState({ peopleListrefresh: true })
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
            catch(e) {/* error */}
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
        data.map(async(item, index) => {
            this.peopleList.push(
                <Like 
                    index={index} 
                    associateId = {item.associate_id} 
                    time= {item.time}
                />
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