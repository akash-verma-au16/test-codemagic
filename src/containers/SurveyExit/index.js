import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    View,
    Dimensions,
    BackHandler,
    Image,
    Animated
} from 'react-native';

/* Native Base */
import {
    Container,
    Content,
    Form,
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
import icon from '../../assets/trophy.png'

class SurveyExit extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            trophyFade: new Animated.Value(0),
            trophyScale: new Animated.Value(2)
        }
        this.rewardPoints = this.props.navigation.getParam('rewardPoints', 0)

    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.exitSurveyHandler()
            return true
        })
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }
    loadComponents = () => {

        Animated.parallel([
            Animated.timing(
                this.state.trophyFade,
                {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                this.state.trophyScale,
                {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }
            )
        ]).start()

    }
    exitSurveyHandler = () => {
        this.props.navigation.navigate('TabNavigator')
    }

    render() {
        const { trophyFade, trophyScale } = this.state
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
                        <Animated.View name='header' style={[
                            styles.headerContainer,
                            { opacity: trophyFade },
                            {
                                transform: [
                                    { scaleX: trophyScale },
                                    { scaleY: trophyScale }
                                ]
                            }
                        ]}>

                            <Image
                                source={icon}
                                style={{ height: '50%', resizeMode: 'contain' }}
                            />

                        </Animated.View>

                        <View name='content' style={styles.content}>
                            <View style={styles.semiSphere} />
                            <Form style={styles.form}>
                                <View style={{ flex: 3, alignItems: 'center', justifyContent: 'flex-start', margin: 15 }}>

                                    {this.rewardPoints === 0 ?
                                        <React.Fragment>
                                            <H1 style={styles.text}>Better luck next time</H1>
                                            
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <H1 style={styles.text}>Rewards Achieved</H1>
                                            <H3 style={styles.text}>{this.rewardPoints} points</H3>
                                        </React.Fragment>
                                    }
                                </View>
                                <RoundButton
                                    onPress={this.exitSurveyHandler}
                                    value='finish'
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
        justifyContent: 'center'
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
        paddingTop: 15,
        color: '#fefefeaa'
    },
    header: {
        color: 'white',
        width: 50
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
        color: '#1c92c4'
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

export default connect(mapStateToProps, mapDispatchToProps)(SurveyExit)