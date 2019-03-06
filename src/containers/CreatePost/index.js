import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    View,
    Alert,
    BackHandler,
    TouchableOpacity,
    Dimensions,
    Text,
    TextInput,
    Modal,
    TouchableHighlight
} from 'react-native';

/* Native Base */
import {
    Container,
    Content,
    Icon,
    Spinner,
    Toast,
    H3
} from 'native-base';

/* Assets */
import image from '../../assets/surveyBackground.jpg'

/* Utilities */
import clearStackNavigate from '../../utilities/clearStackNavigate'
class CreatePost extends React.Component {

    constructor(props) {
        super(props)
        this.state={
            visibilityModal:true
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack()
            return true
        })
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    goBack = () => {
        Alert.alert(
            'Are you sure?',
            'Your post is not created yet',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        clearStackNavigate('Home', this.props)
                    }
                }
            ],
            { cancelable: false },
        )
    }
    render() {
        return (

            <Container>
                <Content
                    contentContainerStyle={styles.container}
                >
                    <ImageBackground
                        source={image}
                        style={styles.image}
                        onLoadEnd={this.loadComponents}
                    >

                        <View name='header' style={styles.headerContainer}>
                            <Icon name='ios-arrow-back' style={styles.header} onPress={this.goBack} />
                            <H3 style={styles.headerText}>Leave a note</H3>
                            <Icon name='md-checkmark' style={styles.header} onPress={this.goBack} />
                        </View>

                        <View name='content' style={styles.content}>
                            <View style={{
                                flex:1,
                                backgroundColor:'#fff',
                                marginHorizontal:10,
                                marginBottom:20,
                                borderRadius:5,
                                alignItems:'center'
                            }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor:'#1c92c4',
                                        flexDirection:'row',
                                        alignItems:'center',
                                        justifyContent:'center',
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        marginHorizontal:10,
                                        marginTop: 10,
                                        borderRadius:5
                                    }}
                                    onPress={()=>this.setState({visibilityModal:true})}
                                >
                                    <Icon name='md-eye' style={{fontSize:12,paddingHorizontal:5,color:'white'}} />
                                    <Text style={styles.buttonText}>Anyone</Text>
                                </TouchableOpacity>
                                <View style={{
                                    backgroundColor:'#333',
                                    height:1,
                                    width:'90%',
                                    marginVertical: 10
                                }}/>
                                <TextInput
                                    multiline = {true}
                                    placeholder='Write something here'
                                    scrollEnabled={true}
                                    style={{
                                        
                                        padding:20,
                                        flex:1,
                                        fontSize:20,
                                        width:'100%',
                                        textAlignVertical:'top'
                                        
                                    }}>
                                    
                                </TextInput>
                                <View style={{
                                    backgroundColor:'#333',
                                    height:1,
                                    width:'70%',
                                    marginVertical: 10
                                }}/>
                                
                                <View name='buttonContainer' style={{
                                    marginHorizontal:5,
                                    marginBottom:10,
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent: 'center'
                                }}>
                                    <TouchableOpacity style={styles.button}>
                                        <Icon name='md-people' style={{fontSize:12,paddingHorizontal:5,color:'white'}} />
                                        <Text style={styles.buttonText}>Endorse</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button}>
                                        <Icon name='md-thumbs-up' style={{fontSize:12,paddingHorizontal:5,color:'white'}} />
                                        <Text style={styles.buttonText}>Gratitude</Text>
                                    </TouchableOpacity>
                                    
                                </View>
                            </View>
                            
                        </View>
                    </ImageBackground>

                </Content>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.visibilityModal}
                    hardwareAccelerated={true}
                    onRequestClose={() => {
                        this.setState({visibilityModal:false})
                    }}
                    style={{
                        height:500,
                        width:500,
                        backgroundColor:'#00000033'
                    }}
                >
                    <TouchableHighlight
                        style={{
                            flex:1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor:'#00000055'
                        }}
                        onPress={()=>this.setState({visibilityModal:false})}
                    >
                        <View
                            style={{
                                
                                width:'80%',
                                backgroundColor:'white',
                                borderRadius:5,
                                alignItems:'center',
                                padding:10
                            }}
                        >
                            <View
                                name='header'
                                style={{
                                    flexDirection:'row',
                                    
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Icon name='md-eye' style={{fontSize:20,paddingHorizontal:5,color:'black'}} />
                                <Text style={{
                                    color: 'black',
                                    textAlign: 'center'
                                    
                                }}
                                >Visibility</Text>
                            </View>
                            
                            <View style={{
                                backgroundColor:'#333',
                                height:1,
                                width:'100%',
                                marginVertical: 10
                            }}/>

                            <TouchableOpacity
                                style={{
                                    
                                    flexDirection: 'row',
                                    padding:10,
                                    width:'100%'
                                }}
                                onPress={()=>console.log('clicked on anyone')}
                            >
                                <Icon name='md-globe' style={{fontSize:20,paddingHorizontal:10,color:'#1c92c4'}} />
                                <Text style={{
                                    color: '#1c92c4',
                                    textAlign: 'center'
                                    
                                }}
                                >Anyone</Text>
                            </TouchableOpacity>
                            <View style={{
                                backgroundColor:'#ddd',
                                height:1,
                                width:'90%',
                                marginVertical: 10
                            }}/>
                            <View
                                style={{
                                    
                                    flexDirection: 'row',
                                    padding:10,
                                    width:'100%'
                                }}
                            >
                                <Icon name='md-people' style={{fontSize:20,paddingHorizontal:10,color:'#aaa'}} />
                                <Text style={{
                                    color: '#aaa',
                                    textAlign: 'center'
                                    
                                }}
                                >Team</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </Modal>
            </Container>
            
        );
    }
}

const styles = StyleSheet.create({
    button:{
        flex:1,
        backgroundColor:'#1c92c4',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin:5,
        borderRadius:5
    },
    container: {
        flex: 1
    },
    headerContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 30,
        justifyContent: 'space-between'
    },
    content: {
        flex: 9
    },
    image: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 15
    },

    header: {
        color: 'white',
        width: 20
    },
    headerText:{
        color: 'white',
        textAlign: 'center'
    },
    buttonText:{
        color: 'white',
        textAlign: 'center',
        fontSize:12
    }
});

export default CreatePost