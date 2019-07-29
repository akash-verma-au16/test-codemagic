import React from 'react'
import { View, Text, ScrollView, StyleSheet, Alert, Dimensions, TextInput, Keyboard, BackHandler, ToastAndroid } from 'react-native'
//Native base
import { Icon } from 'native-base'
// Components from Moment.js
import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'
//API methods
import { edit_post, edit_post_addon, new_associate_notify } from '../../services/post'
import { list_associate } from '../../services/tenant'
import { dev, auth } from '../../store/actions'
//RBAC handler function
import { checkIfSessionExpired } from '../RBAC/RBAC_Handler'
/* Redux */
import { connect } from 'react-redux'
//Tagged associate componet
import MultiSelect from 'react-native-multiple-select'

class EditPost extends React.Component {
    constructor(props) {
        super(props)
        this.initialState = {
            postCreator: '',
            postMessage: '',
            taggedAssociates: [],
            strength: '',
            epoch: "",
            isChanged: false,
            isTagerLoading: false,
            editAddon: 0
        }
        this.state = this.initialState
        this.associateData = []
        this.associateList = []
        this.newAssociate = []
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
    async componentWillMount() {
        await this.setState({
            ...this.state,
            postCreator: this.props.navigation.getParam('associate'),
            postMessage: this.props.navigation.getParam('postMessage'),
            taggedAssociates: this.props.navigation.getParam('taggedAssociates'),
            strength: this.props.navigation.getParam('strength'),
            epoch: this.props.navigation.getParam('time')
        })
        this.loadMembers()
    }

    static navigationOptions = ({ navigation }) => {
        return {

            headerRight: (
                navigation.getParam('isChanged') ?
                    <Icon name='md-checkmark' type='Ionicons' style={
                        {
                            color: 'white',
                            margin: 19
                        }
                    } onPress={navigation.getParam('editPostHandler')}
                    />
                    : <View style={{ magin: 19 }}></View>
            ),
            headerLeft: (
                <Icon name='ios-arrow-back' type='Ionicons' style={
                    {
                        color: 'white',
                        padding: 19
                    }
                }
                onPress={() => {
                    if (navigation.getParam('isChanged')) {
                        Alert.alert(
                            'Discard Changes?',
                            'Are you sure you want to discard the changes?',
                            [
                                {
                                    text: 'No',
                                    style: 'cancel'
                                },
                                {
                                    text: 'Yes', onPress: () => {
                                        Keyboard.dismiss()
                                        ToastAndroid.showWithGravityAndOffset(
                                            'Changes unsaved',
                                            ToastAndroid.SHORT,
                                            ToastAndroid.BOTTOM,
                                            25,
                                            100,
                                        );
                                        navigation.goBack()
                                    }
                                }
                            ],
                            { cancelable: false },
                        )
                    }
                    else {
                        navigation.goBack()
                    }
                }}
                />
            )
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ isChanged: this.state.isChanged, editPostHandler: this.editPostHandler });
        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Keyboard.dismiss()
            this.goBack()
            return true;
        });
    }

    //Authorization headers
    headers = {
        headers: {
            Authorization: this.props.idToken 
        }
    }

    editPostHandler = async () => {
        if (this.props.isConnected) {
            //new associate data
            this.newAssociateList = []
            this.newAssociate = this.state.taggedAssociates
            this.inputAssociate = this.props.navigation.getParam('taggedAssociates')
            this.newAssociate = await this.newAssociate.filter((item) => {
                if (!this.inputAssociate.includes(item)) {
                    return item
                }
            })
            let base = this.props.navigation.getParam('points') / this.inputAssociate.length
            let points = base * this.newAssociate.length
            //return associate data
            this.associateList = []
            this.state.taggedAssociates.map(id => {
                /* complete collection of names and ids */
                this.associateData.map(item => {
                    if (id === item.id) {
                        this.associateList.push({ associate_id: item.id, associate_name: item.name })
                    }
                })

            })

            if (this.state.taggedAssociates.length == 0) {
                ToastAndroid.showWithGravityAndOffset(
                    'At lease tag one associate',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    100,
                );
                return
            }

            if (this.state.postMessage.length == 0 || !this.state.postMessage.replace(/\s/g, '').length) {
                ToastAndroid.showWithGravityAndOffset(
                    "We don't mind if you write something..",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    100,
                );
                return
            }

            if (points <= this.props.walletBalance) {
                const payload = {
                    Data: {
                        post_id: this.props.navigation.getParam('postId'),
                        tenant_id: this.props.accountAlias,
                        associate_id: this.props.associate_id,
                        message: this.state.postMessage,
                        type: this.props.navigation.getParam('type'),
                        sub_type: this.props.navigation.getParam('strength'),
                        ops: "edit_post",
                        tagged_associates: this.associateList,
                        privacy: this.props.navigation.getParam('privacy'),
                        time: this.state.epoch,
                        points: this.props.navigation.getParam('points') + points
                    }
                }

                try {
                    edit_post(payload, this.headers).then(async () => {
                        if (this.newAssociate.length > 0) {
                            this.newAssociate.map((item) => {
                                this.newAssociateList.push({ associate_id: item })
                            })
                            if (this.props.navigation.getParam('points') > 0) {
                                if (this.props.walletBalance >= points) {
                                    this.newAssociateAddon(this.newAssociateList, points)
                                    this.newUserNotify(this.newAssociateList)
                                }
                                else {
                                    ToastAndroid.showWithGravityAndOffset(
                                        'You have insufficient points ' + this.props.walletBalance,
                                        ToastAndroid.SHORT,
                                        ToastAndroid.BOTTOM,
                                        25,
                                        100,
                                    )
                                    return
                                }
                            }
                            else {
                                this.newUserNotify(this.newAssociateList)
                            }
                        }

                        this.props.navigation.state.params.returnData({
                            message: this.state.postMessage,
                            taggedAssociates: this.associateList,
                            editAddon: this.state.editAddon
                        })
                        this.props.navigation.goBack()

                    }).catch((e) => {
                        checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate)
                        //Error Retriving Data
                    })
                }
                catch (e) {
                    //Error Retriving Data
                }
            }
            else {
                ToastAndroid.showWithGravityAndOffset(
                    'You have insufficient wallet balance',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    100,
                );
            }

        }
        else {
            ToastAndroid.showWithGravityAndOffset(
                'Please, connect to the internet.',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
        }

    }
    closeSelectionDrawer = () => {
        /* check if drawer is open */
        if (this.multiSelect.state.selector) {
            /* close the expanded list, clear search term */
            this.multiSelect._submitSelection()
        }
    }
    newAssociateAddon = (newAssociateList, points) => {
        const payload = {
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id,
            tagged_associates: newAssociateList,
            sub_type: this.props.navigation.getParam('strength'),
            type: this.props.navigation.getParam('type'),
            post_id: this.props.navigation.getParam('postId'),
            points: points
        }

        this.setState({ editAddon: this.state.editAddon + points })
        try {
            edit_post_addon(payload, this.headers).then(async () => {
                let walletBalance = this.props.walletBalance - points
                const payload = {
                    walletBalance: walletBalance
                }
                //Update Wallet
                await this.props.updateWallet(payload)
                let pString = points > 1 ? ' points' : ' point'
                ToastAndroid.showWithGravityAndOffset(
                    'You have given ' + points + pString,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    100,
                );
            }).catch((e) => {
                checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate)
                // error retriving data
            })
        }
        catch {
            // error retriving data
        }
    }

    newUserNotify = (newAssociateList) => {
        const payload = {
            post_id: this.props.navigation.getParam('postId'),
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id,
            message: this.state.postMessage,
            type: this.props.navigation.getParam('type'),
            sub_type: this.props.navigation.getParam('strength'),
            tagged_associates: newAssociateList,
            privacy: this.props.navigation.getParam('privacy'),
            time: this.state.epoch
        }

        try {
            new_associate_notify(payload, this.headers).then(() => {
            }).catch((e) => {
                //Check for session expiry
                checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate)
                //Error retriving data
            })
        }
        catch {
            //Error retriving data
        }
    }

    onSelectedItemsChange = async (taggedAssociates) => {
        await this.setState({
            taggedAssociates: taggedAssociates,
            isChanged: true
        });
        this.props.navigation.setParams({ isChanged: true });
    }

    async goBack() {
        if (this.state.isChanged) {
            Alert.alert(
                'Discard Changes?',
                'Are you sure you want to discard the changes?',
                [
                    {
                        text: 'No',
                        style: 'cancel'
                    },
                    {
                        text: 'Yes', onPress: () => {
                            Keyboard.dismiss()
                            ToastAndroid.showWithGravityAndOffset(
                                'Changes unsaved',
                                ToastAndroid.SHORT,
                                ToastAndroid.BOTTOM,
                                25,
                                100,
                            );
                            this.setState(this.initialState)
                            this.props.navigation.goBack()
                        }
                    }
                ],
                { cancelable: false },
            )
        }
        else {
            await this.props.navigation.goBack()
        }
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    loadMembers = () => {
        if (this.props.accountAlias !== undefined) {
            list_associate({
                tenant_id: this.props.accountAlias
            }, this.headers)
                .then(response => {
                    /* Clear Garbage */
                    this.associateData = []
                    response.data.data.map(item => {
                        /* Create List items */
                        const fullName = item.first_name + ' ' + item.last_name

                        /* preventing self endorsing */
                        if (item.associate_id !== this.props.associate_id) {
                            this.associateData.push({ id: item.associate_id, name: fullName })
                        }
                    })
                    this.setState({ isTagerLoading: false })
                })
                .catch((e) => {
                    this.setState({ isTagerLoading: false })
                    checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate)
                })
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps='handled'
                >
                    <View style={styles.headerContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                            <View name='image' style={{
                                borderRadius: 30,
                                backgroundColor: '#9871d5',
                                height: 35,
                                aspectRatio: 1 / 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon name='person' style={{ fontSize: 25, color: 'white' }} />
                            </View>
                            <Text style={{ marginHorizontal: 10, color: '#333', fontWeight: '500', fontSize: 16 }}>{this.state.postCreator}</Text>
                        </View>
                        <Moment style={{ fontSize: 12 }} element={Text} fromNow>{this.state.epoch * 1000}</Moment>

                    </View>

                    <View style={styles.horizontalLine}></View>

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

                        <View style={{ backgroundColor: '#9871d5', flexDirection: 'row', borderTopRightRadius: 10, borderTopLeftRadius: 10, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, width: '100%' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name='md-person-add' style={{ fontSize: 18, paddingRight: 5, color: 'white' }} />
                                <Text style={{ fontSize: 18, color: '#fff', marginVertical: 10 }}>Edit your colleagues</Text>
                            </View>

                            {this.state.taggedAssociates.length > 0 ?
                                <Icon name='md-close' style={{ padding: 10, fontSize: 18, color: '#fff' }} onPress={() => {
                                    this.setState({ taggedAssociates: [] })
                                    // this.props.associateTagHandler([])
                                }} />
                                : null}

                        </View>
                        <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 10, marginBottom: 10 }}>

                            <MultiSelect
                                hideSubmitButton
                                items={this.associateData}
                                uniqueKey='id'
                                ref={(component) => { this.multiSelect = component }}
                                onSelectedItemsChange={this.onSelectedItemsChange}
                                selectedItems={this.state.taggedAssociates}
                                selectText='Select colleagues'
                                searchInputPlaceholderText='Search colleagues...'
                                tagRemoveIconColor='#9871d5'
                                tagBorderColor='#9871d5'
                                tagTextColor='#9871d5'
                                selectedItemTextColor='#9871d5'
                                selectedItemIconColor='#9871d5'
                                itemTextColor='#000'
                                displayKey='name'
                                searchInputStyle={{ color: '#9871d5' }}
                                submitButtonColor='#9871d5'
                                submitButtonText='Submit'
                                autoFocusInput={false}
                            />
                        </View>
                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: "100%",
                        padding: 10,
                        paddingHorizontal: 15
                    }}>
                        <TextInput
                            placeholder='Edit your message here...'
                            placeholderTextColor='#444'
                            value={this.state.postMessage}
                            autoFocus={true}
                            style={styles.editPost}
                            multiline={true}
                            selectionColor='#9871d5'
                            onChangeText={(text) => {
                                this.setState({ postMessage: text, isChanged: true })
                                this.props.navigation.setParams({ isChanged: true })
                                this.closeSelectionDrawer()
                            }}
                            onFocus={() => {
                                this.closeSelectionDrawer()
                            }}
                        />
                        <Text style={styles.strength} onPress={() => {
                            this.closeSelectionDrawer()
                        }}> #{this.state.strength}</Text>
                    </View>
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5
    },
    scroll: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "100%",
        paddingHorizontal: 15
    },
    horizontalLine: {
        width: '100%',
        flexDirection: 'row',
        height: 1 / 3,
        backgroundColor: '#c9cacc',
        marginVertical: 5
    },
    editPost: {
        // padding: 10,
        // paddingHorizontal: 15,
        width: "100%",
        textAlign: 'left',
        fontSize: 17
        // backgroundColor: '#efefef'
    },
    strength: {
        color: '#111',
        fontWeight: 'bold',
        fontSize: 17
    }
})

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
        walletBalance: state.user.walletBalance
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateWallet: (props) => dispatch({ type: dev.UPDATE_WALLET, payload: props }),
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPost)