import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
    BackHandler,
    TouchableOpacity,
    Text
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
import AssociateTager from '../../components/AssociateTager'
import Endorsement from '../../components/Endorsement'
import Gratitude from '../../components/Gratitude'
class CreatePost extends React.Component {

    constructor(props) {
        super(props)

        this.initialState = {
            visibilityModal: false,
            visibilitySelection: 'Organization',
            text: '',
            isLoading: false,
            EndorseModalVisibility: false,
            GratitudeModalVisibility: false
        }
        this.state = this.initialState
        this.inputTextRef = React.createRef();

    }
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
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    goBack = () => {
        if (this.state.text === '') {
            this.props.navigation.navigate('home')
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
                            this.setState(this.initialState)
                            this.props.navigation.navigate('home')
                        }
                    }
                ],
                { cancelable: false },
            )
        }

    }
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

                Toast.show({
                    text: error.response.data.code,
                    type: 'danger',
                    duration: 3000
                })
                this.setState({ isLoading: false })

            })
        } catch (error) {
            Toast.show({
                text: 'No internet connection',
                type: 'danger',
                duration: 3000
            })
            this.setState({ isLoading: false })
        }

    }

    closeEndorseModal = () => {
        this.setState({ EndorseModalVisibility: false })
    }
    closeGratitudeModal = () => {
        this.setState({ GratitudeModalVisibility: false })
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
                    this.setState({ EndorseModalVisibility: true })
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
                    this.setState({ GratitudeModalVisibility: true })
                }}>
                    <Icon name='md-thumbs-up' style={{ fontSize: iconSize, paddingHorizontal: 5, color: '#1c92c4' }} />
                    <Text style={[styles.buttonText, { fontSize: fontSize, color: '#1c92c4' }]}>Gratitude</Text>
                </TouchableOpacity>

            </View>
        )
    }
    render() {

        return (

            <Container style={{ flex: 1 }}>

                <View style={{

                    backgroundColor: '#eee',
                    flex: 1,
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

                    <AssociateTager />

                    {!this.state.EndorseModalVisibility && !this.state.GratitudeModalVisibility ?
                        <this.toggleButton />
                        : null}

                    {this.state.EndorseModalVisibility ?
                        <Endorsement
                            closeEndorseModal={this.closeEndorseModal}
                        />
                        : null}
                    {this.state.GratitudeModalVisibility ?
                        <Gratitude
                            closeEndorseModal={this.closeGratitudeModal}
                        />
                        : null}
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
        associate_id: state.user.associate_id

    };
}

export default connect(mapStateToProps, null)(CreatePost)