import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
    BackHandler,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    TextInput,
    Keyboard
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
/* Components */
import VisibilityModal from '../VisibilityModal'
import LoadingModal from '../LoadingModal'
import thumbnail from '../../assets/thumbnail.jpg'
import ListMember from '../ListMember'

class CreatePost extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visibilityModal: false,
            visibilitySelection: '',
            text: '',
            isLoading: false,
            EndorseModalVisibility: false
        }
        this.inputTextRef = React.createRef();
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
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    goBack = () => {
        if (this.state.text === '') {
            this.props.navigation.navigate('TabNavigator')
        } else {
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
                            this.props.navigation.navigate('TabNavigator')
                        }
                    }
                ],
                { cancelable: false },
            )
        }

    }

    // Submitting post handler function
    postSubmitHandler = () => {
        if (this.state.text.trim() === '') {
            Toast.show({
                text: 'Please write someting',
                type: 'danger',
                duration: 3000
            })
            return
        }
        const payload = {
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id,
            type: "post",
            message: this.state.text.trim(),
            privacy: this.state.visibilitySelection
        }
        this.setState({ isLoading: true })
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
        }
    }

    closeEndorseModal = () => {
        this.setState({ EndorseModalVisibility: false })
    }
    listMemberListener = (name) => {
        let message = ''
        if(this.state.text.trim()!==''){
            message = `\n`
        }
        message += `@` + name + ` thanks for `
        this.setState({
            EndorseModalVisibility: false,
            text: this.state.text + message
        })
        this.inputTextRef.current.focus()
    }
    render() {
        const fontSize = 15
        return (

            <Container>
                <TouchableOpacity activeOpacity={1} style={{flex: 1}} onPress= {Keyboard.dismiss}>
                    <View name='content' style={styles.content}>
                        <View style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            marginHorizontal: 10,
                            marginBottom: 20,
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
                                    marginTop: 10,
                                    borderRadius: 5
                                }}
                                onPress={() => this.setState({ visibilityModal: true })}
                            >
                                <Icon name='md-eye' style={{ fontSize: 12, paddingHorizontal: 5, color: 'white' }} />
                                <Text style={styles.buttonText}>{this.state.visibilitySelection}</Text>
                            </TouchableOpacity>
                            <View style={{
                                backgroundColor: '#333',
                                height: 1,
                                width: '90%',
                                marginVertical: 10
                            }} />
                            <TextInput
                                multiline={true}
                                maxLength={255}
                                placeholder='Write something here'
                                scrollEnabled={true}
                                style={{

                                    padding: 20,
                                    flex: 1,
                                    fontSize: 20,
                                    width: '100%',
                                    textAlignVertical: 'top'

                                }}
                                value={this.state.text}
                                onChangeText={(text) => this.setState({ text: text })}
                                ref={this.inputTextRef}
                            />

                            <View style={{
                                backgroundColor: '#333',
                                height: 1,
                                width: '90%',
                                marginVertical: 10
                            }} />

                            <View name='buttonContainer' style={{
                                marginHorizontal: 5,
                                marginBottom: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <TouchableOpacity style={styles.button} onPress={() => Toast.show({
                                    text: 'Coming Soon!',
                                    type: 'success',
                                    duration: 3000
                                })}>
                                    <Icon name='md-people' style={{ fontSize: fontSize, paddingHorizontal: 5, color: 'white' }} />
                                    <Text style={[styles.buttonText, { fontSize: fontSize }]}>Endorse</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => {
                                    this.setState({ EndorseModalVisibility: true })
                                }}>
                                    <Icon name='md-thumbs-up' style={{ fontSize: fontSize, paddingHorizontal: 5, color: 'white' }} />
                                    <Text style={[styles.buttonText, { fontSize: fontSize }]}>Gratitude</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                    </View>

                    <VisibilityModal
                        enabled={this.state.visibilityModal}
                        data={[
                            { icon: 'md-globe', text: 'Organization' },
                            { icon: 'md-people', text: 'Project' },
                            { icon: 'md-person', text: 'Private' }
                        ]}
                        onChangeListener={(text) => {
                            this.setState({ visibilitySelection: text })
                        }}
                        visibilityDisableHandler={() => {
                            this.setState({ visibilityModal: false })
                        }}
                        state={this.state.visibilitySelection}
                    />
                    <LoadingModal
                        enabled={this.state.isLoading}
                    />
                    <ListMember
                        enabled={this.state.EndorseModalVisibility}
                        closeHandler={this.closeEndorseModal}
                        onPressListener={this.listMemberListener}
                    />
                </TouchableOpacity>
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        backgroundColor: '#1c92c4',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 5,
        borderRadius: 5
    },

    content: {
        flex: 9
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
        isConnected: state.system.isConnected

    };
}

export default connect(mapStateToProps, null)(CreatePost)