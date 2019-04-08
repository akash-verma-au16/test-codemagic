import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
    BackHandler,
    TouchableOpacity,
    Text,
    TextInput
} from 'react-native';

/* Native Base */
import {
    Container,
    Icon,
    Toast,
    Thumbnail,
    H3
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
import MultiSelect from 'react-native-multiple-select';
class CreatePost extends React.Component {

    constructor(props) {
        super(props)

        this.initialState = {
            visibilityModal: false,
            visibilitySelection: 'Organization',
            text: '',
            isLoading: false,
            EndorseModalVisibility: false,
            selectedItems: []
        }
        this.state = this.initialState
        this.inputTextRef = React.createRef();
        this.items = [{
            id: '92iijs7yta',
            name: 'Ondo'
        }, {
            id: 'a0s0a8ssbsd',
            name: 'Ogun'
        }, {
            id: '16hbajsabsd',
            name: 'Calabar'
        }, {
            id: 'nahs75a5sg',
            name: 'Lagos'
        }, {
            id: '667atsas',
            name: 'Maiduguri'
        }, {
            id: 'hsyasajs',
            name: 'Anambra'
        }, {
            id: 'djsjudksjd',
            name: 'Benue'
        }, {
            id: 'sdhyaysdj',
            name: 'Kaduna'
        }, {
            id: 'suudydjsjd',
            name: 'Abuja'
        }];
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
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };
    closeEndorseModal = () => {
        this.setState({ EndorseModalVisibility: false })
    }
    listMemberListener = (name) => {
        let message = ''
        if (this.state.text.trim() !== '') {
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
        const { selectedItems } = this.state;
        return (

            <Container style={{flex:1}}>

                <View style={{
                    
                    backgroundColor: '#eee',
                    flex:1,
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

                    <View style={{
                        alignItems:'center',
                        width: '90%',
                        borderRadius: 10,
                        backgroundColor:'#fff'
                    }}>
                        <View style={{backgroundColor:'#1c92c4', flexDirection: 'row',borderTopRightRadius:10,borderTopLeftRadius:10, justifyContent: 'space-between', alignItems: 'center',paddingHorizontal:20, padding: 10, width: '100%' }}>

                            <H3 style={{color:'#fff'}}>Tag your colleagues</H3>
                            {this.state.selectedItems.length>0?
                                <Icon name='ios-close'style={{color:'#fff'}} onPress={()=>this.setState({selectedItems:[]})} />
                                :null}
                            
                        </View>
                       
                        <View style={{ width: '100%',paddingHorizontal:20,marginTop:10,marginBottom:10}}>

                            <MultiSelect

                                items={this.items}
                                uniqueKey='id'
                                ref={(component) => { this.multiSelect = component }}
                                onSelectedItemsChange={this.onSelectedItemsChange}
                                selectedItems={selectedItems}
                                selectText='Select colleagues'
                                searchInputPlaceholderText='Search colleagues...'
                                onChangeInput={(text) => console.log(text)}
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
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>

                    </View>
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
        associate_id: state.user.associate_id

    };
}

export default connect(mapStateToProps, null)(CreatePost)