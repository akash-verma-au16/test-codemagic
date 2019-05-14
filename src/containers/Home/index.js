import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    RefreshControl,
    Image,
    BackHandler,
    ActivityIndicator,
    Modal,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Alert,
    Keyboard,
    ToastAndroid
} from 'react-native';

import NetInfo from "@react-native-community/netinfo"

import {
    Container,
    Text,
    Icon,
    H3,
    Toast,
    Root

} from 'native-base';

import { IndicatorViewPager } from 'rn-viewpager';
//Post Component
import Post from '../../components/Post/index'
//Card component
import Card from '../../components/Card/index'

/* Redux */
import { connect } from 'react-redux'
import { dev } from '../../store/actions'

//Row data for Home & Summary tab
// import { homeData } from './data'
import { dummyData, strngthIcon } from '../../components/Card/data'

// API methods
import { read_transaction, user_profile } from '../../services/profile'
import { list_posts } from '../../services/post'
import { strength_counts, update_profile } from '../../services/profile'

/* Assets */
import thumbnail from '../../assets/thumbnail.jpg'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            homeRefreshing: false,
            refreshing: false,
            summaryRefreshing: false,
            loading: true,
            isSignInLoading: false,
            selectedTab: 0,
            modalVisible: false,
            firstName: "",
            lastName: "",
            email: "",
            phoneNo: "",
            isSaved: false,
            isEdit: false
            // editProfile: {
            //     firstName: "",
            //     lastName: "",
            //     email: "",
            //     phoneNo: "",
            //     isSaved: false,
            //     isEdit: false
            // }
        }
        this.loadProfile = this.loadProfile.bind(this)
        // this.loadBalance = this.loadBalance.bind(this)
        this.loadTransactions = this.loadTransactions.bind(this)
        this.loadData = this.loadData.bind(this)
        this.loadHome = this.loadHome.bind(this)
        this.loadSummary.bind(this)
        this.showToast = this.showToast.bind(this)
        this.handleEditProfile = this.handleEditProfile.bind(this)
        this.pager = React.createRef();
        this.homeDataList = []
        this.projectList = []
        this.transactionList = []
        this.summeryList = []
        this.transactionDataBackup = []
        this.homeDataBackup = []
        this.userData = []
        // this.totalPoints = this.loadBalance()
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
        this.loadData()
    }

    componentDidMount() {
        // Calling transaction list API after render method
        this.loadTransactions()

        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });

        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);

        this.loadHome()
        this.loadSummary()
    }

    componentWillUnmount() {
        this.backHandler.remove();
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = (isConnected) => {
        if (isConnected) {
            // this.loadBalance()
            this.loadProfile()
            this.loadTransactions()
            this.loadHome()
            this.loadSummary()
        }
    }
    comingSoon() {
        Toast.show({
            text: 'Coming soon',
            type: 'success',
            duration: 3000
        })
    }

    async loadData() {
        // await this.loadBalance()
        await this.loadProfile()
        // await this.loadTransactions()
        this.setState({loading: false})
    }

    //Load user profile API Handler
    async loadProfile() {
        this.projectList = []
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.props.associate_id
        }
        try {
            if (payload.tenant_id !== "" && payload.associate_id !== "") {
                // console.log("Calling user_profile")
                await user_profile(payload).then((response) => {
                    this.userData = response.data.data
                    this.userData.project_name.map((item) => {
                        if (!this.projectList.includes(item.name)) {
                            this.projectList.push(item.name)
                            console.log(this.projectList)
                        }
                    })

                }).catch((error) => {
                    console.log(error)
                })
            }
        }
        catch(error) {
            // this.setState({ loading: false })
            console.log("error", error.code)
        }
        // this.setState({loading: true})
    }

    loadHome() {
        // this.homeDataList = []
        this.setState({
            homeRefreshing: true
        })
        // console.log("user", this.userData.username)
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.props.associate_id
        }
        try {
            if (payload.tenant_id !== "" && payload.associate_id !== "") {
                
                list_posts(payload).then((response) => {
                    if(this.homeDataBackup.length === response.data.data.length) {
                        if(response.data.data.length === 0) {
                            this.homeDataList = []
                            this.homeDataList.push(<Text style={{ margin: 10 }} key={0}>No post to display</Text>)
                            this.homeDataList.push(<Text style={{ margin: 10 }} key={1}>Create a new post by clicking on + icon on <Text style={{fontWeight: 'bold', fontStyle: 'italic'}}>Home</Text></Text>)
                        }
                        this.setState({ homeRefreshing: false })
                        return
                    } else {
                        this.homeDataBackup = response.data.data
                        this.homeDataList = []
                        response.data.data.map((item, index) => {
                            this.homeDataList.push(
                                // Post Component
                                <Post
                                    key={index}
                                    postCreator={item.Item.associate_name}
                                    time={item.Item.time}
                                    postMessage={item.Item.message}
                                    taggedAssociates={item.Item.tagged_associates}
                                    strength={item.Item.sub_type}
                                    associate={item.Item.associate_id}
                                />
                            )
                        })
                        this.setState({ homeRefreshing: false })
                    }
                }).catch((e) => {
                    this.setState({ homeRefreshing: false })
                    console.log(e)
                })
            }
        }
        catch(error) {
            this.setState({ homeRefreshing: false })
            console.log(error)
        }
    }

    loadSummary = () => {
        this.summeryList = []
        this.setState({summaryRefreshing: true})
        // const payload = {
        //     "tenant_id": this.props.accountAlias,
        //     "associate_id": this.props.associate_id
        // }
        // try {
        //     strength_counts(payload).then((response) => {
        //         console.log("Strengths", response)
        //     }).catch((e) => {
        //         this.setState({ summaryRefreshing: true })
        //     })
        // }
        // catch(e){
        //     this.setState({ summaryRefreshing: true })
        // }
        dummyData.map((item, index) => {
            const imageURI = strngthIcon.filter((endorse) => {
                if (item.type == 'endorsement') {
                    return item.sub_type == endorse.name
                } else {
                    return item.type == endorse.name.toLowerCase()
                }
            })
            this.summeryList.push(
                <Card 
                    key ={index}
                    image={imageURI[0].source}
                    count ={item.count}
                    strength={item.sub_type}
                />
            )
        })
        this.setState({ summaryRefreshing: false })

    }

    async handleEditProfile(){
        Keyboard.dismiss()
        this.comingSoon()
        // if(this.state.isEdit) {
        //     if(this.state.firstName == "") {
        //         Toast.show({
        //             text: 'Please enter First Name',
        //             type: 'danger',
        //             duration: 2000
        //         })
        //     }
        //     else if(this.state.lastName == "") {
        //         Toast.show({
        //             text: 'Please enter Last Name',
        //             type: 'danger',
        //             duration: 2000
        //         })
        //     }
        //     else if(this.state.email == "" || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email) == false) {
        //         Toast.show({
        //             text: 'Please enter valid Email',
        //             type: 'danger',
        //             duration: 2000
        //         })
        //     }
        //     else if (this.state.phoneNo == "" || /^\d{10}$/.test(this.state.phoneNo) === false) {
        //         Toast.show({
        //             text: 'Please enter valid Phone Number',
        //             type: 'danger',
        //             duration: 2000
        //         })
        //     }
        //     else {
        //         try {
        //             const payload = {
        //                 "tenant_id": this.props.accountAlias,
        //                 "associate_id": this.props.associate_id,
        //                 "first_name": this.state.firstName,
        //                 "last_name": this.state.lastName,
        //                 "email": this.state.email,
        //                 "phone_number": this.state.phoneNo
        //             }
        //             console.log(payload)
        //             await update_profile(payload).then((res) => {
        //                 console.log(res)
        //                 ToastAndroid.showWithGravityAndOffset(
        //                     'Updating',
        //                     ToastAndroid.LONG,
        //                     ToastAndroid.BOTTOM,
        //                     25,
        //                     100,
        //                 );
        //             }).catch((e) => {
        //                 console.log(e)
        //             })
        //         }
        //         catch(e) {
        //             console.log(e)
        //         }
        //         await this.loadProfile()
        //         const payload = {
        //             firstName: this.state.firstName,
        //             lastName: this.state.lastName,
        //             phoneNumber: this.state.phoneNo,
        //             emailAddress: this.state.email
        //         }
        //         this.props.updateUser(payload)
        //         this.setState({ submit: false, isEdit: false })
        //         this.setModalVisible(false)
        //     }
        // }
    }

    openModal = () => {
        this.setState({
            modalVisible: true,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            email: this.userData.email,
            phoneNo: this.userData.moblie_no.slice(3).toString()

        })
    }

    requestCloseModal = () => {
        if(this.state.isEdit) {
            Alert.alert(
                'Unsaved changes',
                'You have not saved changes. Are you sure that you want to cancel?',
                [
                    {
                        text: 'No',
                        style: 'cancel'
                    },
                    {
                        text: 'Yes', onPress: () => {
                            this.setModalVisible(false)
                            this.setState({isEdit: false})
                        }
                    }
                ],
                { cancelable: false },
            )
        }
        else {
            this.setModalVisible(false)
        }
        // this.setModalVisible(false)
    }

    //Helper functions
    showToast = () => {
        Toast.show({
            text: 'Please, connect to the internet',
            type: 'danger',
            duration: 2000
        })
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    // Get Transaction list API Handler
    async loadTransactions() {
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.props.associate_id
        }
        try {
            if (payload.tenant_id !== "" && payload.associate_id !== "") {
                this.setState({ refreshing: true })
                // console.log("Calling read_transaction API")
                await read_transaction(payload).then(response => {
                    if (this.transactionDataBackup.length === response.data.data.transaction_data) {
                        if (response.data.data.transaction_data.length == 0) {
                            this.transactionList = []
                            this.transactionList.push(
                                <Text style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 20 }} key={0}>No recent transactios found.</Text>
                            )
                        }
                        this.setState({ refreshing: false })
                    } else {
                        //Change in Payload
                        this.transactionDataBackup = response.data.data.transaction_data
                        if (this.transactionList.length !== 0) {
                            this.transactionList = []
                        }
                        this.createTransactionTile(response.data.data.transaction_data)
                        this.setState({ refreshing: false })
                    }
                }).catch((error) => {
                    this.setState({ refreshing: false })
                    console.log(error)
                })
            }
        }
        catch(error) {
            this.setState({ refreshing: false })
            console.log(error)
        }
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
                                    Your wallet was {item.t_type == 'credit' ? "credited with " : "debited with "} {item.points} points.
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
        if(this.state.loading) {
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
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flex: 1, alignItems: 'center' }} 
                    // scrollEnabled={true}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "100%", padding: 15 }}>
                        <View style={{ alignItems: 'center', justifyContent: 'space-evenly', width: '35%' }}>
                            <Image
                                style={{ borderRadius: 90, width: 90, height: 90, aspectRatio: 1 / 1, margin: 10 }}
                                source={thumbnail}
                                resizeMode='stretch'
                            />
                            <TouchableOpacity style={styles.editBtn} onPress={this.openModal} activeOpacity={0.9}>
                                <Text style={styles.editText}>Edit profile</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'flex-start', width: '65%', paddingLeft: 5}}>
                            {/* <H2>{this.props.firstName + ' ' + this.props.lastName}</H2> */}
                            <Text style={[styles.textLeft, styles.userName]} allowFontScaling numberOfLines={2}>{this.userData.username}</Text> 
                            {/* {this.userData.username} */}
                            <Text style={[styles.coloredText, styles.textLeft]} allowFontScaling numberOfLines={2}>{this.userData.email}</Text>
                            <Text style={[styles.textLeft, styles.helperText]} allowFontScaling numberOfLines={1}>Mobile: <Text style={styles.mobilNo}>{this.userData.moblie_no}</Text></Text>
                            <Text style={[styles.textLeft, styles.helperText]} allowFontScaling numberOfLines={2}>Projects: <Text style={styles.companyName}>{this.projectList.toString()}</Text></Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: "100%", padding: 3 }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                            <Text style={styles.text}>Home</Text>
                            <H3 style={this.state.selectedTab == 0 ? styles.textActive : styles.textInactive}>{this.homeDataList.length}</H3>
                        </View>
                        <View style={{ backgroundColor: '#000', width: 1 / 3, height: '65%' }} />
                        <View style={{ alignItems: 'center', justifyContent: 'space-around', width: '33%' }}>
                            <Text style={styles.text}>Rewards</Text>
                            <H3 style={this.state.selectedTab == 1 ? styles.textActive : styles.textInactive}>{this.userData.balance}</H3>
                        </View>
                        <View style={{ backgroundColor: '#000', width: 1 / 3, height: '65%' }} />
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                            <Text style={styles.text}>Activity</Text>
                            <H3 style={this.state.selectedTab == 2 ? styles.textActive : styles.textInactive}>14</H3>
                        </View>
                    </View>

                    {/* <ScrollView style={{flex: 1, alignItems: 'center'}}> */}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <View style={styles.tabHeader}>
                            <TouchableOpacity onPress={() => this.pager.setPage(0)} style={styles.iconTouch}>
                                <Icon name='md-home' type={'Ionicons'} style={this.state.selectedTab === 0 ? styles.iconActive : styles.iconInactive} />
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
                                <Icon name='list-alt' type={'FontAwesome'} style={this.state.selectedTab === 2 ? [styles.iconActive, {fontSize: 24}] : [styles.iconInactive, {fontSize: 23}] } />

                                {/* <H3 style={{textAlign:'center'}}>5</H3>
                            <Text style={styles.coloredText} >Endorses</Text> */}
                            </TouchableOpacity>
                        </View>
                        <IndicatorViewPager
                            initialPage={0}
                            ref={ref => this.pager = ref}
                            style={styles.viewPager}
                            onPageSelected={(page) => this.setState({ selectedTab: page.position })}
                        >
                            <View>
                                <ScrollView 
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 3, backgroundColor: '#eee'}}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.homeRefreshing}
                                            onRefresh={() => {
                                                if (this.props.isConnected) {
                                                    if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                                        this.loadHome()
                                                    }
                                                }
                                                else {
                                                    this.showToast()
                                                }
                                            }}
                                        />
                                    }>
                                    {this.homeDataList.length === 0 ? this.homeDataBackup : this.homeDataList}
                                </ScrollView>
                            </View>
                            <View>
                                <ScrollView 
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#eee' }}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => {
                                                if(this.props.isConnected) {
                                                    if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                                        this.loadTransactions()
                                                    }
                                                }
                                                else {
                                                    this.showToast()
                                                }
                                            }}
                                        />
                                    }>
                                    {this.transactionList}
                                </ScrollView>
                            </View>
                            <View>
                                <ScrollView 
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.cardContainer}
                                    scrollEnabled={true}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.summaryRefreshing}
                                            onRefresh={() => {
                                                if (this.props.isConnected) {
                                                    if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                                        this.loadSummary()
                                                    }
                                                }
                                                else {
                                                    this.showToast()
                                                }
                                            }}
                                        />
                                    }>
                                    {this.summeryList}
                                    {/* <Icon name='worker' type={'MaterialCommunityIcons'} style={{ fontSize: 22, color: '#8a8b8c' }} />
                                    <Text style={{ color: '#8a8b8c', textAlign: 'center', marginTop: 15, width: '80%' }}>This page is under Development for Future Releases.</Text> */}
                                </ScrollView>
                            </View>
                        </IndicatorViewPager>
                    </View>
                </ScrollView>
                
                <Modal
                    animationType="slide"
                    transparent={false} 
                    hardwareAccelerated={true}
                    visible={this.state.modalVisible}
                    onRequestClose={this.requestCloseModal}>
                    <KeyboardAvoidingView style={{ flex: 1 }} 
                        keyboardVerticalOffset={-290}
                        behavior="padding"
                        enabled
                    >
                        <Root>
                            <View style={[styles.modalCaontainer]}>
                                <View style={styles.headerContainer}>
                                    <View style={{width: '15%', alignItems: 'center', justifyContent: 'center'}}>
                                        <Icon name='close' type={'AntDesign'}
                                            style={{ color: '#000', padding: 5, fontSize: 26 }}
                                            onPress={this.requestCloseModal}
                                        />
                                    </View>

                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, width: "85%"}}>
                                        <Text style={styles.headerText}>Edit Profile</Text>
                                        
                                        <Icon name='check' type={'MaterialIcons'} 
                                            style={this.state.isEdit ? { color: '#1c92c4', padding: 5, fontSize: 27 } : { color: '#ccc', padding: 5, fontSize: 27 }}
                                            onPress={this.handleEditProfile}
                                        />
        
                                    </View>
                                </View>
                                <View style={{flex: 1, width: "100%"}}>
                                    <ScrollView
                                        contentContainerStyle={{ padding: 20, width:"100%"}} 
                                        showsVerticalScrollIndicator={false}
                                        scrollEnabled={true}
                                    >
                                        <View style={{alignItems: 'center', justifyContent: 'center', padding: 20}}>
                                            <View style={styles.imageWrapper}>
                                                <Image 
                                                    source={thumbnail} 
                                                    style={styles.profilePic}
                                                />
                                            </View>
                                            <TouchableOpacity>
                                                <Text style={styles.changePicText}>Change Profile Photo</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.textInputWraper}>
                                            <Text style={styles.fieldText}>First Name <Text style={{ color: '#1c92c4', fontSize: 14, fontWeight: 'bold'}}>*</Text></Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={this.state.firstName} 
                                                placeholder='First Name' 
                                                underlineColorAndroid= '#1c92c4'
                                                placeholderTextColor= '#ccc'
                                                onChangeText = {(text) => {
                                                    this.setState({
                                                        firstName: text,
                                                        isEdit: true
                                                    })
                                                }}
                                            />
                                        </View>
                                        <View style={styles.textInputWraper}>
                                            <Text style={styles.fieldText}>Last Name <Text style={{ color: '#1c92c4', fontSize: 14, fontWeight: 'bold' }}>*</Text></Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={this.state.lastName} 
                                                placeholder='Last Name' 
                                                underlineColorAndroid= '#1c92c4'
                                                placeholderTextColor= '#ccc' 
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        lastName: text,
                                                        isEdit: true
                                                    })
                                                }}
                                            />
                                        </View>
                                        <View style={styles.textInputWraper}>
                                            <Text style={styles.fieldText}>Email <Text style={{ color: '#1c92c4', fontSize: 14, fontWeight: 'bold' }}>*</Text></Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={this.state.email}
                                                placeholder='Email'
                                                underlineColorAndroid='#1c92c4' 
                                                keyboardType='email-address'
                                                placeholderTextColor= '#ccc' 
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        email: text,
                                                        isEdit: true
                                                    })
                                                }}
                                            />
                                        </View>
                                        <View style={styles.textInputWraper}>
                                            <Text style={styles.fieldText}>Phone Number</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={this.state.phoneNo}
                                                placeholder='Phone Number' 
                                                keyboardType='phone-pad'
                                                underlineColorAndroid= '#1c92c4'
                                                placeholderTextColor= '#ccc' 
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        phoneNo: text,
                                                        isEdit: true
                                                    })
                                                }}
                                            />
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </Root>
                    </KeyboardAvoidingView>
                </Modal>
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
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: "OpenSans-Regular",
        color: '#333'      
    },
    companyName: {
        color: '#1c92c4',
        fontSize: 15,
        fontWeight: 'bold',
        flexWrap: 'wrap',
        // fontStyle: 'italic',
        fontFamily: "OpenSans-Regular"
    },
    mobilNo: {
        fontSize: 14,
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
        width: "100%"
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
        fontSize: 25,
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
        height: 34,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },  
    viewPager: {
        flex:1,
        width: '100%'
        // padding: 5
    },
    transactionContainer: {
        flex:1,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
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
    },
    cardContainer: {
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between', 
        paddingHorizontal: 15,
        paddingTop: 15,
        backgroundColor: '#efefef'
    },
    modalCaontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width
    },
    headerContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        backgroundColor: '#fff',
        // height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth:0,
        shadowOffset: { width: 5, height: 0 },
        shadowColor: '#666',
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2
    },
    headerText: {
        textAlign: 'left',
        fontSize: 19,
        fontFamily: "OpenSans-Regular",
        fontWeight: '300'
    },
    fieldText: {
        textAlign: 'left',
        paddingBottom: 0,
        fontSize: 16,
        color: '#444',
        fontFamily: 'OpenSans-Regular'
    },
    textInputWraper: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: "100%",
        paddingVertical: 5
    }, 
    textInput: {
        width: "100%", 
        // padding: 0,
        paddingBottom: 15, 
        height: 45,
        fontSize: 15
    },
    profilePic: {
        height: 130,
        aspectRatio: 1 / 1,
        borderRadius: 130
    },
    imageWrapper: {
        height: 137, 
        width: 137, 
        borderRadius: 137, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderWidth: 7,
        borderColor: '#FFF',
        shadowOffset: { width: 7, height: 7 },
        shadowColor: '#333',
        shadowRadius: 2,
        shadowOpacity: 0.4,
        elevation: 5
    },
    changePicText: {
        fontSize: 18,
        fontFamily: 'OpenSans-Regular',
        fontWeight: "400",
        color: '#1c92c4',
        textAlign: 'center',
        padding: 20
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

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (props) => dispatch({ type: dev.UPDATE_USER, payload: props })
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)