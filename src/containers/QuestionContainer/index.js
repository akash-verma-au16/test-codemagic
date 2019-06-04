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
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';

class QuestionContainer extends React.Component {
    constructor(props) {
        super(props)
        this.questionData = this.props.navigation.getParam('questionData')
        this.state = {
            currentPage: 0,
            pageCount: this.questionData.questions.length,
            isSubmitLoading: false,
            
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
    // for MCQ
    answerHandler = (questionId, answerObj) => {
        this.answerSet = {
            ...this.answerSet,

            [questionId]: {
                answer: answerObj.text
            }

        }
    }
    // for MCQM
    MCQMHandler = (questionId, answerObj) => {
        console.log('linked',answerObj)
        this.answerSet = {
            ...this.answerSet,

            [questionId]: {
                answer: answerObj
            }

        }
    }
    // for ROS
    ROSHandler = (questionId, answerObj) => {
        let ranks = {}
        
        answerObj.map((item,index)=>{
            ranks={
                ...ranks,
                [item.label]:index
            }
        })
        this.answerSet = {
            ...this.answerSet,

            [questionId]: ranks

        }
    }
    // for SCQ
    SCQHandler = (questionId, answerObj) => {
        this.answerSet = {
            ...this.answerSet,

            [questionId]: answerObj

        }
    }
    /* create questions based on payload */
    createQuestions = () => {
        this.questions = []

        if (this.questionData.questions.length) {

            this.questionData.questions.map((question, index) => {

                let title = question.question.title
                if(question.type==='RSCQ'){
                    if(question.question.options.length===1){
                        title=question.question.options[0].title
                    }else{
                        title='Answer the following questions'
                    }
                }
                
                this.questions.push(
                    <View key={index}>
                        <Question
                            questionId={question.question_id}
                            question={title}
                            type={question.type}
                            options={question.question.options}
                            pageSwitchHandler={this.switchToNextPage}
                            isSubmitLoading={this.state.isSubmitLoading}
                            answerHandler={this.answerHandler}
                            ROSHandler={this.ROSHandler}
                            SCQHandler={this.SCQHandler}
                            MCQMHandler={this.MCQMHandler}
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

    //Authemtication header
    headers = {
        headers: {
            Authorization: this.props.idToken
        }
    }

    submitHandler = () => {
        this.setState({ isSubmitLoading: true })
        try {
            if(this.props.isConnected) {
                if (this.answerSet) {
                    let payload = {
                        tenant_id: this.props.tenant_id,
                        associate_id: this.props.associate_id,
                        survey_id: this.questionData.survey.id,
                        answer_set: this.answerSet
                    }
                    save_answers(payload, this.headers).then(() => {

                        /* Give rewards */
                        give_rewards(
                            {
                                "tenant_id" : this.props.tenant_id,
                                "associate_id" : this.props.associate_id,
                                "event_id" : "a675055e-2d11-42e1-8938-57a4f5fc037b"
                            }, this.headers).then((res) => {
                            this.props.navigation.navigate('SurveyExit', {
                                rewardPoints: res.data.points
                            })
                        }).catch(() => {
                            this.props.navigation.navigate('SurveyExit', {
                                rewardPoints: 0
                            })
                        })
                    }).catch(() => {
                        Toast.show({
                            text: "Something went wrong, please try again.",
                            type: 'danger',
                            duration: 2000
                        })
                        this.setState({ isSubmitLoading: false })
                    })
                } else {
                    throw 'answer questions first'
                }
            } else {
                Toast.show({
                    text: "Please, connect to the internet.",
                    type: 'danger'
                })
                this.setState({ isSubmitLoading: false })
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
            'Your answers will not be saved untill you submit.',
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

                                <TouchableOpacity style={styles.submitButton} onPress={this.submitHandler}>
                                    {this.state.isSubmitLoading ?
                                        <Spinner color='white' />
                                        :
                                        <Icon name='md-checkmark' style={{ color: 'white' }} />
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
        width: 50,
        padding:10
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
        tenant_id:state.user.accountAlias,
        isConnected: state.system.isConnected,
        associate_id: state.user.associate_id,
        idToken: state.user.idToken
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        authenticate: (props) => dispatch({ type: auth.AUTHENTICATE_USER, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionContainer)