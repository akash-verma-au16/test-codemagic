import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    View,
    Dimensions,
    BackHandler,
    Image,
    ToastAndroid
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
import image from '../../assets/rsz_gradient-background.png'
import icon from '../../assets/smily.png'
//RBAC handler function
import { checkIfSessionExpired } from '../RBAC/RBAC_Handler'
/* Services */
import { read_survey } from '../../services/questionBank'

import { refreshToken } from '../../services/bAuth'
import AsyncStorage from '@react-native-community/async-storage';

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
        this.APIResponse = null
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('TabNavigator')
            return true
        })
        this.updateRefreshToken()
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    updateRefreshToken = async () => {

        this.setState({ isLoading: true })
        const payload = {
            refresh_token: this.props.refreshTokenKey,
            tenant_id: this.props.accountAlias
        }

        const tokenExp = await AsyncStorage.getItem('accessTokenExp')
        /* epoch time calculation */
        const dateTime = Date.now();
        const currentEpoc = Math.floor(dateTime / 1000);

        if (tokenExp < currentEpoc) {
            /* Token has expired */
            refreshToken(payload).then(async (res) => {
                this.props.updateNewTokens({ accessToken: res.data.payload.AccessToken })
                // store token expire time in the local storage
                await AsyncStorage.setItem('accessTokenExp', JSON.stringify(res.data.payload.AccessTokenPayload.exp))
                this.readSurveyHandler()

            }).catch(() => {
                this.setState({ isLoading: false })
            })
        } else {
            this.readSurveyHandler()
        }
    }
    readSurveyHandler = () => {
        //Authorization headers
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }
        if (this.props.isConnected) {
            if (this.surveyId) {
                this.setState({ isLoading: true }, () => {
                    if (this.props.isConnected) {
                        read_survey(this.surveyId, headers).then(response => {
                            this.surveyName = response.data.data.survey.name
                            this.surveyDescription = response.data.data.survey.description
                            this.APIResponse = response
                            this.setState({ isLoading: false })
                        }).catch((e) => {
                            const isSessionExpired = checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                            if (!isSessionExpired) {
                                this.readSurveyHandler()
                                return
                            }
                            else {
                                this.setState({ isLoading: false })
                            }
                        })
                    } else {
                        this.setState({ isLoading: false })
                        Toast.show({
                            text: "Please connect to the internet.",
                            type: "danger"
                        })
                    }

                })

            }
        }
        else {
            ToastAndroid.showWithGravityAndOffset(
                'Please, Connect to the internet',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
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
                            <Icon name='ios-arrow-back' style={styles.header} onPress={() => this.props.navigation.navigate('TabNavigator')} />
                            <Image
                                source={icon}
                                style={{ height: '50%', resizeMode: 'contain' }}
                            />
                            <Icon style={styles.header} />
                        </View>

                        <View name='content' style={styles.content}>
                            <View style={styles.semiSphere} />
                            <Form style={styles.form}>
                                <View style={{ flex: 3, alignItems: 'center', justifyContent: 'flex-start', margin: 15 }}>

                                    <H1 style={styles.text}>{this.surveyName}</H1>
                                    <H3 style={styles.surveyDescription}>{this.surveyDescription}</H3>

                                </View>
                                <RoundButton
                                    onPress={() => {
                                        if (this.APIResponse)
                                            this.props.navigation.navigate('QuestionContainer', {
                                                questionData: this.APIResponse.data.data
                                            })
                                    }}
                                    value='start'
                                    isLoading={this.state.isLoading}
                                    isLight={false}
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
        width: 50,
        padding: 10
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
    text: {
        marginVertical: 15,
        color: '#47309C',
        textAlign: 'center'
    },
    surveyDescription: {
        textAlign: 'center',
        color: '#47309C',
        fontSize: 20
    }
});

const mapStateToProps = (state) => {
    return {
        isAuthenticate: state.isAuthenticate,
        isConnected: state.system.isConnected,
        accessToken: state.user.accessToken,
        associate_id: state.user.associate_id,
        accountAlias: state.user.accountAlias,
        refreshTokenKey: state.user.refreshToken
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        authenticate: (props) => dispatch({ type: auth.AUTHENTICATE_USER, payload: props }),
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        updateNewTokens: (props) => dispatch({ type: auth.REFRESH_TOKEN, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyIntro)

