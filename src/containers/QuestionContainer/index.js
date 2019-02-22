import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    View,
    Alert,
    BackHandler,
    TouchableOpacity,
    Dimensions
} from 'react-native';

/* Native Base */
import {
    Container,
    Content,
    Icon,
    Spinner,
    Toast
} from 'native-base';
/* Redux */
import { connect } from 'react-redux'
import { auth } from '../../store/actions'
/* Custom components */
import Question from '../../components/Question'
/* Assets */
import image from '../../assets/surveyBackground.jpg'
/* Services */
import { save_answers } from '../../services/dataApi'
import {give_rewards} from '../../services/rewards'
/* Utilities */
import clearStackNavigate from '../../utilities/clearStackNavigate'
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
class QuestionContainer extends React.Component {

    constructor(props) {
        super(props)
        this.questionData = this.props.navigation.getParam('questionData')
        this.state = {
            currentPage: 0,
            pageCount: this.questionData.questions.length,
            isSubmitLoading: false,
            answer_set: {
                "97b7b8cb-a607-4cfb-8165-f7b98e6a4bf6": {
                    "row": "col",
                    "Customer Service Experience": "Well Above Average",
                    "Purchase Experience": "Well Below Average"
                },
                "0cca5f8e-3826-406d-9c92-f48055fd05eb": {
                    "My Experience was": "Somewhat Pleasant"
                }
            },
            answerSet: {}
        }
        this.pager = React.createRef();
        
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
    answerHandler = (questionId, answerObj) => {
        this.answerSet = {
            ...this.answerSet,

            [questionId]: {
                answer: answerObj.text
            }

        }
    }
    /* create questions based on payload */
    createQuestions = () => {
        this.questions = []

        if (this.questionData.questions.length) {

            this.questionData.questions.map((question, index) => {
                this.questions.push(
                    <View key={index}>
                        <Question
                            questionId={question.question_id}
                            question={question.question.title}
                            options={question.question.options}
                            pageSwitchHandler={this.switchToNextPage}
                            isSubmitLoading={this.state.isSubmitLoading}
                            answerHandler={this.answerHandler}
                        />
                    </View>
                )
            })

        }
    }
    switchToNextPage = () => {
        /* Auto navigate to next page */
        if (this.state.currentPage < this.state.pageCount - 1)
            this.pager.setPage(this.state.currentPage + 1)
    }
    submitHandler = () => {
        this.setState({ isSubmitLoading: true })
        try {
            if (this.answerSet) {
                let payload= {
                    tenant_id: this.props.tenant_id,
                    associate_id: '3448cd7e-aef7-452f-a697-22d85114d6cf',
                    survey_id: this.questionData.survey.id,
                    answer_set: this.answerSet
                }
                save_answers(payload).then(()=>{

                    /* Give rewards */
                    give_rewards({
                        tenant_id : this.props.tenant_id,
                        uuid : '3448cd7e-aef7-452f-a697-22d85114d6cf',
                        event_name : this.questionData.survey.type
                    }).then((res)=>{
                        console.log(res)
                    }).catch(err=>{
                        console.log(err)
                    })
                    clearStackNavigate('SurveyExit', this.props)
                }).catch(error=>{

                    throw error.response
                })
            } else {
                throw 'answer questions first'
            }
        } catch (error) {

            Toast.show({
                text: error,
                type: 'danger'
            })
            this.setState({ isSubmitLoading: false })
        }
        
    }

    goBack = () => {
        Alert.alert(
            'Are you sure?',
            'Your answers are not saved until you submit',
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
        this.createQuestions()
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
                        </View>

                        <View name='content' style={styles.content}>
                            <IndicatorViewPager
                                style={styles.container}
                                indicator={this._renderDotIndicator()}

                                ref={ref => this.pager = ref}
                                onPageSelected={(page) => this.setState({ currentPage: page.position })}
                            >
                                {this.questions}
                            </IndicatorViewPager>
                            {this.state.currentPage === this.state.pageCount - 1 ?

                                <TouchableOpacity style={styles.submitButton}>
                                    {this.state.isSubmitLoading ?
                                        <Spinner color='white' />
                                        :
                                        <Icon name='md-checkmark' style={{ color: 'white' }} onPress={this.submitHandler} />
                                    }
                                </TouchableOpacity>

                                : null}
                        </View>
                    </ImageBackground>

                </Content>
            </Container>
        );
    }

    _renderDotIndicator() {
        return <PagerDotIndicator selectedDotStyle={styles.indicator} pageCount={this.state.pageCount} />;
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
        flex: 9
    },
    image: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 15
    },
    indicator: {
        backgroundColor: '#1c92c4'
    },
    header: {
        color: 'white',
        width: 50
    },
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1c92c4',
        width: 50,
        aspectRatio: 1 / 1,
        borderRadius: 50,
        position: 'absolute',
        bottom: 30,
        left: Dimensions.get('window').width / 2 - 25
    }
});

const mapStateToProps = (state) => {
    return {
        isAuthenticate: state.isAuthenticate,
        tenant_id:state.user.accountAlias
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        authenticate: (props) => dispatch({ type: auth.AUTHENTICATE_USER, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionContainer)