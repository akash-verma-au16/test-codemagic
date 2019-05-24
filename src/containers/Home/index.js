import React from 'react';
import {
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

//styles
import { styles } from './styles'

import { IndicatorViewPager } from 'rn-viewpager';
//Post Component
import Post from '../../components/Post/index'
//Card component
import Card from '../../components/Card/index'

import VisibilityModal from '../../containers/VisibilityModal/index'
import axios from 'axios';

import ImageCropPicker from 'react-native-image-crop-picker';

/* For uploading Image to S3 */
import RNFetchBlob from 'rn-fetch-blob'

/* Redux */
import { connect } from 'react-redux'
import { dev } from '../../store/actions'

//Row data for Home & Summary tab
// import { homeData } from './data'
import { strngthIcon } from '../../components/Card/data'

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
            associate_id: this.props.navigation.getParam('associateId'),
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
            isEdit: false,
            //state value for VisibilityModal component
            visibilityModalVisible: false,
            isImageLoading: false,
            isApiLoading: false,
            photo: null,
            imageUrl: null,
            credentials: {
                tenant_name: 'happyworks testbbsg9v9gp',
                file_name: 'logo.png',
                associate_email: 'happyworks-test@gmail.com'
            }
        }
        this.props.navigation.setParams({ 'id': this.state.associate_id == this.props.associate_id || this.state.associate_id == undefined })
        console.log('Associate ID:',this.state.associate_id)
        this.loadProfile = this.loadProfile.bind(this)
        this.loadTransactions = this.loadTransactions.bind(this)
        this.loadData = this.loadData.bind(this)
        this.loadHome = this.loadHome.bind(this)
        this.loadSummary = this.loadSummary.bind(this)
        this.showToast = this.showToast.bind(this)
        this.handleEditProfile = this.handleEditProfile.bind(this)
        this.loadTransactions = this.loadTransactions.bind(this)
        this.pager = React.createRef();
        this.homeDataList = []
        this.homeDataRowList = []
        this.projectList = []
        this.transactionList = []
        this.summeryList = [] 
        this.summeryRawList = []
        this.transactionDataBackup = []
        this.homeDataBackup = []
        this.userData = this.state.associate_id == this.props.associate_id ? this.props.navigation.getParam('profileData') : {}
        console.log('Rec Obj',this.userData)
        this.dataList = []
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: (
                navigation.getParam('id') ? 
                    <Icon name='md-settings' style={
                        {
                            color: 'white',
                            margin: 20
                        }
                    } onPress={() => navigation.navigate('settings')} /> 
                    : 
                    <View style={{magin: 20}}></View>
            )
        };
    };
    
    async componentWillMount() {
        if (this.state.associate_id !== this.props.associate_id) {
            if (this.state.associate_id == undefined) {
                this.setState({ associate_id: this.props.associate_id })
                this.loadProfile()
            }
            console.log('Logged if')
            await this.loadProfile()
            // await this.setState({ loading: false })
        }
        else {
            console.log('Logged else')
            await this.loadData()
            this.setState({ loading: false })
        }
    }

    componentDidMount() {
        this.loadSummary()
        this.handleImageDownload()
        if(this.state.associate_id === this.props.associate_id) {
        // Calling transaction list API after render method
            this.loadTransactions()
        }

        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true;
        });

        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange)
    }

    componentWillUnmount() {
        this.backHandler.remove();
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = (isConnected) => {
        if (isConnected) {
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
        await this.loadHome()
    }

    headers = {
        headers: {
            Authorization: this.props.idToken
        }
    }
    //Load user profile API Handler
    loadProfile() {
        // this.projectList = []
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.state.associate_id
        }
        try {
            if (payload.tenant_id !== "" && payload.associate_id !== "") {
                console.log("Calling user_profile")
                user_profile(payload, this.headers).then((response) => {
                    // console.log(response)
                    this.userData = response.data.data
                    if (this.userData.length === 0) {
                        this.projectList = []
                        this.projectList.push('No Projects')
                    } else {
                        this.userData.project_details.map((item) => {
                            this.projectList = []
                            this.projectList.push(item.project_name)
                        })
                    }
                    this.setState({ loading: false })
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

    async loadHome() {
        this.setState({
            homeRefreshing: true
        })
        // console.log("user", this.userData.username)
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.state.associate_id
        }
        try {
            if (payload.tenant_id !== "" && payload.associate_id !== "") {
                
                await list_posts(payload, this.headers).then((response) => {
                    console.log('Calling Loadhome')
                    if(this.homeDataBackup.length === response.data.data.length) {
                        if(response.data.data.length === 0) {
                            this.homeDataRowList = []
                            if (this.state.associate_id !== this.props.associate_id) {
                                this.homeDataRowList.push(<Text style={{ margin: 10 }} key={0}>No posts found for this User.</Text>)
                            } 
                            else {
                                this.homeDataRowList.push(<Text style={{ margin: 10 }} key={0}>No post to display</Text>)
                                this.homeDataRowList.push(<Text style={{ margin: 10 }} key={1}>Create a new post by clicking on + icon on <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>Home</Text></Text>)
                            }
                           
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
                                    postCreator_id={item.Item.associate_id} 
                                    profileData={item.Item.associate_id == this.props.associate_id ? this.profileData : {}}
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
        // this.summeryList = []
        this.setState({summaryRefreshing: true})
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.state.associate_id
        }
        try {
            strength_counts(payload, this.headers).then((response) => {
                console.log("Strengths", response.data.data)
                if(response.data.data.length == 0) {
                    this.summeryRawList = []
                    this.summeryRawList.push(<Text key={0} style={{textAlign: 'center', width: '100%', alignItems: 'center', justifyContent: 'center'}}>No strengths to display.</Text>)
                }
                else {
                    this.summeryList = []
                    response.data.data.map((item, index) => {
                        const imageURI = strngthIcon.filter((endorse) => {
                            return item.sub_type == endorse.name
                        })
                        this.summeryList.push(
                            <View key={index}>
                                <Card
                                    image={imageURI[0].source}
                                    count={item.count}
                                    strength={item.sub_type}
                                />
                            </View>
                        )
                    })
                }
            }).catch((e) => {
                this.setState({ summaryRefreshing: false })
            })
        }
        catch(e){
            this.setState({ summaryRefreshing: false })
        }
        
        this.setState({ summaryRefreshing: false })

    }

    async handleEditProfile(){
        Keyboard.dismiss()
        if(this.state.isEdit) {
            this.setState({isEdit: false})
            if(this.state.firstName == "") {
                Toast.show({
                    text: 'Please enter First Name',
                    type: 'danger',
                    duration: 2000
                })
            }
            else if(this.state.lastName == "") {
                Toast.show({
                    text: 'Please enter Last Name',
                    type: 'danger',
                    duration: 2000
                })
            }
            else if(this.state.email == "" || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email) == false) {
                Toast.show({
                    text: 'Please enter valid Email',
                    type: 'danger',
                    duration: 2000
                })
            }
            else if (this.state.phoneNo == "" || /^\d{10}$/.test(this.state.phoneNo) === false) {
                Toast.show({
                    text: 'Please enter valid Phone Number',
                    type: 'danger',
                    duration: 2000
                })
            }
            else {
                try {
                    if(this.props.isConnected) {
                        const payload = {
                            "tenant_id": this.props.accountAlias,
                            "associate_id": this.props.associate_id,
                            "first_name": this.state.firstName,
                            "last_name": this.state.lastName,
                            "email": this.state.email,
                            "phone_number": "+91" + this.state.phoneNo
                        }
                        ToastAndroid.showWithGravityAndOffset(
                            'Updating',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            100,
                        );
                        await update_profile(payload,this.headers).then((res) => {
                            console.log(res)
                            this.setState({ imageUrl: this.state.photo }, () => this.handleUploadImage())

                        }).catch((e) => {
                            console.log(e)
                        })
                    }
                    else {
                        ToastAndroid.showWithGravityAndOffset(
                            'No Internet',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            100,
                        );
                        this.setState({ isEdit: true })
                        return
                    }
                }
                    
                catch(e) {
                    console.log(e)
                }
                //Updating redux state
                const payload = {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    phoneNumber: this.state.phoneNo,
                    emailAddress: this.state.email
                }
                this.props.updateUser(payload)
                await this.loadProfile()
                await this.loadHome()
                
                this.setState({ submit: false, isEdit: false })
                this.setModalVisible(false)
            }
        }
    }

    openModal = () => {
        this.setState({
            modalVisible: true,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            email: this.userData.email,
            phoneNo: this.userData.phonenumber.slice(3).toString()

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
                await read_transaction(payload, this.headers).then(response => {
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
    //Visibilty input data
    data = [
        { icon: 'camera', type: 'Entypo', text: 'Open Camera', name: 'open', key: 'open' },
        { icon: 'photo-library', type: 'MaterialIcons', text: 'Import From Gallery', name: 'import', key: 'import' }
    ]

    /* Upload image to AWS S3 */
    handleUploadImage = () => {
        /* Get signed URL */
        const endpoint = 'https://38fo7itjbj.execute-api.ap-southeast-1.amazonaws.com/api/file_upload'
        const { credentials } = this.state
        axios.post(endpoint, {
            'tenant_name': credentials.tenant_name,
            'file_name': credentials.file_name,
            'associate_email': credentials.associate_email
        })
            .then(async(response) => {
                console.log("Upload Image", response)
                const headers = {
                    'Content-Type': 'multipart/form-data'
                }
                var url = this.state.photo

                await RNFetchBlob.fetch('PUT', response.data.data['upload-signed-url'], headers, RNFetchBlob.wrap(url))
                    .then(() => {
                        console.log('image uploaded')
                        // this.setState({ }, () => this.handleImageDownload())
                        // this.setTimeout(() => this.handleImageDownload(), 3000)
                        // this.handleImageDownload()
                    }).catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log('error', error)
            })
    }

    /* Get image from S3 */
    handleImageDownload = () => {
        console.log("Calling handleImageDownload")
        this.setState({ isImageLoading: true })
        /* Request image*/
        const endpoint = 'https://38fo7itjbj.execute-api.ap-southeast-1.amazonaws.com/api/file_download'
        const { credentials } = this.state
        axios.post(endpoint, {
            "tenant_name": credentials.tenant_name,
            "file_name": credentials.file_name,
            "associate_email": credentials.associate_email
        }).then((response) => {
            console.log("Image response", response)
            /* Store the image */
            this.setState({ isImageLoading: false, imageUrl: response.data.data['download-signed-url'] })
        }).catch((error) => {
            console.log(error)
        })
    }

    /* Load image from camera */
    handleChoosePhotoFromCamera = async () => {
        const options = {
            noData: true
        }
        /* Request permissions and import image */
        await ImageCropPicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image);

            let updatedResponse = image
            updatedResponse.fileName = 'logo.png'

            /* store the image */
            this.setState({ photo: updatedResponse.path, isEdit: true })
        }).catch((e) => {
            console.log("error", e.code)
            if (e.code == "E_PICKER_CANCELLED") {
                return
            }
            else {
                alert('Please provide the permission')
            }
        })
    }
    /* Load image from gallary or internal storage */
    handleChoosePhotoFromLibrary = () => {
        /* Request permissions and import image */
        ImageCropPicker.openPicker({
            width: 100,
            height: 100,
            cropping: true
        }).then(image => {
            console.log(image);

            let updatedResponse = image
            updatedResponse.fileName = 'logo.png'

            /* store the image */
            this.setState({ photo: updatedResponse.path, isEdit: true })

        }).catch((e) => {
            console.log("error", e.code)
            if (e.code == "E_PICKER_CANCELLED") {
                return
            }
            else {
                alert('Please provide the permission')
            }
        })
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
                            <View style={styles.tbWrapper}>
                                {!this.state.isImageLoading ?
                                    <Image
                                        style={{ borderRadius: 90, width: 90, height: 90, aspectRatio: 1 / 1, margin: 10 }}
                                        source={{ uri: this.state.imageUrl }}
                                        resizeMode='stretch'
                                    />
                                    :
                                    <ActivityIndicator size='small' color="#1c92c4" />
                                }
                                
                            </View>
                            {
                                this.state.associate_id === this.props.associate_id ?
                                    <TouchableOpacity style={styles.editBtn} onPress={this.openModal} activeOpacity={0.9}>
                                        <Text style={styles.editText}>Edit profile</Text>
                                    </TouchableOpacity>
                                    :
                                    null
                            }
                            
                        </View>
                        <View style={{ alignItems: 'flex-start', width: '65%', paddingLeft: 5}}>
                            {
                                this.state.associate_id === this.props.associate_id ? 
                                    <Text style={[styles.textLeft, styles.userName]} allowFontScaling numberOfLines={2}>{this.props.firstName + " " + this.props.lastName}</Text>
                                    :
                                    <Text style={[styles.textLeft, styles.userName]} allowFontScaling numberOfLines={2}>{this.userData.first_name + " " + this.userData.last_name}</Text> 

                            }
                            <Text style={[styles.coloredText, styles.textLeft]} allowFontScaling numberOfLines={2}>{this.userData.email}</Text>
                            <Text style={[styles.textLeft, styles.helperText]} allowFontScaling numberOfLines={1}>Mobile: <Text style={styles.mobilNo}>{this.userData.phonenumber}</Text></Text>
                            <Text style={[styles.textLeft, styles.helperText]} allowFontScaling numberOfLines={2}>Projects: <Text style={styles.companyName}>{this.projectList.toString()}</Text></Text>
                        </View>
                    </View>

                    {
                        this.state.associate_id === this.props.associate_id ? 
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: "100%", padding: 3 }}>
                                <TouchableOpacity onPress={() => this.pager.setPage(0)} style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                                    <Text style={styles.text}>Home</Text>
                                    <H3 style={this.state.selectedTab == 0 ? styles.textActive : styles.textInactive}>{this.homeDataList.length}</H3>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: '#000', width: 1 / 3, height: '65%' }} />
                                <TouchableOpacity onPress={() => this.pager.setPage(1)} style={{ alignItems: 'center', justifyContent: 'space-around', width: '33%' }}>
                                    <Text style={styles.text}>Rewards</Text>
                                    <H3 style={this.state.selectedTab == 1 ? styles.textActive : styles.textInactive}>{this.userData.wallet_balance}</H3>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: '#000', width: 1 / 3, height: '65%' }} />
                                <TouchableOpacity onPress={() => this.pager.setPage(2)} style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                                    <Text style={styles.text}>Strengths</Text>
                                    <H3 style={this.state.selectedTab == 2 ? styles.textActive : styles.textInactive}>{this.summeryList.length}</H3>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: "100%", padding: 3 }}>
                                <TouchableOpacity onPress={() => this.pager.setPage(0)} style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                                    <Text style={styles.text}>Home</Text>
                                    <H3 style={this.state.selectedTab == 0 ? styles.textActive : styles.textInactive}>{this.homeDataList.length}</H3>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: '#000', width: 1 / 3, height: '65%' }} />
                                <TouchableOpacity onPress={() => this.pager.setPage(1)} style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                                    <Text style={styles.text}>Strengths</Text>
                                    <H3 style={this.state.selectedTab == 1 ? styles.textActive : styles.textInactive}>{this.summeryList.length}</H3>
                                </TouchableOpacity>
                            </View>
                    }
                        
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        {
                            this.state.associate_id === this.props.associate_id ?
                                <View style={styles.tabHeader}>
                                    <TouchableOpacity onPress={() => this.pager.setPage(0)} style={styles.iconTouch}>
                                        <Icon name='md-home' type={'Ionicons'} style={this.state.selectedTab === 0 ? styles.iconActive : styles.iconInactive} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.pager.setPage(1)} style={styles.iconTouch}>
                                        <Icon name='wallet' type={'Entypo'} style={this.state.selectedTab === 1 ? styles.iconActive : styles.iconInactive} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.pager.setPage(2)} style={styles.iconTouch}>
                                        <Icon name='list-alt' type={'FontAwesome'} style={this.state.selectedTab === 2 ? [styles.iconActive, { fontSize: 24 }] : [styles.iconInactive, { fontSize: 23 }]} />
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.tabHeader}>
                                    <TouchableOpacity onPress={() => this.pager.setPage(0)} style={styles.iconTouch}>
                                        <Icon name='md-home' type={'Ionicons'} style={this.state.selectedTab === 0 ? styles.iconActive : styles.iconInactive} />
                                    </TouchableOpacity>
                                    <View style={{ backgroundColor: '#000', width: 1 / 3, height: '65%' }} />
                                    <TouchableOpacity onPress={() => this.pager.setPage(1)} style={styles.iconTouch}>
                                        <Icon name='list-alt' type={'FontAwesome'} style={this.state.selectedTab === 1 ? [styles.iconActive, {fontSize: 24}] : [styles.iconInactive, {fontSize: 23}] } />
                                    </TouchableOpacity>
                                </View>
                        }
                        
                        <IndicatorViewPager
                            initialPage={0}
                            ref={ref => this.pager = ref}
                            style={styles.viewPager}
                            onPageSelected={(page) => this.setState({ selectedTab: page.position })}
                        >
                            <View>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 3, backgroundColor: '#eee' }}
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
                                    {this.homeDataList.length === 0 ? this.homeDataRowList : this.homeDataList}
                                </ScrollView>
                            </View>
                            {
                                this.state.associate_id === this.props.associate_id ? 
                                    <View>
                                        <ScrollView
                                            showsVerticalScrollIndicator={false}
                                            contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#eee' }}
                                            refreshControl={
                                                <RefreshControl
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={() => {
                                                        if (this.props.isConnected) {
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
                                    :
                                    null
                            }
                            
                            <View style={{ flex: 1, backgroundColor: '#efefef'}}>
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
                                    {this.summeryList.length > 0 ? this.summeryList : this.summeryRawList}
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
                                        <TouchableOpacity style={{height: 35, borderRadius: 30, aspectRatio: 1/1}} onPress={this.handleEditProfile}>
                                            <Icon name='check' type={'MaterialIcons'} 
                                                style={this.state.isEdit ? { color: '#1c92c4', padding: 5, fontSize: 27 } : { color: '#ccc', padding: 5, fontSize: 27 }}
                                            />
                                        </TouchableOpacity>
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
                                                
                                                {!this.state.isImageLoading ? (
                                                    <Image
                                                        source={{ uri: this.state.isEdit && this.state.photo !== null ? this.state.photo : this.state.imageUrl}}
                                                        style={styles.profilePic}
                                                    />
                                                ) : (
                                                    <ActivityIndicator size='large' color="#1c92c4" />
                                                )
                                                }    
                                            </View>
                                            <TouchableOpacity onPress={() => this.setState({ visibilityModalVisible: true})}>
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
                                                editable={false}
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
                                <VisibilityModal
                                    enabled={this.state.visibilityModalVisible}
                                    data={ this.data }
                                    onChangeListener={({ text, name, key }) => {
                                        if(key == 'open') {
                                            this.handleChoosePhotoFromCamera()
                                        }
                                        else {
                                            this.handleChoosePhotoFromLibrary()
                                        }
                                    }}
                                    visibilityDisableHandler={() => {
                                        this.setState({ visibilityModalVisible: false })
                                    }}
                                    onRequestClose={() => {
                                        this.setState({ visibilityModalVisible: false })
                                    }}
                                />
                            </View>
                        </Root>
                    </KeyboardAvoidingView>
                </Modal>
            </Container>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.user.emailAddress,
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isConnected: state.system.isConnected,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        idToken: state.user.idToken
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (props) => dispatch({ type: dev.UPDATE_USER, payload: props })
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)