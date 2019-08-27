import React from 'react';
import {
    View,
    Text,
    BackHandler,
    processColor,
    RefreshControl
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"
import { H2 } from 'native-base'
/* Redux */
import { connect } from 'react-redux'
import { auth, dev } from '../../store/actions'
import { BarChart } from 'react-native-charts-wrapper';

/* Native Base */
import {
    Container,
    Content
} from 'native-base';

//RBAC handler function
import {weekly_data} from '../../services/mobileDashboard'
import  moment from 'moment'
class DetailedInsights extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            selectedTab: 0,
            myPulse: [],
            orgPulse: [],
            funQuiz: []
        }
        this.green = '#2ecc71'
        this.orange = '#e67e22'
        this.red = '#e74c3c'
        
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
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange)
    }

    weekly_data = async () => {
        if (this.props.isAuthenticate) {
            //Authorization headers
            const headers = {
                headers: {
                    Authorization: this.props.accessToken
                }
            }
            //profile payload
            let today = moment().format('ddd')
            const payload = {
                tenant_id: this.props.accountAlias,
                associate_id: this.props.associate_id,
                day:'Mon'
            }
            this.surveyData = await weekly_data(payload, headers, this.props.isConnected)
            this.sleepPoints = [] 
            this.sleepBarColors = []
            this.sleepLabels = []
            this.energyPoints = []
            this.energyBarColors = []

            for(let i=0;i<7;i++){

                //Structure Sleep Data
                const day = this.surveyData.data.data.sleep[i].day
                const hrs = this.surveyData.data.data.sleep[i].hrs
                const energyPoint = this.surveyData.data.data.energy[i].hrs
                //Add color for sleep bar graph
                let sleepBarColor
                if(hrs>=8){
                    sleepBarColor = this.green
                }else if(hrs<8 && hrs>=5){
                    sleepBarColor = this.orange
                }else{
                    sleepBarColor = this.red
                }
                this.sleepBarColors.push(processColor(sleepBarColor))
                this.sleepPoints.push({ y: hrs })
                
                //Add color for energy bar graph
                let energyBarColor
                if(energyPoint>=80){
                    energyBarColor = this.green
                }else if(energyPoint<80 && energyPoint>=50){
                    energyBarColor = this.orange
                }else{
                    energyBarColor = this.red
                }
                this.energyBarColors.push(processColor(energyBarColor))
                this.energyPoints.push({y: energyPoint})

                //Structure week of days
                this.sleepLabels.push(day)

            }
            this.setState({isLoading:false})
            this.props.navigation.setParams({
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
            await this.weekly_data()
        }
        else {
            this.props.navigation.setParams({ 'isConnected': false })
        }
    }

    render() {
        return (

            <Container style={{ backgroundColor: '#eee' }}>
                <Content
                    contentContainerStyle={{}}
                    scrollEnabled={true}
                    refreshing={this.state.isLoading}
                    refreshControl={<RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => {
                            if (this.props.isConnected) {
                                if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                    this.weekly_data()
                                }
                            }
                            
                        }}
                    />}
                >
                    {this.state.isLoading?null:
                        <React.Fragment>
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
                                                values: this.sleepPoints,
                                                label: 'Sleep in Hours',
                                                config: {
                                                    colors: this.sleepBarColors,
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
                                            valueFormatter: this.sleepLabels,
                                            granularityEnabled: true,
                                            granularity : 1
                                        }}
                                        yAxis={{
                                            left: {
                                                axisMaximum: 10,
                                                axisMinimum:0 
                                            },
                                            right:{
                                                axisMaximum: 10,
                                                axisMinimum: 0
                                            }
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
                                                values: this.energyPoints,
                                                label: 'Energy Score',
                                                config: {
                                                    colors: this.energyBarColors,
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
                                            valueFormatter: this.sleepLabels,
                                            granularityEnabled: true,
                                            granularity : 1
                                        }}
                                        yAxis={{
                                            left: {
                                                axisMaximum: 100,
                                                axisMinimum: 0
                                            },
                                            right: {
                                                axisMaximum: 100,
                                                axisMinimum: 0
                                            }
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
                        </React.Fragment>
                    }
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