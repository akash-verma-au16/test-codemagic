import React from 'react';
import {
    StyleSheet,
    View,
    BackHandler,
    TouchableOpacity,
    Text,
    Keyboard,
    ScrollView,
    Alert,
    ToastAndroid,
    TextInput
} from 'react-native';

import NetInfo from "@react-native-community/netinfo"
/* Native Base */
import {
    Container,
    Icon,
    Toast,
    Thumbnail,
    Spinner
} from 'native-base';
/* Redux */
import { connect } from 'react-redux'
// React Navigation
import { NavigationEvents } from 'react-navigation';
/* Services */
import { loadProfile } from '../Home/apicalls' 
import { create_post, get_visibility } from '../../services/post'
import toSentenceCase from '../../utilities/toSentenceCase'
import uuid from 'uuid'
import MultiSelect from 'react-native-multiple-select'
import { list_associate } from '../../services/tenant'
/* Components */
import VisibilityModal from '../VisibilityModal'
import LoadingModal from '../LoadingModal'
import thumbnail from '../../assets/thumbnail.jpg'
import Endorsement from '../../components/Endorsement'
import Gratitude from '../../components/Gratitude'

class CreatePost extends React.Component {
    constructor(props) {
        super(props)

        this.initialState = {
            visibilityModal: false,
            visibilitySelection: 'Organization',
            visibilityKey:'tenant',
            visibilityName: props.accountAlias,
            text: '',
            isLoading: false,
            isVisibilityLoading: false,
            isTagerLoading: false,
            EndorseModalVisibility: false,
            GratitudeModalVisibility: false,
            isShowingKeyboard: false,
            taggedAssociates: [],
            postType: '',
            endorsementStrength: '',
            addPoints: 0
        }
        this.state = this.initialState
        this.inputTextRef = React.createRef();
        this.profileData = {}
        this.visibilityData = []
        this.associateData = []
    }
    // Navigation options
    static navigationOptions = ({ navigation }) => {
        return {

            headerRight: (
                <Icon name='md-checkmark' style={
                    {
                        color: 'white',
                        margin: 20
                    }
                } onPress={navigation.getParam('postSubmitHandler')} />
            ),
            headerLeft: (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    disabled={true}
                >
                    <Thumbnail
                        source={{uri:navigation.getParam('imageUrl')}}

                        style={
                            {
                                height: '70%',
                                borderRadius: 50,
                                margin: 10
                            }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )
        };
    };
    // componentWillMount() {
    //     this.loadVisibility()
    // }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        this.props.navigation.setParams({ postSubmitHandler: this.postSubmitHandler });
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack()
            return true
        })
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    loadVisibility = () => {
        console.log('Calling loadVisibility')
        const payload = {
            email: this.props.emailAddress,
            tenant_id: this.props.accountAlias
        }
        const headers = {
            headers: {
                Authorization: this.props.idToken
            }
        }
        this.setState({ isVisibilityLoading: true })
        if(this.props.accountAlias !== undefined) {
            try {
                get_visibility(payload, headers).then((response) => {
                    console.log("Calling get_visibility API")
                    this.visibilityData = []
                    let iconName = ''
                    let text = ''
                    response.data.data.map(item => {
                        if (item.name === 'Organization') {
                            iconName = 'md-globe'
                            text = 'tenant'
                        } else if (item.name === 'Private') {
                            iconName = 'md-person'
                            text = 'private'
                        } else {
                            iconName = 'md-filing'
                            text = 'project'
                        }

                        this.visibilityData.push({ icon: iconName, text: item.name, name: item.id, key: text })
                    })
                    this.setState({ isVisibilityLoading: false })
                }).catch(() => {
                    this.setState({ isVisibilityLoading: false })
                })
            } catch (error) {
                this.setState({ isVisibilityLoading: false })
            }
        } else {
            console.log('get_visibility didnt call')
        }
        
    }
    _keyboardDidShow = () => {
        this.setState({ isShowingKeyboard: true })
    }

    _keyboardDidHide = () => {
        this.setState({ isShowingKeyboard: false })
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.backHandler.remove()
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange)
    }

    goBack = () => {
        if (JSON.stringify(this.state) === JSON.stringify(this.initialState))
            this.props.navigation.navigate('home')
        else
            Alert.alert(
                'Are you sure?',
                'Note will not be saved',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'OK', onPress: () => {
                            this.setState(this.initialState)
                            this.props.navigation.navigate('home')
                        }
                    }
                ],
                { cancelable: false },
            )
    }

    // Submitting post handler function
    postSubmitHandler = () => {

        /* Check if collegue is selected */
        if (this.state.taggedAssociates.length === 0) {
            // Toast.show({
            //     text: 'Atleast tag a collegue',
            //     type: 'danger',
            //     duration: 3000
            // })
            // return

            ToastAndroid.showWithGravityAndOffset(
                'Atleast tag a collegue',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
            return
        }

        /* check if post type is selected */
        if (this.state.postType === '') {
            // Toast.show({
            //     text: 'Please select a post type',
            //     type: 'danger',
            //     duration: 3000
            // })
            // return
            ToastAndroid.showWithGravityAndOffset(
                'Please select a post type',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
            return
        }

        /* if endorsement is selected */
        if (this.state.postType === 'endorse') {

            /* check if strength is selected */
            if (this.state.endorsementStrength === '') {
                // Toast.show({
                //     text: 'Select a strength',
                //     type: 'danger',
                //     duration: 3000
                // })
                // return

                ToastAndroid.showWithGravityAndOffset(
                    'Select a strength',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    100,
                );
                return
            }
        } 
        if (this.state.addPoints > this.profileData.wallet_balance) {
            ToastAndroid.showWithGravityAndOffset(
                'You have insufficient wallet balance ' + this.profileData.wallet_balance +' points.',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
            return
        }
        else {
            /* if gratitude is selected */

            /* check if text is present */
            if (this.state.text.trim() === '') {
                // Toast.show({
                //     text: 'Please write someting',
                //     type: 'danger',
                //     duration: 3000
                // })
                // return
                ToastAndroid.showWithGravityAndOffset(
                    'Please write someting',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    100,
                );
                return
            }
        }

        /* formating name */
        const fullName = toSentenceCase(this.props.firstName) + ' ' + toSentenceCase(this.props.lastName)
        /* unique id generation */
        const id = uuid.v4()
        /* epoch time calculation */
        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000);
        /* creating name-id map for associates */
        let associateList = []
        /* selected collection of id */
        this.state.taggedAssociates.map(id => {
            /* complete collection of names and ids */
            this.associateData.map(item => {
                if (id === item.id) {
                    associateList.push({ associate_id: item.id, associate_name: item.name })
                    return
                }
            })

        })
        const payload = {
            Data: {
                post_id: id,
                tenant_id: this.props.accountAlias,
                associate_id: this.props.associate_id,
                associate_name: fullName,
                message: this.state.text,
                type: this.state.postType,
                sub_type: this.state.endorsementStrength,
                ops: "post",
                tagged_associates: associateList,
                privacy: {
                    type: this.state.visibilityKey,
                    id: this.state.visibilityName == "" ? this.props.accountAlias : this.state.visibilityName //this.state.visibilityName
                },
                time: timestamp,
                points: this.state.addPoints > 0 ? this.state.addPoints : 0
            }
        }
        const headers = {
            headers: {
                Authorization: this.props.idToken
            }
        }
        // console.log(payload)
        this.setState({ isLoading: true })
        try {
            create_post(payload, headers).then(() => {
                // Toast.show({
                //     text: 'Post created. This may take 1 minute to update',
                //     type: 'success',
                //     duration: 3000
                // })
                this.setState({
                    isLoading: false,
                    text: ''
                })
                this.setState(this.initialState)
                this.props.navigation.navigate('home')

            }).catch(() => {
                Keyboard.dismiss()
                Toast.show({
                    text: 'Error while creating the post',
                    type: 'danger',
                    duration: 3000
                })
                this.setState({ isLoading: false })
                if (!this.props.isConnected) {
                    Toast.show({
                        text: 'Please, connect to the internet',
                        type: 'danger',
                        duration: 2000
                    })
                }
            })
        } catch (error) {
            this.setState({ isLoading: false })
            Toast.show({
                text: error.text,
                type: 'danger',
                duration: 3000
            })
            this.setState({ isLoading: false })
        }

    }

    closeEndorseModal = () => {
        this.setState({ EndorseModalVisibility: false, postType: '', endorsementStrength: '', text: '' })
    }

    closeGratitudeModal = () => {
        this.setState({ GratitudeModalVisibility: false, postType: '', endorsementStrength: '', text: '' })
    }

    toggleButton = () => {
        const fontSize = 18
        const iconSize = 50
        return (
            <View style={{
                alignItems: 'center',
                width: '90%',
                borderRadius: 10,
                backgroundColor: '#fff',
                shadowOffset: { width: 5, height: 5 },
                shadowColor: 'black',
                shadowOpacity: 0.2,
                elevation: 2,
                marginTop: 10,
                flexDirection: 'row',
                height: 200
            }}>
                <TouchableOpacity style={styles.button} onPress={() => {
                    this.setState({ EndorseModalVisibility: true, postType: 'endorse' })
                }}>
                    <Icon name='md-people' style={{ fontSize: iconSize, paddingHorizontal: 5, color: '#1c92c4' }} />
                    <Text style={[styles.buttonText, { fontSize: fontSize, color: '#1c92c4' }]}>Endorse</Text>
                </TouchableOpacity>
                <View style={{
                    height: 150,
                    backgroundColor: '#ccc',
                    width: 1
                }} />
                <TouchableOpacity style={styles.button} onPress={() => {
                    this.setState({ GratitudeModalVisibility: true, postType: 'gratitude' })
                }}>
                    <Icon name='md-thumbs-up' style={{ fontSize: iconSize, paddingHorizontal: 5, color: '#1c92c4' }} />
                    <Text style={[styles.buttonText, { fontSize: fontSize, color: '#1c92c4' }]}>Thanks</Text>
                </TouchableOpacity>

            </View>
        )
    }

    associateTager = () => (
        <View style={{
            alignItems: 'center',
            width: '90%',
            borderRadius: 10,
            backgroundColor: '#fff',
            shadowOffset: { width: 5, height: 5 },
            shadowColor: 'black',
            shadowOpacity: 0.2,
            elevation: 2
        }}>
            <View style={{ backgroundColor: '#1c92c4', flexDirection: 'row', borderTopRightRadius: 10, borderTopLeftRadius: 10, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='md-person-add' style={{ fontSize: 18, paddingRight: 5, color: 'white' }} />
                    <Text style={{ fontSize: 18, color: '#fff', marginVertical: 10 }}>Tag your colleagues</Text>
                </View>

                {this.state.taggedAssociates.length > 0 ?
                    <Icon name='md-close' style={{ padding: 10, fontSize: 18, color: '#fff' }} onPress={() => {
                        this.setState({ taggedAssociates: [] })
                        // this.props.associateTagHandler([])
                    }} />
                    : null}

            </View>
            {this.state.isTagerLoading ?
                <Spinner color='#1c92c4' />
                :
                <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 10, marginBottom: 10 }}>

                    <MultiSelect
                        hideTags
                        items={this.associateData}
                        uniqueKey='id'
                        ref={(component) => { this.multiSelect = component }}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectedItems={this.state.taggedAssociates}
                        selectText='Select colleagues'
                        searchInputPlaceholderText='Search colleagues...'
                        tagRemoveIconColor='#1c92c4'
                        tagBorderColor='#1c92c4'
                        tagTextColor='#1c92c4'
                        selectedItemTextColor='#1c92c4'
                        selectedItemIconColor='#1c92c4'
                        itemTextColor='#000'
                        displayKey='name'
                        searchInputStyle={{ color: '#1c92c4' }}
                        submitButtonColor='#1c92c4'
                        submitButtonText='Submit'
                    />
                    {this.state.isShowingKeyboard ?
                        null
                        :
                        <View>
                            {this.multiSelect && this.multiSelect.getSelectedItemsExt(this.state.taggedAssociates)}
                        </View>
                    }

                </View>
            }
        </View>
    )
    onSelectedItemsChange = taggedAssociates => {
        this.setState({ taggedAssociates });

    }

    // visibilityChangeListener = (text, name, key) => {
    //     if(text == '')
    // }

    loadMembers = () => {
        console.log('Calling loadMembers')
        const headers = {
            headers: {
                Authorization: this.props.idToken
            }
        }
        if (this.props.accountAlias !== undefined) {
            list_associate({
                tenant_id: this.props.accountAlias
            }, headers)
                .then(response => {
                    /* Clear Garbage */
                    console.log('calling list_associate API')
                    this.associateData = []
                    response.data.data.map(item => {
                        /* Create List items */
                        const fullName = item.first_name + ' ' + item.last_name

                        /* preventing self endorsing */
                        if (item.associate_id !== this.props.associate_id) {
                            this.associateData.push({ id: item.associate_id, name: fullName })
                            console.log("Associate data",this.associateData)
                        }
                    })
                    this.setState({ isTagerLoading: false })
                })
                .catch((e) => {
                    console.log(e)
                    this.setState({ isTagerLoading: false })
                })
        } else {
            console.log('loadmembers didnt call')
        }

    }
    handleConnectivityChange = (isConnected) => {
        if (isConnected) {
            this.setState({
                isTagerLoading: true
            }, () => {
                this.loadMembers()
                this.loadVisibility()
            })
        }
    }
    associateTagHandler = (taggedAssociates) => {
        this.setState({ taggedAssociates })
    }

    endorsementHandler = (endorsementStrength, text) => {
        this.setState({ endorsementStrength, text })
    }

    gratitudeHandler = (text) => {
        this.setState({ endorsementStrength: 'Kudos', text: text })
    }
    render() {

        return (

            <Container style={{ flex: 1, backgroundColor: '#eee' }}>

                <ScrollView contentContainerStyle={{

                    borderRadius: 5,
                    alignItems: 'center'
                }}>

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#1c92c4',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            marginHorizontal: 10,
                            marginVertical: 10,
                            borderRadius: 5
                        }}
                        onPress={() => this.setState({ visibilityModal: true })}
                        disabled={this.state.isVisibilityLoading}
                    >

                        {this.state.isVisibilityLoading ?
                            <Spinner color='white' size={12} style={{ height: 10, paddingHorizontal: 5 }} />
                            :
                            <Icon name='md-eye' style={{ fontSize: 12, paddingHorizontal: 5, color: 'white' }} />
                        }
                        <Text style={styles.buttonText}>{this.state.visibilitySelection}</Text>

                    </TouchableOpacity>

                    <this.associateTager />

                    {!this.state.EndorseModalVisibility && !this.state.GratitudeModalVisibility ?
                        <this.toggleButton />
                        : null}

                    {this.state.EndorseModalVisibility ?
                        <Endorsement
                            closeEndorseModal={this.closeEndorseModal}
                            endorsementHandler={this.endorsementHandler}
                        />
                        : null}
                    {this.state.GratitudeModalVisibility ?
                        <Gratitude
                            closeGratitudeModal={this.closeGratitudeModal}
                            gratitudeHandler={this.gratitudeHandler}
                        />
                        : null}
                    <View style={styles.addPointsContainer}>
                        <View style={{alignItems: 'center', justifyContent: 'center', paddingHorizontal: 7, width:'100%'}}>
                            <TextInput
                                placeholder='Add points'
                                placeholderTextColor='#777'
                                style={styles.addPoints} 
                                value={this.state.addPoints == 0 ? "" : this.state.addPoints.toString()}
                                selectionColor='#1c92c4'
                                onChangeText={(text) => this.setState({ addPoints: text })}
                                keyboardType='number-pad'
                                underlineColorAndroid='#1c92c4'
                            />
                        </View>
                        <View style={styles.pointButtonView}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.pointsView} onPress={() => this.setState({ addPoints: 10 })}>
                                <Text style={styles.points}>+10</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={styles.pointsView} onPress={() => this.setState({ addPoints: 15 })}>
                                <Text style={styles.points}>+15</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={styles.pointsView} onPress={() => this.setState({ addPoints: 25 })}>
                                <Text style={styles.points}>+25</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity style={styles.buttonView}>
                            <Text style={styles.add}>ADD</Text>
                        </TouchableOpacity> */}

                    </View>
                </ScrollView>

                <VisibilityModal 
                    header = 'Visibility'
                    enabled={this.state.visibilityModal}
                    data={this.visibilityData}
                    onChangeListener={({text, name,key}) => {
                        this.setState({ visibilitySelection: text, visibilityName: name , visibilityKey:key })
                    }}
                    visibilityDisableHandler={() => {
                        this.setState({ visibilityModal: false })
                    }}
                    state={this.state.visibilitySelection}
                />

                <LoadingModal
                    enabled={this.state.isLoading}
                />

                <NavigationEvents
                    onWillFocus={async() => {
                        if (this.props.isConnected) {
                            if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                this.props.navigation.setParams({ 'imageUrl': this.props.imageUrl})
                                this.loadVisibility()
                                this.loadMembers()
                                this.profileData = await loadProfile({
                                    "tenant_id": this.props.accountAlias,
                                    "associate_id": this.props.associate_id
                                }, {
                                    headers: {
                                        Authorization: this.props.idToken
                                    }
                                }, this.props.isConnected);
                            }
                        }
                    }}
                />

            </Container>

        );
    }
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        margin: 5,
        borderRadius: 5
    },

    buttonText: {
        color: 'white',
        textAlign: 'center'

    },
    addPointsContainer: { 
        width: '90%', 
        borderRadius: 10, 
        backgroundColor: '#fff', 
        marginVertical: 10, 
        paddingVertical: 20,
        paddingHorizontal: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 2
    },
    addPoints: {
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 18
    },
    pointButtonView: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%', 
        marginTop: 15
    },
    pointsView: {
        width: '30%',
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#1c92c4',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 7
    },
    points:{
        color: '#1c92c4',
        fontSize: 16
    },
    buttonView: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        paddingVertical: 10,
        backgroundColor: '#1c92c4',
        marginTop: 15
    },
    add: {
        color: '#fff',
        fontSize: 18
    }
});

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        emailAddress: state.user.emailAddress,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected,
        idToken: state.user.idToken,
        imageUrl:state.user.imageUrl
    };
}

export default connect(mapStateToProps, null)(CreatePost)