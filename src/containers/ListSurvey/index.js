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
    processColor
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"
import { H2} from 'native-base'
/* Redux */
import { connect } from 'react-redux'
import { auth, dev } from '../../store/actions'
import { PieChart } from 'react-native-charts-wrapper';
import { NavigationEvents } from 'react-navigation';
/* Native Base */
import {
    Container,
    Content,
    Toast,
    Thumbnail
} from 'native-base';
//Prefetch Profile Data
import { loadProfile } from '../Home/apicalls'
/* Assets */
import nature1 from '../../assets/tileBackgrounds/nature1.jpg'
import nature2 from '../../assets/tileBackgrounds/nature2.jpg'
import nature3 from '../../assets/tileBackgrounds/nature3.jpeg'
import { list_survey } from '../../services/questionBank'

//RBAC handler function
import { checkIfSessionExpired } from '../RBAC/RBAC_Handler'
/* Custom Components */
import { IndicatorViewPager } from 'rn-viewpager';

class ListSurvey extends React.Component {
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
    }

    handleConnectivityChange = async (isConnected) => {
        if (isConnected) {
            this.loadSurveys()
            await this.getProfile()
        }
        else {
            this.props.navigation.setParams({ 'isConnected': false })
        }
    }

    loadSurveys = () => {
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
                response.data.data.tenant_specific.map((item, index) => {
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

    static navigationOptions = ({ navigation }) => {
        return {

            headerRight: (
                <React.Fragment />
            ),
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        if (navigation.getParam('isConnected')) {
                            const profileObj = navigation.getParam('profileData')
                            navigation.navigate('Profile', {
                                profileData: profileObj,
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
    sleepPieData = {
        green: {
            dataSets: [{
                values: [{value: 100,label:''}
                ],
                label: '',
                config: {
                    colors: [processColor('#2ecc71')],
                    sliceSpace: 5,
                    labelTextSize: 18,
                    valueTextSize:0,
                    valueTextColor: processColor('white'),
                    selectionShift: 13,
                    valueFormatter: "",
                    valueLineColor: processColor('white'),
                    valueLinePart1Length: 0.5
                
                }
            }]
        
        },
        orange:{
            dataSets: [{
                values: [{value: 80,label:''},
                    {value: 20,label:''}
                ],
                label: '',
                config: {
                    colors: [processColor('#e67e22'), processColor('#eee')],
                    sliceSpace: 5,
                    labelTextSize: 18,
                    valueTextSize:0,
                    valueTextColor: processColor('white'),
                    selectionShift: 13,
                    valueFormatter: "",
                    valueLineColor: processColor('white'),
                    valueLinePart1Length: 0.5
                
                }
            }]
        
        },
        red:{
            dataSets: [{
                values: [{value: 40,label:''},
                    {value: 60,label:''}
                ],
                label: '',
                config: {
                    colors: [processColor('#e74c3c'), processColor('#eee')],
                    sliceSpace: 5,
                    labelTextSize: 18,
                    valueTextSize:0,
                    valueTextColor: processColor('white'),
                    selectionShift: 13,
                    valueFormatter: "",
                    valueLineColor: processColor('white'),
                    valueLinePart1Length: 0.5
                
                }
            }]
        
        }

    }

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
                    elevation: 2,
                    alignItems:'center'
                }}>
                    <H2 style={{ margin: 20, marginBottom: 10 }}>Your Daily Stats</H2>
                    <View style={{flexDirection:'row',flex:1}}>
                        <View style={{flex:1}}>
                            <PieChart
                                style={styles.pieStyle}
                                chartDescription={{
                                    text: '',
                                    textSize: 0
                                }}
                                transparentCircleRadius={55}
                                transparentCircleColor={processColor('#f0f0f088')}
                                legend={{enabled: false}}
                                data={this.sleepPieData.red}
                                rotationEnabled={true}
                                styledCenterText={{ text: '2 hrs', color: processColor('#47309C'), size: 18 }}
                                centerTextRadiusPercent={100}
                                holeRadius={50}

                            />
                            <Text style={{width:'100%',textAlign:'center',fontSize:18,color:'black'}}>Sleep Cycle</Text>
                        </View>
                        <View style={{flex:1}}>
                            <PieChart
                                style={styles.pieStyle}
                                chartDescription={{
                                    text: '',
                                    textSize: 0
                    
                                }}
                                transparentCircleRadius={55}
                                transparentCircleColor={processColor('#f0f0f088')}
                                legend={{
                                    enabled: false
                                }}
                                data={this.sleepPieData.orange}
              
                                rotationEnabled={true}
                                styledCenterText={{ text: '100', color: processColor('black'), size: 18 }}
                                centerTextRadiusPercent={100}
                                holeRadius={50}

                                onSelect={null}
                            />
                            <Text style={{width:'100%',textAlign:'center',fontSize:18,color:'black'}}>Energy Score</Text>
                        </View>
                    </View>
                    <Text onPress={()=>{
                        this.props.navigation.navigate('DetailedInsights')
                    }} style={{ margin: 20, marginBottom: 10 ,color:'#47309C'}}>Preview Analytics</Text>
                </View>
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
                            <TouchableOpacity onPress={() => this.pager.setPage(2)}>
                                <Text style={this.state.selectedTab === 2 ? styles.tabActive : styles.tabInactive}>
                                    Fun Quiz
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
                                    {this.state.funQuiz}
                                </ScrollView>
                            </View>
                        </IndicatorViewPager>

                    </View>
                    <NavigationEvents
                        onWillFocus={async () => {
                            if (this.props.isConnected) {
                                if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                    this.props.navigation.setParams({ 'imageUrl': this.props.imageUrl })
                                    this.loadSurveys()
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
const styles = StyleSheet.create({
    pieStyle:{
        flex: 1,
        margin: 10

    },
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