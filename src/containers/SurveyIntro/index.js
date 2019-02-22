import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    View,
    Dimensions,
    BackHandler,
    Image
} from 'react-native';

/* Native Base */
import {
    Container,
    Content,
    Icon,
    Form,
    Toast,
    H1,
    H3
} from 'native-base';
/* Redux */
import { connect } from 'react-redux'
import { auth } from '../../store/actions'
/* Custom components */
import RoundButton from '../../components/RoundButton'
/* Assets */
import image from '../../assets/surveyBackground.jpg'
import icon from '../../assets/smily.png'
/* Services */
import { read_survey } from '../../services/questionBank'
class SurveyIntro extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
        this.surveyId = this.props.navigation.getParam('surveyId')
        this.surveyName = this.props.navigation.getParam('surveyName')
        this.surveyDescription = this.props.navigation.getParam('surveyDescription')
        this.surveyNote = this.props.navigation.getParam('surveyNote')
        this.surveyLevel = this.props.navigation.getParam('surveyLevel')
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Home')
            return true
        })
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }
    readSurveyHandler = () => {
        if (this.surveyId) {
            this.setState({ isLoading: true }, () => {

                read_survey(this.surveyId).then(response => {
                    this.props.navigation.navigate('QuestionContainer', {
                        questionData: response.data.data
                    })
                    this.setState({ isLoading: false })
                }).catch((error) => {
                    this.setState({ isLoading: false })
                    Toast.show({
                        text: error.response.data.code,
                        type: "danger"
                    })
                })

            })

        }
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
                        
                    >
                        <View name='header' style={styles.headerContainer}>
                            <Icon name='ios-arrow-back' style={styles.header} onPress={()=>this.props.navigation.navigate('Home')} />
                            <Image
                                source={icon}
                                style={{height: '50%',resizeMode:'contain'}}
                            />
                            <Icon style={styles.header}/>
                        </View>

                        <View name='content' style={styles.content}>
                            <View style={styles.semiSphere} />
                            <Form style={styles.form}>
                                <View style={{ flex: 3, alignItems: 'center', justifyContent: 'flex-start', margin: 15 }}>

                                    <H1 style={styles.text}>{this.surveyName}</H1>
                                    <H3 style={styles.text}>{this.surveyDescription}</H3>
                                    
                                </View>
                                <RoundButton
                                    onPress={this.readSurveyHandler}
                                    value='start'
                                    isLoading={this.state.isLoading}
                                />
                            </Form>
                        </View>
                    </ImageBackground>

                </Content>
            </Container>
        );
    }

}

const styles = StyleSheet.create({
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
        flex: 3,
        alignItems: 'center'
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
        width:50
    },
    semiSphere: {
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: 200,
        borderTopRightRadius: Dimensions.get('window').width / 2,
        borderTopLeftRadius: Dimensions.get('window').width / 2,
        transform: [
            { scaleX: 1.2 }
        ]
    },
    form: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    text:{
        marginVertical: 15,
        color:'#1c92c4'
    }
});

const mapStateToProps = (state) => {
    return {
        isAuthenticate: state.isAuthenticate
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        authenticate: (props) => dispatch({ type: auth.AUTHENTICATE_USER, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyIntro)