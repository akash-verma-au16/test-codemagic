import React from 'react';
import {
    View,
    Text,
    BackHandler,
    processColor
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"
import { H2 } from 'native-base'
/* Redux */
import { connect } from 'react-redux'
import { auth, dev } from '../../store/actions'
import { BarChart } from 'react-native-charts-wrapper';
import { NavigationEvents } from 'react-navigation';
/* Native Base */
import {
    Container,
    Content
} from 'native-base';
//Prefetch Profile Data
import { loadProfile } from '../Home/apicalls'

//RBAC handler function
import { checkIfSessionExpired } from '../RBAC/RBAC_Handler'

class DetailedInsights extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            selectedTab: 0,
            myPulse: [],
            orgPulse: [],
            funQuiz: []
        }
        this.MyPulse = []
        this.OrgPulse = []
        this.FunQuiz = []
        this.pager = React.createRef();
        //Profile Data
        this.profileData = {}
        this.getProfile = this.getProfile.bind(this)
    }

    //Authorization headers
    headers = {
        headers: {
            Authorization: this.props.accessToken
        }
    }
    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack();
            return true;
        });
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        await this.getProfile()
    }

    getProfile = async () => {
        if (this.props.isAuthenticate) {
            //Authorization headers
            const headers = {
                headers: {
                    Authorization: this.props.accessToken
                }
            }
            //profile payload
            const payload1 = {
                tenant_id: this.props.accountAlias,
                associate_id: this.props.associate_id
            }
            this.profileData = await loadProfile(payload1, headers, this.props.isConnected);
            this.props.navigation.setParams({
                'profileData': this.profileData,
                'isConnected': this.props.isConnected,
                'associateId': this.props.associate_id
            })
        }
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        this.backHandler.remove();
    }

    handleConnectivityChange = async (isConnected) => {
        if (isConnected) {
            await this.getProfile()
        }
        else {
            this.props.navigation.setParams({ 'isConnected': false })
        }
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
                <Content
                    contentContainerStyle={{}}
                    scrollEnabled={true}

                >
                    <View
                        style={{
                            flex: 1,
                            margin: 10,
                            backgroundColor: '#fff',
                            borderRadius: 5,
                            shadowOffset: { width: 5, height: 5 },
                            shadowColor: 'black',
                            shadowOpacity: 0.5,
                            elevation: 2
                        }}>
                        <H2 style={{ margin: 20, marginBottom: 10 }}>Your Weekly Sleeping hours</H2>
                        <View style={{ flexDirection: 'row', flex: 1 }}>

                            <BarChart
                                style={{
                                    flex: 1,
                                    margin: 10,
                                    height: 200
                                }}
                                chartDescription={{
                                    text: '',
                                    textSize: 0,
                                    textColor: processColor('darkgray')
                        
                                }}
                                data={{
                                    dataSets: [{
                                        values: [{ y: 10 }, { y: 2 }, { y: 1 }, { y: 4 }, { y: 4 }, { y: 9 }, { y: 5 }],
                                        label: 'Sleep in Hours',
                                        config: {
                                            colors: [processColor('#2ecc71'), processColor('#e74c3c'), processColor('#e74c3c'), processColor('#e67e22'), processColor('#e67e22'), processColor('#2ecc71'), processColor('#e67e22')],
                                            valueTextColor: processColor('#fff'),
                                            barShadowColor: processColor('#47309C'),
                                            highlightAlpha: 90,
                                            highlightColor: processColor('#47309C')
                                        }
                                    }],

                                    config: {
                                        barWidth: 0.5
                                    }
                                }}
                                xAxis={{
                                    valueFormatter: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                    granularityEnabled: true,
                                    granularity : 1
                                }}
                                animation={{ durationX: 2000 }}
                                legend={{
                                    enabled: false
                                }}
                                gridBackgroundColor={processColor('#ffffff')}
                                visibleRange={{ x: { min: 5, max: 5 } }}
                                drawBarShadow={false}
                                drawValueAboveBar={false}
                                drawHighlightArrow={false}
                            />
                            
                        </View>
                        <Text style={{width:'100%',textAlign:'center',fontSize:12,color:'black',fontStyle:'italic',marginBottom:10}}>
                                Ideally you should sleep 8 hours every night
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            margin: 10,
                            backgroundColor: '#fff',
                            borderRadius: 5,
                            shadowOffset: { width: 5, height: 5 },
                            shadowColor: 'black',
                            shadowOpacity: 0.5,
                            elevation: 2
                        }}>
                        <H2 style={{ margin: 20, marginBottom: 10 }}>Your Weekly Energy Score</H2>
                        <View style={{ flexDirection: 'row', flex: 1 }}>

                            <BarChart
                                style={{
                                    flex: 1,
                                    margin: 10,
                                    height: 200
                                }}
                                chartDescription={{
                                    text: '',
                                    textSize: 0,
                                    textColor: processColor('darkgray')
                        
                                }}
                                data={{
                                    dataSets: [{
                                        values: [{ y: 6 }, { y: 3 }, { y: 1 }, { y: 3 }, { y: 5 }, { y: 8 }, { y: 6 }],
                                        label: 'Energy Score',
                                        config: {
                                            color: processColor('#47309C'),
                                            valueTextColor: processColor('#fff'),
                                            barShadowColor: processColor('#47309C'),
                                            highlightAlpha: 90,
                                            highlightColor: processColor('#47309C')
                                        }
                                    }],

                                    config: {
                                        barWidth: 0.5
                                    }
                                }}
                                xAxis={{
                                    valueFormatter: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                    granularityEnabled: true,
                                    granularity : 1
                                }}
                                animation={{ durationX: 2000 }}
                                legend={{
                                    enabled: false
                                }}
                                gridBackgroundColor={processColor('#ffffff')}
                                visibleRange={{ x: { min: 5, max: 5 } }}
                                drawBarShadow={false}
                                drawValueAboveBar={false}
                                drawHighlightArrow={false}
                            />
                        </View>
                    </View>
                    
                    <NavigationEvents
                        onWillFocus={async () => {
                            if (this.props.isConnected) {
                                if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                    this.props.navigation.setParams({ 'imageUrl': this.props.imageUrl })
                                    await this.getProfile()
                                }
                            }
                        }}
                    />

                </Content>

            </Container>

        );
    }
}
const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        email: state.user.emailAddress,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected,
        accessToken: state.user.accessToken,
        imageUrl: state.user.imageUrl

    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        clearData: () => dispatch({ type: dev.CLEAR_DATA })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailedInsights)