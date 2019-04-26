import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Image,
    BackHandler,
    ActivityIndicator, 
    NetInfo
} from 'react-native';

import {
    Container,
    Text,
    Icon,
    H2,
    H3

} from 'native-base';

import { IndicatorViewPager } from 'rn-viewpager';

/* Redux */
import { connect } from 'react-redux'

// API methods
import { read_transaction, get_balance, user_profile } from '../../services/profile'

//React navigation
import { NavigationEvents } from 'react-navigation';

/* Assets */
import thumbnail from '../../assets/thumbnail.jpg'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            loading: true,
            isSignInLoading: false,
            selectedTab: 1,
            totalPonts: ""
        }
        this.loadProfile = this.loadProfile.bind(this)
        this.loadBalance = this.loadBalance.bind(this)
        this.pager = React.createRef();
        this.transactionList = []
        this.payloadBackup = []
        this.userData = []
        this.totalPonts = ""
        this.loadTransactions = this.loadTransactions.bind(this)

    }
    static navigationOptions = ({ navigation }) => {
        return {

            headerRight: (
                <Icon name='md-settings' style={
                    {
                        color: 'white',
                        margin: 20
                    }
                } onPress={() => navigation.navigate('settings')} />
            )
        };
    };

    async goBack() {
        await this.props.navigation.goBack()
    }

    componentWillMount() {
        this.loadBalance()
        this.loadProfile()
        this.loadTransactions()
        // this.setState({loading: false})
        console.log("Calling from Home.js WillMount")
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
        console.log("Calling from Home.js Unmount")
    }

    //Load user profile API Handler
    loadProfile = () => {
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.props.associate_id
        }
        try {
            if (payload.tenant_id !== "" && payload.associate_id !== "") {
                console.log("Calling user_profile")
                user_profile(payload).then((response) => {
                    this.userData = response.data.data
                    console.log("user",this.userData)
                })
                this.setState({loading: false})
            }
        }
        catch(error) {
            this.setState({ loading: false })
            console.log("error", error.code)
        }
        this.setState({loading: true})
    }

    // Get wallet balance API Handler
    loadBalance = () => {
        const payload = {
            associate_id: this.props.associate_id
        }
        try {
            if (payload.associate_id !== "") {
                console.log("Calling get_balance API")
                get_balance(payload).then((response) => {
                    this.setState({ totalPonts: response.data.data.total_points})
                    // this.totalPonts = response.data.data.total_points
                    console.log("Balance", this.state.totalPonts)
                })
            }
        }
        catch(error) {
            console.log(error)
        }
    }

    loadTransactions = () => {
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.props.associate_id
        }
        try {
            if (payload.tenant_id !== "" && payload.associate_id !== "") {
                console.log("Calling read_transaction API")
                read_transaction(payload).then(response => {
                    // console.log("Response", response.data.data.transaction_data)
                    if (this.payloadBackup.length === response.data.data.transaction_data) {
                        if (response.data.data.transaction_data.length == 0) {
                            this.transactionList = []
                            this.transactionList.push(
                                <Text style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 20 }} key={0}>No recent transactios found.</Text>
                            )
                        }
                        this.setState({ refreshing: false, loading: false })
                    } else {
                        //Change in Payload
                        this.payloadBackup = response.data.data.transaction_data
                        if (this.transactionList.length !== 0) {
                            this.transactionList = []
                        }
                        this.createTransactionTile(response.data.data.transaction_data)
                        this.setState({ refreshing: false, loading: false })
                    }
                }).catch((error) => {
                    this.setState({ refreshing: false, loading: false })
                    console.log(error)
                })
            }
        }
        catch(error) {
            this.setState({ refreshing: false, loading: false })
            console.log(error)
        }
        this.setState({ refreshing: true })
    }

    createTransactionTile = (data) => {
        data.map((item, index) => {
            this.transactionList.push(
                <View style={{ backgroundColor: '#FFF', width: Dimensions.get('window').width }} key={index}>
                    <View style= {styles.transactionContainer}>
                        <View style={styles.iconView}>
                            <View style={{backgroundColor: '#1c92c4', borderRadius: 40, height: 40, width: 40, alignItems: 'center', justifyContent: 'center'}}>
                                <Icon name='ios-trophy' type={'Ionicons'} style={{fontSize: 18, color: '#eee'}}/>
                            </View>
                        </View>
                        <View style={styles.transactionView}>
                            <View style={styles.textView}>
                                <Text style={styles.tText}>
                                    Your wallet was {item.t_type == 'credit' ? "credited by " : "debited by "} {item.points} points.
                                </Text>
                                <View style={{flexDirection: 'row', flexWrap: 'nowrap', width: "100%", alignItems: 'center', justifyContent: "space-between"}}>
                                    <Text style={styles.timeStamp}>{item.created_at.date}</Text>
                                    <Text style={[styles.timeStamp, {paddingRight: 20}]}>{item.created_at.time}</Text>
                                </View>
                            </View>
                            <View style={styles.pointsView}>
                                <Text style={item.t_type == 'credit' ? styles.credit : styles.debit}>{item.t_type == 'credit' ? "+ " + item.points : "- " + item.points }</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 1 / 3, width: '100%', backgroundColor: '#c9cacc' }}></View>
                </View>
            )
        })
        this.setState({refreshing: false})
    }

    render() {
        if(this.state.loading && this.state.totalPonts === "") {
            return (
                <View style={{alignItems: 'center', justifyContent: 'flex-start', marginTop: 25}}>
                    <ActivityIndicator size="large" color="#1c92c4" />
                </View>
            )
        }
        return (

            <Container style={{flex:1}}>
                {/* { this.state.loading ? */}
                <ScrollView
                    contentContainerStyle={{ flex: 1, alignItems: 'center' }} 
                    // refreshControl={
                    //     <RefreshControl
                    //         refreshing={this.state.loading}
                    //         onRefresh={() => {
                    //             this.loadProfile()
                    //             this.loadTransactions()
                    //             this.loadBalance()
                    //         }}
                    //     />
                    // }
                    scrollEnabled={true}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "100%", padding: 20 }}>
                        <View style={{ alignItems: 'center', justifyContent: 'space-evenly', width: '35%' }}>
                            <Image
                                style={{ borderRadius: 70, width: 70, height: 70, aspectRatio: 1 / 1, margin: 10 }}
                                source={thumbnail}
                                resizeMode='stretch'
                            />
                            <TouchableOpacity style={styles.editBtn}>
                                <Text style={styles.editText}>Edit profile</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'flex-start', width: '65%', padding: 15 }}>
                            {/* <H2>{this.props.firstName + ' ' + this.props.lastName}</H2> */}
                            <H2 style={styles.textLeft}>{this.userData.username}</H2>
                            <Text style={[styles.coloredText, styles.textLeft]}>{this.userData.email}</Text>
                            <Text style={[styles.textLeft, styles.helperText]}>Mobile: <Text style={styles.mobilNo}>{this.userData.moblie_no}</Text></Text>
                            <Text style={[styles.textLeft, styles.helperText]}>Working At, <Text style={styles.companyName}>{this.userData.company_name}</Text></Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: "100%", padding: 3 }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                            <Text style={styles.text}>Kudos</Text>
                            <H3 style={this.state.selectedTab == 0 ? styles.textActive : styles.textInactive}>9</H3>
                        </View>
                        <View style={{ backgroundColor: '#000', width: 1 / 3, height: '65%' }} />
                        <View style={{ alignItems: 'center', justifyContent: 'space-around', width: '33%' }}>
                            <Text style={styles.text}>Rewards</Text>
                            <H3 style={this.state.selectedTab == 1 ? styles.textActive : styles.textInactive}>{this.state.totalPonts}</H3>
                        </View>
                        <View style={{ backgroundColor: '#000', width: 1 / 3, height: '65%' }} />
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                            <Text style={styles.text}>Endorses</Text>
                            <H3 style={this.state.selectedTab == 2 ? styles.textActive : styles.textInactive}>25</H3>
                        </View>
                    </View>

                    {/* <View style={{flex: 1, alignItems: 'center'}}> */}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <View style={styles.tabHeader}>
                            <TouchableOpacity onPress={() => this.pager.setPage(0)} style={styles.iconTouch}>
                                <Icon name='md-thumbs-up' style={this.state.selectedTab === 0 ? styles.iconActive : styles.iconInactive} />
                                {/* <H3 style={{ textAlign: 'center' }}>9</H3>
                            <Text style={styles.coloredText} >Thanks</Text> */}
                            </TouchableOpacity>

                            {/* <View style={{ backgroundColor:'#000',width:1,height:'50%'}}/> */}

                            <TouchableOpacity onPress={() => this.pager.setPage(1)} style={styles.iconTouch}>
                                <Icon name='wallet' type={'Entypo'} style={this.state.selectedTab === 1 ? styles.iconActive : styles.iconInactive} />
                                {/* <Icon1 name="wallet" size={30} color="#900" /> */}
                                {/* <H3 style={{ textAlign: 'center' }}>100</H3>
                            <Text style={styles.coloredText} >Points</Text> */}
                            </TouchableOpacity>

                            {/* <View style={{backgroundColor:'#000',width:1,height:'50%'}}/> */}

                            <TouchableOpacity onPress={() => this.pager.setPage(2)} style={styles.iconTouch}>
                                <Icon name='md-people' style={this.state.selectedTab === 2 ? styles.iconActive : styles.iconInactive} />

                                {/* <H3 style={{textAlign:'center'}}>5</H3>
                            <Text style={styles.coloredText} >Endorses</Text> */}
                            </TouchableOpacity>
                        </View>
                        <IndicatorViewPager
                            initialPage={1}
                            ref={ref => this.pager = ref}
                            style={styles.viewPager}
                            onPageSelected={(page) => this.setState({ selectedTab: page.position })}
                        >
                            <View>
                                <ScrollView
                                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', padding: 20 }}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => { this.setState({ refreshing: false }) }}
                                        />
                                    }>
                                    <Icon name='worker' type={'MaterialCommunityIcons'} style={{ fontSize: 22, color: '#8a8b8c' }} />
                                    <Text style={{ color: '#8a8b8c', textAlign: 'center', marginTop: 15, width: '80%' }}>This page is under Development for Future Releases.</Text>
                                </ScrollView>
                            </View>
                            <View>
                                <ScrollView
                                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start' }}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => {
                                                this.loadTransactions()
                                                this.loadBalance()
                                            }}
                                        />
                                    }>
                                    {/* <View style={styles.card}>
                                        <Text style={{fontSize: 40, color: '#eee'}}>
                                            1123
                                        </Text>
                                        <Text style={{color: '#eee'}}>Total points</Text>
                                    </View>
                                    <View style={{ height: 1 / 3, width: '100%', backgroundColor: '#c9cacc' }}></View> */}
                                    {this.transactionList}
                                </ScrollView>
                            </View>
                            <View>
                                <ScrollView
                                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', padding: 20 }}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => { this.setState({ refreshing: false }) }}
                                        />
                                    }>
                                    <Icon name='worker' type={'MaterialCommunityIcons'} style={{ fontSize: 22, color: '#8a8b8c' }} />
                                    <Text style={{ color: '#8a8b8c', textAlign: 'center', marginTop: 15, width: '80%' }}>This page is under Development for Future Releases.</Text>
                                </ScrollView>
                            </View>
                        </IndicatorViewPager>
                    </View>
                </ScrollView>
                
                {/* <ActivityIndicator size="small" color="#1c92c4" /> */}
                <NavigationEvents
                    onWillFocus={() => {
                        if (this.props.isConnected) {
                            if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                this.loadBalance()
                                this.loadTransactions()
                                this.loadProfile()
                            }
                        }
                    }}
                />
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    coloredText:{
        fontSize: 14,
        color:'#1c92c4',
        fontFamily: "OpenSans-Regular",
        flexWrap: 'wrap'
    },
    companyName: {
        color: '#1c92c4',
        fontWeight: 'bold',
        flexWrap: 'wrap',
        // fontStyle: 'italic',
        fontFamily: "OpenSans-Regular"
    },
    mobilNo: {
        fontFamily: 'Roboto-Medium'
    },
    text: {
        fontSize: 13,
        fontFamily: "OpenSans-Regular",
        paddingBottom: 5
    },
    iconTouch: {
        alignItems: 'center',
        justifyContent: 'center',
        // height: 32,
        width: '33%',
        paddingHorizontal: 10
        // borderRadius: 32,
        // backgroundColor: "blue"
    }, 
    textLeft : {
        textAlign: 'left'
    },
    helperText: {
        fontFamily: 'OpenSans-Regular', 
        fontSize: 15
    },  
    textActive: {
        color: '#1c92c4',
        textAlign: 'center',
        fontWeight :'bold',
        fontSize: 22
        // marginTop: 5
    },
    textInactive: {
        textAlign : 'center'
    },
    iconActive: {
        fontSize: 26,
        color: '#1c92c4'
    },
    iconInactive: {
        fontSize: 26,
        color: '#8a8b8c'
    },
    tabHeader: {
        borderTopWidth: 1 / 5,
        borderBottomWidth: 1 / 5,
        flexDirection: 'row',
        // margin: 10,
        marginTop: 5,
        marginBottom: 0,
        padding: 3,
        // height: 35,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },  
    viewPager: {
        flex:1,
        width: '100%'
        // padding: 5
    },
    // card: {
    //     width: '98%',
    //     alignItems: 'center', 
    //     justifyContent: 'center', 
    //     height: 120, 
    //     backgroundColor: 'rgba(28, 146, 196,0.9)', 
    //     marginTop: 5,
    //     shadowOffset: { width: 5, height: 5 },
    //     shadowColor: 'black',
    //     shadowOpacity: 0.2,
    //     elevation: 2
    // },
    transactionContainer: {
        flex:1,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    iconView: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    transactionView : {
        width: '80%',
        paddingLeft: 10,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    textView: {
        width: "80%",
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    debit: {
        color: 'red',
        fontSize: 17,
        fontWeight: 'bold',
        fontFamily: "OpenSans-Regular"
    },
    credit: {
        color: 'green',
        fontSize: 17,
        fontWeight: 'bold',
        fontFamily: "OpenSans-Regular"
    },
    tText: {
        fontFamily: "OpenSans-Regular",
        fontSize: 15
    },
    pointsView: {
        height: 30,
        width: "20%",
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    timeStamp: {
        color: '#aaa',
        fontSize: 12,
        marginTop:7,
        textAlign: 'left',
        fontFamily: "OpenSans-Regular"
    },
    // Edit profile button style classes
    editText: {
        color: '#FFF',
        fontFamily: "OpenSans-Regular",
        fontSize: 14
    },
    editBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1c92c4',
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 3
    }
  
});

const mapStateToProps = (state) => {
    return {
        email: state.user.emailAddress,
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isConnected: state.system.isConnected,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall
    };
}

export default connect(mapStateToProps, null)(Home)