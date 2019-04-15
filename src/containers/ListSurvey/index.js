import React from 'react';
import {
    View,
    TouchableOpacity
} from 'react-native';
import { H2 } from 'native-base'
/* Redux */
import { connect } from 'react-redux'
import { auth, dev } from '../../store/actions'
import { BarChart } from 'react-native-charts-wrapper';
/* Native Base */
import {
    Container,
    Content,
    Toast,
    Thumbnail
} from 'native-base';
import SurveyTabNavigator from '../SurveyTabNavigator'
/* Custom Components */
import LoadingModal from '../LoadingModal'
import thumbnail from '../../assets/thumbnail.jpg'
class ListSurvey extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {

            headerRight: (
                <React.Fragment />
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
    toast = () => {
        Toast.show({
            text: 'Coming Soon!',
            type: 'success',
            duration: 3000
        })
    }

    data = [
        {
            key: 'Daily Survey',
            icon: 'md-stats',
            onPress: () => this.props.navigation.navigate('SurveyIntro', {
                surveyId: '3',
                surveyName: 'Daily-Questionnaire',
                surveyDescription: 'Daily Survey',
                surveyNote: 'note',
                surveyLevel: 'beginner'
            })
        },
        {
            key: 'Weekly Survey',
            icon: 'md-stats',
            onPress: () => this.props.navigation.navigate('SurveyIntro', {
                surveyId: '1 ',
                surveyName: 'Weekly-Questionnaire',
                surveyDescription: 'Weekly Survey',
                surveyNote: 'note',
                surveyLevel: 'beginner'
            })
        }
    ]

    render() {

        return (

            <Container style={{ backgroundColor: '#eee' }}>

                <View style={{
                    flex: 1, 
                    margin: 10,
                    backgroundColor: '#fff', 
                    borderRadius: 5, 
                    shadowOffset: { width: 5, height: 5 },
                    shadowColor: 'black',
                    shadowOpacity: 0.5,
                    elevation: 2
                }}>
                    <H2 style={{ margin: 20, marginBottom: 10 }}>Survey summary</H2>
                    <BarChart style={{
                        flex: 1,
                        margin: 10

                    }}
                    data={{ dataSets: [{ label: "Sample Data", values: [{ y: 10 }, { y: 20 }, { y: 1 }, { y: 10 }, { y: 15 }, { y: 5 }, { y: 18 }, { y: 12 }, { y: 1 }] }] }}
                    />
                </View>
                <Content
                    contentContainerStyle={{ flex: 1 }}
                    scrollEnabled={true}
         
                >
                    <SurveyTabNavigator />
                    <TouchableOpacity
                        onPress={()=>this.props.navigation.navigate('SurveyIntro',{
                            surveyId:'10',
                            surveyName:'Daily-Questionnaire',
                            surveyDescription:'Daily Survey',
                            surveyNote:'note',
                            surveyLevel:'beginner'
                        })}
                        style={{height:100,width:50,backgroundColor:'red'}}
                    >

                    </TouchableOpacity>
                </Content>
                <LoadingModal
                    enabled={this.state.isLoading}
                />
            </Container>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        email: state.user.emailAddress

    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        clearData: () => dispatch({ type: dev.CLEAR_DATA })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListSurvey)