import React from 'react';
import { 
    StyleSheet, 
    KeyboardAvoidingView, 
    ImageBackground 
} from 'react-native';
import {
    Form,
    Container,
    Content,
    Toast,
    Text
} from 'native-base';

/* Redux */
import { connect } from 'react-redux'
import { auth,dev } from '../../store/actions'
/* Custom components */
import Logo from '../../components/Logo'
import Slogan from '../../components/Slogan'
import RoundButton from '../../components/RoundButton'
import RatingScale from "../../components/RatingScale";
import RankOrderScale from '../../components/RankOrderScale'
/* Assets */
import image from '../../assets/image.jpg'
/* Utilities */
import clearStackNavigate from '../../utilities/clearStackNavigate'
/* Services */
import {logout} from '../../services/bAuth'
class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
            isSignInLoading: false
        }
    }
    componentWillMount() {
        if(this.props.isFreshInstall){
            clearStackNavigate('TermsAndConditions',this.props)
        }else if (!this.props.isAuthenticate) {
            clearStackNavigate('LoginPage',this.props)
        }
    }
    signOutHandler = () => {
        this.setState({isSignInLoading:true})
        logout({
            accountAlias: this.props.accountAlias,
            email:this.props.email
        }).then(()=>{
            this.props.deAuthenticate()
            Toast.show({
                text: 'Signed out Successfully',
                type: "success"
            })
            clearStackNavigate('LoginPage',this.props)
        }).catch(()=>{
            Toast.show({
                text: 'Unable to communicate with server',
                type: "danger"
            })
            this.setState({isSignInLoading:false})
        })
    }

    clearDataHandler=()=>{
        Toast.show({
            text: 'Data Cleared.. Please reboot the app',
            type: "success",
            duration:3000
        })
        this.props.clearData()
        this.props.navigation.navigate('LoginPage')
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
                        <KeyboardAvoidingView
                            behavior='padding'

                            style={styles.container}
                        >

                            <Form style={styles.form}>

                                <Logo />

                                <Slogan />

                                <Text style={{color:'white',marginVertical:15}}>Wellcome {this.props.firstName}!</Text>
                                
                                <RoundButton
                                    onPress={()=>{
                                        this.props.navigation.navigate('SurveyIntro',{
                                            surveyId:'3',
                                            surveyName:'Slider',
                                            surveyDescription:'Daily Survey',
                                            surveyNote:'note',
                                            surveyLevel:'beginner'
                                        })
                                    }}
                                    value='Slider'
                                />
                                <RoundButton
                                    onPress={()=>{
                                        this.props.navigation.navigate('SurveyIntro',{
                                            surveyId:'2 ',
                                            surveyName:'Daily-Questionnaire',
                                            surveyDescription:'Daily Survey',
                                            surveyNote:'note',
                                            surveyLevel:'beginner'
                                        })
                                    }}
                                    value='Daily Questionnaire'
                                />
                                <RoundButton
                                    onPress={()=>{
                                        this.props.navigation.navigate('SurveyIntro',{
                                            surveyId:'1 ',
                                            surveyName:'Weekly-Questionnaire',
                                            surveyDescription:'Weekly Survey',
                                            surveyNote:'note',
                                            surveyLevel:'beginner'
                                        })
                                    }}
                                    value='Weekly Questionnaire'
                                />
                                
                                <RoundButton
                                    onPress={this.signOutHandler}
                                    value='Sign Out'
                                    isLoading={this.state.isSignInLoading}
                                />
                                <RatingScale
                                    questionId={'1'}
                                    data={''}
                                    selectedOption={null}
                                    pageSwitchHandler={''}
                                    isSubmitLoading={''}
                                    answerHandler={''}
                                /> 

                                <RankOrderScale
                                    questionId={'1'}
                                    data={''}
                                    selectedOption={null}
                                    pageSwitchHandler={''}
                                    isSubmitLoading={''}
                                    answerHandler={''}
                                />
                            </Form>

                        </KeyboardAvoidingView>
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
    form: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        paddingTop: 70
    },
    image: {
        width: '100%',
        height: '100%'
    }
});

const mapStateToProps = (state) => {
    return {
        isAuthenticate: state.isAuthenticate,
        accountAlias: state.user.accountAlias,
        email: state.user.emailAddress,
        isFreshInstall: state.system.isFreshInstall,
        firstName: state.user.firstName
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        clearData: () => dispatch({ type: dev.CLEAR_DATA })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)