import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
    BackHandler,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    Keyboard,
    ScrollView
} from 'react-native';

/* Native Base */
import {
    Container,
    Icon,
    Toast,
    Thumbnail
} from 'native-base';
/* Redux */
import { connect } from 'react-redux'
/* Services */
import { create_post } from '../../services/post'
import toSentenceCase from '../../utilities/toSentenceCase'
import uuid from 'uuid'

/* Components */
import VisibilityModal from '../VisibilityModal'
import LoadingModal from '../LoadingModal'
import thumbnail from '../../assets/thumbnail.jpg'
import AssociateTager from '../../components/AssociateTager'
import Endorsement from '../../components/Endorsement'
import Gratitude from '../../components/Gratitude'
class CreatePost extends React.Component {

    constructor(props) {
        super(props)

        this.initialState = {
            visibilityModal: false,
            visibilitySelection: 'Organization',
            visibilityName: 'tenant',
            text: '',
            isLoading: false,
            EndorseModalVisibility: false,
            GratitudeModalVisibility: false,
            isShowingKeyboard: false,
            taggedAssociates: [],
            postType: '',
            endorsementStrength: ''
        }
        this.state = this.initialState
        this.inputTextRef = React.createRef();
        this.visibilityData = [
            { icon: 'md-globe', text: 'Organization', name: 'tenant' },
            { icon: 'md-people', text: 'Project', name: 'project' },
            { icon: 'md-person', text: 'Private', name: 'private' }
        ]
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
                        source={thumbnail}

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


    componentDidMount() {
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
    }

    goBack = () => {
        this.props.navigation.navigate('home')
    }

    // Submitting post handler function
    postSubmitHandler = () => {

        /* Check if collegue is selected */
        if (this.state.taggedAssociates.length === 0) {
            Toast.show({
                text: 'Atleast tag a collegue',
                type: 'danger',
                duration: 3000
            })
            return
        }

        /* check if post type is selected */
        if (this.state.postType === '') {
            Toast.show({
                text: 'Please select a post type',
                type: 'danger',
                duration: 3000
            })
            return
        }

        /* if endorsement is selected */
        if (this.state.postType === 'endorse') {

            /* check if strength is selected */
            if (this.state.endorsementStrength === '') {
                Toast.show({
                    text: 'Select a strength',
                    type: 'danger',
                    duration: 3000
                })
                return
            }
        } else {
            /* if gratitude is selected */

            /* check if text is present */
            if (this.state.text.trim() === '') {
                Toast.show({
                    text: 'Please write someting',
                    type: 'danger',
                    duration: 3000
                })
                return
            }
        }

        /* 
            {
        "Data":{
            "post_id":"5a8c3c2e-4b2a-47f4-83ec-67cd80fd6f32",
            "tenant_id": "1l3jtp3hn",
            "associate_id": "fa9a8f60-4840-4c0a-b785-beebef4b1a24",
            "message": "hello",
            "type": "endorsement",
            "sub_type": "typ1",
            "tagged_associates": ["f5603da3-cb7b-4cd0-ba42-ceb728889779", "9c2f6191-9594-4c90-acf4-d708ee461fd1"],
            "privacy": {
            "type": "tenant",
            "id":"1l3jtp3hn"
            },
            "time": 1554888889
            }
        }
        */
        alert('validation successful')
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
            this.associateData.map(item=>{
                if(id===item.id){
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
                tagged_associates: associateList,
                privacy: {
                    type: this.state.visibilityName,
                    id: "project_id"
                },
                time: timestamp

            }

        }
        console.log(payload)
        /* this.setState({ isLoading: true })
        try {
            create_post(payload).then(response => {
                Toast.show({
                    text: response.data.message,
                    type: 'success',
                    duration: 3000
                })
                this.setState({
                    isLoading: false,
                    text: ''
                })
                this.props.navigation.navigate('Home')

            }).catch((error) => {
                Keyboard.dismiss()
                this.setState({ isLoading: false })
                if(this.props.isConnected) {
                    Toast.show({
                        text: error.response.data.code,
                        type: 'danger',
                        duration: 3000
                    })
                } else {
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
        } */

    }

    closeEndorseModal = () => {
        this.setState({ EndorseModalVisibility: false, postType: '', endorsementStrength: '', text: '' })
    }

    closeGratitudeModal = () => {
        this.setState({ GratitudeModalVisibility: false, postType: '', text: '' })
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
                    <Text style={[styles.buttonText, { fontSize: fontSize, color: '#1c92c4' }]}>Gratitude</Text>
                </TouchableOpacity>

            </View>
        )
    }

    associateTagHandler = (taggedAssociates) => {
        this.setState({ taggedAssociates })
    }

    endorsementHandler = (endorsementStrength, text) => {
        this.setState({ endorsementStrength, text })
    }

    gratitudeHandler = (text) => {
        this.setState({ text })
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
                    >
                        <Icon name='md-eye' style={{ fontSize: 12, paddingHorizontal: 5, color: 'white' }} />
                        <Text style={styles.buttonText}>{this.state.visibilitySelection}</Text>
                    </TouchableOpacity>

                    <AssociateTager
                        isShowingKeyboard={this.state.isShowingKeyboard}
                        associateTagHandler={this.associateTagHandler}
                        associateData={this.associateData}
                    />

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
                </ScrollView>

                <VisibilityModal
                    enabled={this.state.visibilityModal}
                    data={this.visibilityData}
                    onChangeListener={(text, name) => {
                        this.setState({ visibilitySelection: text, visibilityName: name })
                    }}
                    visibilityDisableHandler={() => {
                        this.setState({ visibilityModal: false })
                    }}
                    state={this.state.visibilitySelection}
                />
                <LoadingModal
                    enabled={this.state.isLoading}
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

    }
});

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        firstName: state.user.firstName,
        lastName: state.user.lastName
    };
}

export default connect(mapStateToProps, null)(CreatePost)