import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ImageBackground,
    Dimensions,
    RefreshControl,
    ScrollView,
    ToastAndroid,
    ActivityIndicator,
    BackHandler
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"
import { H2 } from 'native-base'
/* Redux */
import { connect } from 'react-redux'
import { auth, dev } from '../../store/actions'
import { NavigationEvents } from 'react-navigation';
/* Native Base */
import {
    Container,
    Content,
    Toast,
    Thumbnail
} from 'native-base';
//Prefetch Profile Data
import { user_profile } from '../../services/profile'
/* Assets */
import nature1 from '../../assets/tileBackgrounds/nature1.jpg'
import nature2 from '../../assets/tileBackgrounds/nature2.jpg'
import nature3 from '../../assets/tileBackgrounds/nature3.jpeg'
import { list_survey } from '../../services/questionBank'
import DailyStats from '../../components/DailyStats'
//RBAC handler function
import { checkIfSessionExpired } from '../RBAC/RBAC_Handler'
/* Custom Components */
import { IndicatorViewPager } from 'rn-viewpager';
import {daily} from '../../services/mobileDashboard'
import  moment from 'moment'
class ListSurvey extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            selectedTab: 0,
            myPulse: [],
            orgPulse: [],
            funQuiz: [],
            isDailyStatsLoading:true,
            dailyStatsPayload:{}
        }
        this.MyPulse = []
        this.OrgPulse = []
        this.FunQuiz = []
        this.pager = React.createRef();
        //Profile Data
        this.profileData = {}
    }

    async componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('home')
            return true;
        });
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
            const profilePayload = {
                tenant_id: this.props.accountAlias,
                associate_id: this.props.associate_id
            }
            user_profile(profilePayload, headers).then((res) => {
                this.profileData = res.data.data
            }).catch((e) => {
                const isSessionExpired = checkIfSessionExpired(e.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                if (!isSessionExpired) {
                    this.getProfile()
                    return
                }
            })
        }
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        this.backHandler.remove()
    }

    handleConnectivityChange = async (isConnected) => {
        if (isConnected) {
            this.props.navigation.setParams({ 'isConnected': true })
            this.loadSurveys()
            this.getProfile()
        }
        else {
            this.props.navigation.setParams({ 'isConnected': false })
        }
    }

    loadSurveys = () => {
        if(this.props.isAuthenticate) {
            //Authorization headers
            const headers = {
                headers: {
                    Authorization: this.props.accessToken
                }
            }
            this.setState({ isLoading: true })
            list_survey({
                tenant_id: this.props.accountAlias
            }, headers)
                .then(response => {
                    this.MyPulse = []
                    this.OrgPulse = []
                    this.FunQuiz = []
                    response.data.data.common_question.map((item, index) => {
                        switch (index % 3) {
                        case 0:
                            this.image = nature1
                            break
                        case 1:
                            this.image = nature2
                            break
                        case 2:
                            this.image = nature3
                        }
                        const card = (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('SurveyIntro', {
                                    surveyId: item.id,
                                    surveyName: item.name,
                                    surveyDescription: item.description,
                                    surveyNote: '',
                                    surveyLevel: item.level
                                })}
                                key={index}
                            >
                                <View>
                                    <ImageBackground style={styles.tile} resizeMode='cover' source={this.image} blurRadius={0.2} borderRadius={5}>
                                        <Text style={styles.tileText}>{item.name}</Text>
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity>
                        )
                        if (item.type === "Daily-Questionnaire") {
                            this.MyPulse.push(card)

                        } else if (item.type === "Weekly-Questionnaire") {
                            this.OrgPulse.push(card)
                        } else {
                            this.FunQuiz.push(card)
                        }

                    })
                    if (this.MyPulse.length == 0) {
                        this.MyPulse.push(
                            <Text key={0} style={{ padding: 10 }}>No Surveys Available</Text>
                        )
                    }
                    if (this.OrgPulse.length == 0) {
                        this.OrgPulse.push(
                            <Text key={0} style={{ padding: 10 }}>No Surveys Available</Text>
                        )
                    }
                    if (this.FunQuiz.length == 0) {
                        this.FunQuiz.push(
                            <Text key={0} style={{ padding: 10 }}>No Surveys Available</Text>
                        )
                    }
                    this.setState({ isLoading: false, myPulse: this.MyPulse, orgPulse: this.OrgPulse, funQuiz: this.FunQuiz })

                })
                .catch((error) => {
                    const isSessionExpired = checkIfSessionExpired(error.response, this.props.navigation, this.props.deAuthenticate, this.props.updateNewTokens)
                    if (!isSessionExpired) {
                        this.loadSurveys()
                        return
                    }
                    this.setState({ isLoading: false })
                })
        }
    }
    loadDailyStats = () =>{
        let today =  moment().format('ddd')
        const payload = {
            tenant_id: this.props.accountAlias,
            associate_id: this.props.associate_id,
            day: today
        }
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }

        daily(payload,headers).then((response)=>{
            try {
                const dailyStatsPayload = {
                    sleepHrs:response.data.data.sleep[0].hrs,
                    sleepDay:response.data.data.sleep[0].day,
                    energyPts: response.data.data.energy[0].pts,
                    energyDay: response.data.data.energy[0].day
                }
                this.setState({isDailyStatsLoading:false,dailyStatsPayload:dailyStatsPayload})
            } catch (error) {
                //Wrong
            }
            
        }).catch(()=>{
            const dailyStatsPayload = {
                sleepHrs:0,
                sleepDay:'',
                energyPts: 0,
                energyDay: ''
            }
            this.setState({isDailyStatsLoading:false,dailyStatsPayload:dailyStatsPayload})
        })
    }
    static navigationOptions = ({ navigation }) => {
        return {

            headerRight: (
                <React.Fragment />
            ),
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        if (navigation.getParam('isConnected')) {
                            navigation.navigate('Profile', {
                                associateId: navigation.getParam('associateId')
                            })
                        }
                    }}
                    style={{ marginLeft: 13, alignItems: 'center', justifyContent: 'center' }}
                >
                    <View style={styles.navImageWrapper}>
                        {navigation.getParam('imageUrl') === '' ?
                            <ActivityIndicator
                                size='small'
                                color='#47309C'
                            />
                            :
                            <Thumbnail
                                source={{ uri: navigation.getParam('imageUrl') }}
                                style={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: 20
                                }}
                                resizeMode='cover'
                            />
                        }
                    </View>
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

    //Helper functions
    showToast = () => {
        ToastAndroid.showWithGravityAndOffset(
            'Coming soon',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            100,
        );
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
                {this.state.isDailyStatsLoading?
                    <View style={{
                        flex: 1,
                        margin: 10,
                        backgroundColor: '#fff',
                        borderRadius: 5,
                        shadowOffset: { width: 5, height: 5 },
                        shadowColor: 'black',
                        shadowOpacity: 0.5,
                        elevation: 2,
                        alignItems:'center'
                    }}>
                        <H2 style={{ margin: 20, marginBottom: 10 }}>Your Daily Stats</H2>
                        <ActivityIndicator
                            size='large'
                            color='#47309C'
                            style={{
                                marginHorizontal: 5
                            }}
                        />
                    </View>
                    :
                    <DailyStats
                        navigation={this.props.navigation}
                        isDailyStatsLoading={this.state.isDailyStatsLoading}
                        dailyStatsPayload = {this.state.dailyStatsPayload}
                    />
                }
                
                <Content
                    contentContainerStyle={{ flex: 1 }}
                    scrollEnabled={true}

                >
                    <View style={{ flex: 1 }}>

                        <View style={{ flexDirection: 'row', width: '100%', backgroundColor: '#47309C', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <TouchableOpacity onPress={() => this.pager.setPage(0)}>
                                <Text name='16/17' style={this.state.selectedTab === 0 ? styles.tabActive : styles.tabInactive}>
                                    My Pulse
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.pager.setPage(1)}>
                                <Text name='7~13' style={this.state.selectedTab === 1 ? styles.tabActive : styles.tabInactive}>
                                    Org Pulse
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <IndicatorViewPager
                            ref={ref => this.pager = ref}
                            style={{ flex: 1 }}
                            onPageSelected={(page) => this.setState({ selectedTab: page.position })}
                        >
                            <View>
                                <ScrollView
                                    contentContainerStyle={{ backgroundColor: '#eee', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.isLoading}
                                            onRefresh={() => {
                                                if (this.props.isConnected) {
                                                    if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                                        this.loadSurveys()
                                                    }
                                                }
                                                else {
                                                    this.showToast()
                                                }
                                            }}
                                        />
                                    }
                                >
                                    {this.state.myPulse}
                                </ScrollView>
                            </View>
                            <View>
                                <ScrollView
                                    contentContainerStyle={{ backgroundColor: '#eee', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.isLoading}
                                            onRefresh={() => {
                                                if (this.props.isConnected) {
                                                    if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                                        this.loadSurveys()
                                                    }
                                                }
                                                else {
                                                    this.showToast()
                                                }
                                            }}
                                        />
                                    }
                                >
                                    {this.state.orgPulse}
                                </ScrollView>
                            </View>
                        </IndicatorViewPager>

                    </View>
                    <NavigationEvents
                        onWillFocus={async () => {
                            if (this.props.isConnected) {
                                if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                    this.props.navigation.setParams({ 'imageUrl': this.props.imageUrl, 'associateId': this.props.associate_id })
                                    this.loadSurveys()
                                    this.loadDailyStats()
                                }
                            }
                        }}
                    />

                </Content>

            </Container>

        );
    }
}
const styles = StyleSheet.create({

    tabActive: {
        color: '#fff',
        paddingVertical: 10
    },
    tabInactive: {
        color: '#ccc',
        paddingVertical: 10
    },
    tile: {
        height: 100,
        width: Dimensions.get('window').width / 2 - 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        margin: 10
    },
    tileText: {
        textAlign: 'center',
        color: '#fff'
    },
    navImageWrapper: {
        backgroundColor: '#eee',
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id,
        email: state.user.emailAddress,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected,
        accessToken: state.user.accessToken,
        imageUrl:state.user.imageUrl

    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        clearData: () => dispatch({ type: dev.CLEAR_DATA }),
        updateNewTokens: (props) => dispatch({ type: auth.REFRESH_TOKEN, payload: props })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListSurvey)