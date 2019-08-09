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

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo"
import { user, auth } from '../../store/actions'
import {
    Container,
    Text,
    Icon,
    H3,
    Toast,
    Root

} from 'native-base';

// Components from Moment.js
import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'

//styles
import { styles } from './styles'

import { IndicatorViewPager } from 'rn-viewpager';
//Post Component
import Post from '../../components/Post/index'
//Card component
import Card from '../../components/Card/index'

import VisibilityModal from '../../containers/VisibilityModal/index'

import ImageCropPicker from 'react-native-image-crop-picker';

/* For uploading Image to S3 */
import RNFetchBlob from 'rn-fetch-blob'

import { NavigationEvents } from 'react-navigation';

/* Redux */
import { connect } from 'react-redux'
import { dev } from '../../store/actions'

//RBAC handler function
import { checkIfSessionExpired } from '../RBAC/RBAC_Handler'

//Loading Modal
import LoadingModal from '../LoadingModal'

// import { homeData } from './data'
import { strngthIcon } from '../../components/Card/data'

// API methods
import { read_transaction, user_profile, strength_counts, update_profile, file_download, file_upload } from '../../services/profile'
import { list_posts, delete_post } from '../../services/post'

/* Assets */
// import thumbnail from '../../assets/thumbnail.jpg'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            postList: [],
            transactionList: [],
            summeryList: [],
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
            photo: null,
            imageUrl: null,
            isPostDeleted: false,
            walletBalance: this.props.walletBalance,
            strengthCount: "0"
        }
        this.handleEditProfile = this.handleEditProfile.bind(this)
        this.props.navigation.setParams({ 'id': this.state.associate_id == this.props.associate_id || this.state.associate_id == undefined })
        this.pager = React.createRef();
        this.posts = []
        this.counts = []
        this.homeDataList = [] 
        this.homeDataRowList = []
        this.projectList = []
        this.transactionList = []
        this.summeryList = []
        this.summeryRawList = []
        this.transactionDataBackup = []
        this.homeDataBackup = []
        this.userData = {}
        this.dataList = []

        Moment.globalMoment = moment;
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
                    <View style={{ magin: 20 }}></View>
            )
        };
    };

    async componentWillMount() {
        this.setState({homeRefreshing: true, summaryRefreshing: true})
        if (this.state.associate_id !== this.props.associate_id) {
            if (this.state.associate_id == undefined || this.state.associate_id == "") {
                await this.setState({ associate_id: this.props.associate_id })
                this.loadSummary()
            }
        }
        else {
            this.setState({refreshing: true})
            if (this.userData == {}) {
                this.loadProfile()
            }
        }
    }

    async componentDidMount() {
        if (this.props.navigation.getParam('isPost')) {
            await this.loadProfile()
        }

        this.interval = setInterval(() => {
            // Calling transaction list API after render method
            this.loadTransactions()
            if(!this.state.isPostDeleted) {
                // avoid collision between two methods
                this.loadHome()
            }
            this.loadSummary()
        }, 10000);
        this.loadSummary()
        if (this.state.associate_id === this.props.associate_id) {
            this.handleImageDownload()
        }

        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true;
        });

        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
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

    //Load user profile API Handler
    loadProfile() {
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.state.associate_id
        }
        //Authemtication header
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }
        try {
            if (payload.tenant_id !== "" && payload.associate_id !== "") {
                user_profile(payload,headers).then((response) => {
                    this.userData = response.data.data
                    if (this.state.associate_id !== this.props.associate_id) {
                        this.handleImageDownload()
                    }
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
                    const isSessionExpired = checkIfSessionExpired(error.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                    if (!isSessionExpired) {
                        this.loadProfile()
                        return
                    }
                })
            }
        }
        catch (error) {/* error */ }
    }

    deletePost = (postId) => {
        if (this.props.isConnected) {
            this.setState({ isPostDeleted: true })
            const payload = {
                Data: {
                    post_id: postId,
                    tenant_id: this.props.accountAlias,
                    ops: "delete_post",
                    associate_id: this.props.associate_id
                }
            }
            //Authemtication header
            const headers = {
                headers: {
                    Authorization: this.props.accessToken
                }
            }

            try {
                delete_post(payload,headers).then(async(res) => {
                    if (res.status === 200) {
                        var index = this.posts.findIndex((post) => { return post.Item.post_id == postId })
                        this.homeDataList.splice(index, 1)
                        this.posts.splice(index, 1)
                        if (this.posts.length == 0) {
                            this.setState({ noData: true })
                        }
                        this.setState({ postList: this.homeDataList })
                        setTimeout(() => this.setState({ isPostDeleted: false }), 2000)
                    }
                }).catch((e) => {
                    const isSessionExpired = checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                    if (!isSessionExpired) {
                        this.deletePost(postId)
                        return
                    }
                })
            }
            catch (e) {/* error */ }
        }
        else {
            this.showToast()
        }
    }

    async loadHome() {
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.state.associate_id
        }

        //Authemtication header
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }
        try {
            if (payload.tenant_id !== "" && payload.associate_id !== "") {

                await list_posts(payload,headers).then((response) => {
                    if(this.homeDataBackup.length === response.data.data.posts.length) {
                        if(response.data.data.posts.length === 0) {
                            this.homeDataList = []
                            this.homeDataList.push(
                                <Text style={{ textAlign: 'center', width: '100%', alignItems: 'center', justifyContent: 'center' }}>No posts found.</Text>
                            )
                            this.setState({ postList: this.homeDataList, homeRefreshing: false })
                            return
                        }
                        response.data.data.posts.map((item, index) => {
                            item.Item.likeCount = response.data.data.counts[index].likeCount
                            item.Item.commentCount = response.data.data.counts[index].commentCount
                            item.Item.addOnPoints = response.data.data.counts[index].addOnPoints

                        })
                        if (JSON.stringify(this.posts) !== JSON.stringify(response.data.data.posts)) {
                            this.posts = response.data.data.posts
                            this.createTiles(this.posts)
                        }
                        else {
                            this.setState({
                                homeRefreshing: false
                            })
                            return
                        }

                    } else {
                        this.homeDataBackup = response.data.data.posts
                        this.posts = response.data.data.posts
                        this.counts = response.data.data.counts
                        this.posts.map((item, index) => {
                            item.Item.likeCount = this.counts[index].likeCount
                            item.Item.commentCount = this.counts[index].commentCount
                            item.Item.addOnPoints = this.counts[index].addOnPoints
                        })
                        this.createTiles(this.posts)
                    }
                }).catch((e) => {
                    const isSessionExpired = checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                    if (!isSessionExpired) {
                        this.loadHome()
                        return
                    }
                    this.setState({ homeRefreshing: false })
                })
            }
        }
        catch (error) {
            this.setState({ homeRefreshing: false })
        }
    }

    createTiles = (posts) => {
        this.homeDataList = []
        posts.map(async (item) => {
            /* Convert Array of objects to array of strings */
            let associateList = []
            item.Item.tagged_associates.map((item) => {
                associateList.push(item.associate_id)
            })

            /* retrive names in bulk */
            let fetchedNameList = await AsyncStorage.multiGet(associateList)

            /* Convert to Array of objects */
            let associateObjectList = []
            fetchedNameList.map(item => {
                associateObjectList.push({
                    associate_id: item[0],
                    associate_name: item[1]
                })
            })

            this.homeDataList.push(
                // Post Component
                <Post
                    key={item.Item.post_id} 
                    postSource= 'Profile'
                    postId={item.Item.post_id}
                    privacy={item.Item.privacy}
                    postCreator_id={item.Item.associate_id}
                    profileData={item.Item.associate_id == this.props.associate_id ? this.profileData : {}}
                    time={item.Item.time}
                    postMessage={item.Item.message}
                    taggedAssociates={associateObjectList}
                    strength={item.Item.sub_type}
                    type={item.Item.type}
                    associate={item.Item.associate_id}
                    likeCount={item.Item.likeCount}
                    commentCount={item.Item.commentCount}
                    postDeleteHandler={this.deletePost}
                    points={item.Item.points}
                    addOn={item.Item.addOnPoints}
                />
            )
            if(posts.length == this.homeDataList.length) {
                setTimeout(() => this.setState({ homeRefreshing: false, postList: this.homeDataList }), 1500)
            }
        })
    }

    loadSummary = () => {
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.state.associate_id
        }
        //Authemtication header
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }

        try {
            strength_counts(payload,headers).then((response) => {
                this.setState({ strengthCount: response.data.data.length})
                if(response.data.data.length == 0) {
                    this.summeryRawList = []
                    this.summeryRawList.push(<Text key={0} style={{ textAlign: 'center', width: '100%', alignItems: 'center', justifyContent: 'center' }}>No strengths to display.</Text>)
                    this.setState({ summaryRefreshing: false })
                    return
                }
                else {
                    this.summeryList = []
                    response.data.data.map(async (item, index) => {
                        const imageURI = strngthIcon.filter((endorse) => {
                            return item.sub_type == endorse.name
                        })
                        await this.summeryList.push(
                            <View key={index}>
                                <Card
                                    postNavigationHandeler={this.postNavigationHandeler}
                                    image={imageURI[0].source}
                                    count={item.count}
                                    strength={item.sub_type}
                                />
                            </View>
                        )
                        this.setState({summeryList: this.summeryList, summaryRefreshing: false})
                    })
                }
            }).catch((error) => {
                const isSessionExpired = checkIfSessionExpired(error.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                if (!isSessionExpired) {
                    this.loadSummary()
                    return
                }
                this.setState({ summaryRefreshing: false })
            })
        }
        catch (e) {
            this.setState({ summaryRefreshing: false })
        }
    }

    //Navigate to Posts for logged in User
    postNavigationHandeler = (strengthType) => {
        if (this.state.associate_id == this.props.associate_id) {
            this.props.navigation.navigate('StrengthPosts', {
                strengthType: strengthType
            })
        }
    }

    async handleEditProfile() {
        Keyboard.dismiss()
        if (this.state.isEdit) {
            this.setState({ isEdit: false })
            if (this.state.firstName == "") {
                Toast.show({
                    text: 'Please enter First Name',
                    type: 'danger',
                    duration: 2000
                })
            }
            else if (this.state.lastName == "") {
                Toast.show({
                    text: 'Please enter Last Name',
                    type: 'danger',
                    duration: 2000
                })
            }
            else if (this.state.email == "" || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email) == false) {
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
                    if (this.props.isConnected) {
                        const payload = {
                            "tenant_id": this.props.accountAlias,
                            "associate_id": this.props.associate_id,
                            "first_name": this.state.firstName,
                            "last_name": this.state.lastName,
                            "email": this.state.email,
                            "phone_number": "+91" + this.state.phoneNo

                        }
                        //Authemtication header
                        const headers = {
                            headers: {
                                Authorization: this.props.accessToken
                            }
                        }
                        await update_profile(payload,headers).then(() => {
                            if (this.state.photo !== null) {
                                ToastAndroid.showWithGravityAndOffset(
                                    'Updating...',
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    25,
                                    100,
                                );
                                this.setState({ imageUrl: this.state.photo }, () => this.handleUploadImage())
                            }
                        }).catch((e) => {
                            this.setState({ visibilityModalVisible: false })
                            const isSessionExpired = checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                            if (!isSessionExpired) {
                                this.handleEditProfile()
                                return
                            }
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

                catch (e) {/* error */ }
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
        if (this.state.isEdit) {
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
                            this.setState({ isEdit: false })
                        }
                    }
                ],
                { cancelable: false },
            )
        }
        else {
            this.setModalVisible(false)
        }
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
        if (this.props.associate_id == this.state.associate_id) {
            const payload = {
                "tenant_id": this.props.accountAlias,
                "associate_id": this.props.associate_id
            }

            //Authemtication header
            const headers = {
                headers: {
                    Authorization: this.props.accessToken
                }
            }

            try {
                if (payload.tenant_id !== "" && payload.associate_id !== "") {
                    await read_transaction(payload, headers).then(response => {
                        this.setState({
                            walletBalance: response.data.data.wallet_balance
                        })
                        if (this.transactionDataBackup.length === response.data.data.transaction_data.length) {
                            if (response.data.data.transaction_data.length == 0) {
                                this.transactionList = []
                                this.transactionList.push(
                                    <Text style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 20 }} key={0}>No recent transactios found.</Text>
                                )
                                this.setState({ transactionList: this.transactionList })
                            }
                            this.setState({ refreshing: false })
                            return
                        } else {
                            //Change in Payload
                            this.transactionDataBackup = response.data.data.transaction_data
                            this.transactionList = []
                            this.createTransactionTile(this.transactionDataBackup)
                        }
                    }).catch((error) => {
                        const isSessionExpired = checkIfSessionExpired(error.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                        if (!isSessionExpired) {
                            this.loadTransactions()
                            return
                        }
                        this.setState({ refreshing: false })
                    })
                }
            }
            catch (error) {
                this.setState({ refreshing: false })
            }
        }
    }

    createTransactionTile = (data) => {
        data.map((item, index) => {
            this.transactionList.push(
                <View style={{ backgroundColor: '#FFF', width: Dimensions.get('window').width }} key={index}>
                    <View style={styles.transactionContainer}>
                        <View style={styles.iconView}>
                            <View style={{ backgroundColor: '#47309C', borderRadius: 40, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name='ios-trophy' type={'Ionicons'} style={{ fontSize: 18, color: '#eee' }} />
                            </View>
                        </View>
                        <View style={styles.transactionView}>
                            <View style={styles.textView}>
                                {
                                    item.sevice_name == 'survey_reward' ?
                                        <Text style={styles.surveryText}>
                                            You have been rewarded for filling up Survey: {item.sevice_sub_type}</Text>
                                        :
                                        <Text style={styles.tText}>
                                            {
                                                (item.sevice_name == "add_on") ? 
                                                    item.t_type == 'cr' ?
                                                        'You have been gifted points for ' :
                                                        'You have gifted points for '
                                                    :
                                                    item.t_type == 'cr' ?
                                                        'Points credited for '
                                                        :
                                                        'Points debited for '
                                            }
                                            {
                                                item.sevice_sub_type == 'Kudos' ? 'Gratitude: ' : 'Endorsement: '
                                            }
                                            {item.sevice_sub_type}
                                        </Text>
                                }
                                <View style={{ flexDirection: 'row', flexWrap: 'nowrap', width: "100%", alignItems: 'center', justifyContent: "space-between" }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        {item.sevice_name !== 'survey_reward' ? <Text style={styles.fromTo}>{item.t_type == 'cr' ? 'From' : 'To'}: {item.t_type == 'cr' ? item.from_associate_details.associate_name : item.to_associate_details.associate_name}</Text> : null}
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingRight: 6 }}>
                                        <Moment style={item.sevice_name == 'survey_reward' ? styles.timeStampS : styles.timeStamp} element={Text} format='D MMM YYYY' withTitle>
                                            {item.created_at}
                                        </Moment>
                                    </View>

                                    {/* <Text style={[styles.timeStamp, {paddingRight: 20}]}>{item.created_at}</Text> */}
                                </View>
                            </View>
                            <View style={styles.pointsView}>
                                <Text style={item.t_type == 'cr' ? styles.credit : styles.debit}>{item.t_type == 'cr' ? "+ " + item.points : "- " + item.points}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 1 / 3, width: '100%', backgroundColor: '#c9cacc' }}></View>
                </View>
            )
        })
        this.setState({ refreshing: false, transactionList: this.transactionList })
    }
    //Visibilty input data
    data = [
        { icon: 'camera', type: 'Entypo', text: 'Open Camera', name: 'open', key: 'open' },
        { icon: 'photo-library', type: 'MaterialIcons', text: 'Import From Gallery', name: 'import', key: 'import' }
    ]

    /* Upload image to AWS S3 */
    handleUploadImage = () => {
        /* Get signed URL */
        const payload = {
            tenant_name: this.props.tenantName + this.props.accountAlias,
            file_name: 'logo.png',
            associate_email: this.props.email
        }

        //Authemtication header
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }
        file_upload(payload,headers)
            .then((response) => {
                const headers = {
                    'Content-Type': 'multipart/form-data'
                }
                var url = this.state.photo

                RNFetchBlob.fetch('PUT', response.data.data['upload-signed-url'], headers, RNFetchBlob.wrap(url))
                    .then(() => {
                        this.handleImageDownload()
                        ImageCropPicker.clean().then(() => {
                        }).catch(e => {
                            alert(e);
                        });
                    }).catch(() => {
                    })
            })
            .catch((error) => {
                const isSessionExpired = checkIfSessionExpired(error.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                if (!isSessionExpired) {
                    this.handleUploadImage()
                    return
                }
            })
    }

    /* Get image from S3 */
    handleImageDownload = () => {
        this.setState({ isImageLoading: true })
        /* Request image*/
        const payload = {
            tenant_name: this.props.tenantName + this.props.accountAlias,
            file_name: 'logo.png',
            associate_email: this.userData.email || this.props.email
        }

        //Authemtication header
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }
        file_download(payload,headers).then((response) => {
            /* Store the image */
            this.setState({ isImageLoading: false, imageUrl: response.data.data['download-signed-url'] })
            if (payload.associate_email === this.props.email)
                this.props.imageUrl(response.data.data['download-signed-url'])

        }).catch((e) => {
            const isSessionExpired = checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
            if (!isSessionExpired) {
                this.handleImageDownload()
                return
            }
            //Error retriving data
        })
    }

    /* Load image from camera */
    handleChoosePhotoFromCamera = () => {
        /* Request permissions and import image */
        ImageCropPicker.openCamera({
            width: 300,
            height: 300,
            cropping: true,
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            avoidEmptySpaceAroundImage: false
            // mediaType: 'photo'
        }).then(image => {

            let updatedResponse = image
            updatedResponse.fileName = 'logo.png'

            /* store the image */
            this.setState({ photo: updatedResponse.path, isEdit: true })
        }).catch((e) => {
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
            width: 300,
            height: 300,
            cropping: true,
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            avoidEmptySpaceAroundImage: false
            // freeStyleCropEnabled: true,
            // enableRotationGesture: true
        }).then(image => {

            let updatedResponse = image
            updatedResponse.fileName = 'logo.png'
            /* store the image */
            this.setState({ photo: updatedResponse.path, isEdit: true })

        }).catch((e) => {
            if (e.code == "E_PICKER_CANCELLED") {
                return
            }
            else {
                alert('Please provide the permission')
            }
        })
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'flex-start', marginTop: 25 }}>
                    <ActivityIndicator size='large' color='#47309C' />
                </View>
            )
        }
        return (

            <Container style={{ flex: 1 }}>
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
                                        style={{ borderRadius: 45, width: 90, height: 90 }}
                                        source={{ uri: this.state.imageUrl }}
                                        resizeMode='cover'
                                    />
                                    :
                                    <ActivityIndicator size='small' color='#47309C' />
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
                        <View style={{ alignItems: 'flex-start', width: '65%', paddingLeft: 5 }}>
                            {
                                this.state.associate_id === this.props.associate_id ?
                                    <Text style={[styles.textLeft, styles.userName]} allowFontScaling numberOfLines={2}>{this.props.firstName + " " + this.props.lastName}</Text>
                                    :
                                    <Text style={[styles.textLeft, styles.userName]} allowFontScaling numberOfLines={2}>{this.userData.first_name + " " + this.userData.last_name}</Text>

                            }
                            <Text style={[styles.coloredText, styles.textLeft]} allowFontScaling numberOfLines={2}>{this.userData.email}</Text>
                            <Text style={[styles.textLeft, styles.helperText]} allowFontScaling numberOfLines={1}>Mobile: <Text style={styles.mobilNo}>{this.userData.phonenumber}</Text></Text>
                            {this.projectList.toString().length===0?null:
                                <Text style={[styles.textLeft, styles.helperText]} allowFontScaling numberOfLines={2}>Projects: <Text style={styles.companyName}>{this.projectList.toString()}</Text></Text>
                            }
                        </View>
                    </View>

                    {
                        this.state.associate_id === this.props.associate_id ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: "100%", padding: 3 }}>
                                <TouchableOpacity onPress={() => this.pager.setPage(0)} style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                                    <Text style={styles.text}>Home</Text>
                                    <H3 style={this.state.selectedTab == 0 ? styles.textActive : styles.textInactive}>{this.posts.length}</H3>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: '#000', width: 1 / 3, height: '65%' }} />
                                <TouchableOpacity onPress={() => this.pager.setPage(1)} style={{ alignItems: 'center', justifyContent: 'space-around', width: '33%' }}>
                                    <Text style={styles.text}>Rewards</Text>
                                    <H3 style={this.state.selectedTab == 1 ? styles.textActive : styles.textInactive}>{this.state.walletBalance}</H3>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: '#000', width: 1 / 3, height: '65%' }} />
                                <TouchableOpacity onPress={() => this.pager.setPage(2)} style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                                    <Text style={styles.text}>Strengths</Text>
                                    <H3 style={this.state.selectedTab == 2 ? styles.textActive : styles.textInactive}>{this.state.strengthCount}</H3>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: "100%", padding: 3 }}>
                                <TouchableOpacity onPress={() => this.pager.setPage(0)} style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                                    <Text style={styles.text}>Home</Text>
                                    <H3 style={this.state.selectedTab == 0 ? styles.textActive : styles.textInactive}>{this.posts.length}</H3>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: '#000', width: 1 / 3, height: '65%' }} />
                                <TouchableOpacity onPress={() => this.pager.setPage(1)} style={{ alignItems: 'center', justifyContent: 'center', width: '33%' }}>
                                    <Text style={styles.text}>Strengths</Text>
                                    <H3 style={this.state.selectedTab == 1 ? styles.textActive : styles.textInactive}>{this.state.strengthCount}</H3>
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
                                        <Icon name='list-alt' type={'FontAwesome'} style={this.state.selectedTab === 1 ? [styles.iconActive, { fontSize: 24 }] : [styles.iconInactive, { fontSize: 23 }]} />
                                    </TouchableOpacity>
                                </View>
                        }

                        <IndicatorViewPager
                            initialPage={0}
                            ref={ref => this.pager = ref}
                            style={styles.viewPager}
                            onPageSelected={(page) => this.setState({ selectedTab: page.position })}
                        >
                            <View style={{ flex: 1, backgroundColor: '#efefef'}}>
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
                                    { this.state.postList } 
                                </ScrollView>
                            </View>
                            {
                                this.state.associate_id === this.props.associate_id ?
                                    <View style={{ flex: 1, backgroundColor: '#efefef' }}>
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
                                            {this.state.transactionList}
                                        </ScrollView>
                                    </View>
                                    :
                                    null
                            }

                            <View style={{ flex: 1, backgroundColor: '#efefef' }}>
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
                                    {this.summeryList.length > 0 ? this.state.summeryList : this.summeryRawList}
                                </ScrollView>
                            </View>
                        </IndicatorViewPager>
                    </View>
                </ScrollView>

                <Modal
                    animationType='slide'
                    transparent={false}
                    hardwareAccelerated={true}
                    visible={this.state.modalVisible}
                    onRequestClose={this.requestCloseModal}>
                    <KeyboardAvoidingView style={{ flex: 1 }}
                        keyboardVerticalOffset={-290}
                        behavior='padding'
                        enabled
                    >
                        <Root>
                            <View style={[styles.modalCaontainer]}>
                                <View style={styles.headerContainer}>
                                    <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon name='close' type={'AntDesign'}
                                            style={{ color: '#000', padding: 5, fontSize: 26 }}
                                            onPress={this.requestCloseModal}
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, width: "85%" }}>
                                        <Text style={styles.headerText}>Edit Profile</Text>
                                        <TouchableOpacity style={{ height: 35, borderRadius: 30, aspectRatio: 1 / 1 }} onPress={this.handleEditProfile}>
                                            <Icon name='check' type={'MaterialIcons'}
                                                style={this.state.isEdit ? { color: '#47309C', padding: 5, fontSize: 27 } : { color: '#ccc', padding: 5, fontSize: 27 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flex: 1, width: "100%" }}>
                                    <ScrollView
                                        contentContainerStyle={{ padding: 20, width: "100%" }}
                                        showsVerticalScrollIndicator={false}
                                        scrollEnabled={true}
                                    >
                                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                                            <View style={styles.imageWrapper}>

                                                {!this.state.isImageLoading ? (
                                                    <Image
                                                        source={{ uri: this.state.photo !== null ? this.state.photo : this.state.imageUrl }}
                                                        style={styles.profilePic}
                                                    />
                                                ) : (
                                                    <ActivityIndicator size='large' color='#47309C' />
                                                )
                                                }
                                            </View>
                                            <TouchableOpacity onPress={() => this.setState({ visibilityModalVisible: true })}>
                                                <Text style={styles.changePicText}>Change Profile Photo</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.textInputWraper}>
                                            <Text style={styles.fieldText}>First Name <Text style={{ color: '#47309C', fontSize: 14, fontWeight: 'bold' }}>*</Text></Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={this.state.firstName}
                                                placeholder='First Name'
                                                underlineColorAndroid='#47309C'
                                                placeholderTextColor='#ccc'
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        firstName: text,
                                                        isEdit: true
                                                    })
                                                }}
                                            />
                                        </View>
                                        <View style={styles.textInputWraper}>
                                            <Text style={styles.fieldText}>Last Name <Text style={{ color: '#47309C', fontSize: 14, fontWeight: 'bold' }}>*</Text></Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={this.state.lastName}
                                                placeholder='Last Name'
                                                underlineColorAndroid='#47309C'
                                                placeholderTextColor='#ccc'
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        lastName: text,
                                                        isEdit: true
                                                    })
                                                }}
                                            />
                                        </View>
                                        <View style={styles.textInputWraper}>
                                            <Text style={styles.fieldText}>Email <Text style={{ color: '#47309C', fontSize: 14, fontWeight: 'bold' }}>*</Text></Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={this.state.email}
                                                editable={false}
                                                placeholder='Email'
                                                underlineColorAndroid='#47309C'
                                                keyboardType='email-address'
                                                placeholderTextColor='#ccc'
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
                                                underlineColorAndroid='#47309C'
                                                placeholderTextColor='#ccc'
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
                                    data={this.data}
                                    onChangeListener={({ key }) => {
                                        if (key == 'open') {
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
                <NavigationEvents
                    onWillFocus={async () => {
                        if (this.props.isConnected) {
                            this.loadHome()
                            this.loadSummary()
                            this.loadTransactions()
                        }
                    }
                    }
                />
                <LoadingModal
                    enabled={this.state.isPostDeleted}
                />
            </Container>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.user.emailAddress,
        userName: state.user.firstName + " " + state.user.lastName,
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        isConnected: state.system.isConnected,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        accessToken: state.user.accessToken,
        tenantName: state.user.tenant_name,
        walletBalance: state.user.walletBalance
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (props) => dispatch({ type: dev.UPDATE_USER, payload: props }),
        imageUrl: (props) => dispatch({ type: user.UPDATE_IMAGE, payload: props }),
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        updateNewTokens: (props) => dispatch({ type: auth.REFRESH_TOKEN, payload: props })
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)