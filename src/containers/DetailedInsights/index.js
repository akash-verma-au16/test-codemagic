import React from 'react';
import {
    View,
    Text,
    BackHandler,
    processColor,
    RefreshControl,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import NetInfo from "@react-native-community/netinfo"
import { H3, Icon } from 'native-base'
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
import { weekly_sleep, weekly_energy } from '../../services/mobileDashboard'
import  moment from 'moment'
class DetailedInsights extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            sleepDataLoading: true,
            energyDataLoading: true,
            selectedTab: 0,
            myPulse: [],
            orgPulse: [],
            funQuiz: []
        }
        // set monday as the first day
        moment.updateLocale('en', {
            week: {
                dow: 1 // Monday is the first day of the week
            }
        });

        //setting colors as per bar values
        this.green = '#2ecc71'
        this.orange = '#e67e22'
        this.red = '#e74c3c'
        // Get start date and end date of the current week for initial load
        const startDate = moment().subtract(6,'days').format("YYYY-MM-DD")
        const endDate = moment().format("YYYY-MM-DD")
        //define start dates and end dates for Energy and Sleep payload
        this.sleepStartDate = startDate
        this.energyStartDate = startDate
        this.sleepEndDate = endDate
        this.energyEndDate = endDate
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

    loadWeeklyData = async() => {
        // load weekly data
        await this.weeklySleep()
        await this.weeklyEnergy()
        this.setState({ isLoading: false })
    }

    weeklySleep = async () => {
        if (this.props.isAuthenticate) {
            //Authorization headers
            const headers = {
                headers: {
                    Authorization: this.props.accessToken
                }
            }
            //profile payload

            const payload = {
                tenant_id: this.props.accountAlias,
                associate_id: this.props.associate_id,
                start_date: this.sleepStartDate,
                end_date: this.sleepEndDate
            }

            this.sleepData = await weekly_sleep(payload, headers)
            this.sleepPoints = [] 
            this.sleepBarColors = []
            this.sleepLabels = []

            for(let i=0;i<7;i++){

                //Structure Sleep Data
                const day = moment(this.sleepData.data.data[i].date).format("Do MMM")
                const hrs = this.sleepData.data.data[i].hrs

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

                //Structure week of days
                this.sleepLabels.push(day)

            }
            this.setState({ sleepDataLoading: false })
        }
    }

    weeklyEnergy = async() => {
        if (this.props.isAuthenticate) {
            //Authorization headers
            const headers = {
                headers: {
                    Authorization: this.props.accessToken
                }
            }
            //profile payload

            const payload = {
                tenant_id: this.props.accountAlias,
                associate_id: this.props.associate_id,
                start_date: this.energyStartDate,
                end_date: this.energyEndDate
            }
            this.energyData = await weekly_energy(payload, headers)
            console.log('weekly_energy',this.energyData)
            this.energyPoints = []
            this.energyBarColors = []
            this.energyLabel = []

            for (let i = 0; i < 7; i++) {
                const day = moment(this.energyData.data.data[i].date).format("Do MMM")
                //Structure nergy Data
                const energyPoint = this.energyData.data.data[i].pts

                //Add color for energy bar graph
                let energyBarColor
                if (energyPoint >= 80) {
                    energyBarColor = this.green
                } else if (energyPoint < 80 && energyPoint >= 50) {
                    energyBarColor = this.orange
                } else {
                    energyBarColor = this.red
                }
                this.energyBarColors.push(processColor(energyBarColor))
                this.energyPoints.push({ y: energyPoint })
                //Structure week of days
                this.energyLabel.push(day)

            }
            this.setState({ energyDataLoading: false })
        }
    }

    forwardSleepData = () => {
        this.setState({ sleepDataLoading: true })
        this.sleepStartDate = moment(this.sleepStartDate).add(7, 'd').format('YYYY-MM-DD')
        this.sleepEndDate = moment(this.sleepEndDate).add(7, 'd').format('YYYY-MM-DD')
        this.weeklySleep()
    }

    backwardSleepData = () => {
        this.setState({ sleepDataLoading: true })
        this.sleepStartDate = moment(this.sleepStartDate).subtract(7, 'd').format('YYYY-MM-DD')
        this.sleepEndDate = moment(this.sleepEndDate).subtract(7, 'd').format('YYYY-MM-DD')
        this.weeklySleep()
    }

    forwardEnergyData = () => {
        this.setState({ energyDataLoading: true })
        this.energyStartDate = moment(this.energyStartDate).add(7, 'd').format('YYYY-MM-DD')
        this.energyEndDate = moment(this.energyEndDate).add(7, 'd').format('YYYY-MM-DD')     
        this.weeklyEnergy()
    }

    backwardEnergyData = () =>{
        this.setState({ energyDataLoading: true })
        this.energyStartDate = moment(this.energyStartDate).subtract(7, 'd').format('YYYY-MM-DD')
        this.energyEndDate = moment(this.energyEndDate).subtract(7, 'd').format('YYYY-MM-DD')
        this.weeklyEnergy()
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        this.backHandler.remove();
    }

    handleConnectivityChange = async (isConnected) => {
        if (isConnected) {
            this.loadWeeklyData()
        }
        else {
            this.props.navigation.setParams({ 'isConnected': false })
        }
    }

    render() {
        let sleepRange = moment().isBetween(this.sleepStartDate, this.sleepEndDate)
        let energyRange = moment().isBetween(this.energyStartDate, this.energyEndDate)

        return (

            <Container style={{ backgroundColor: '#eee' }}>
                <Content
                    scrollEnabled={true}
                    refreshing={this.state.isLoading}
                    refreshControl={<RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => {
                            if (this.props.isConnected) {
                                if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                    this.loadWeeklyData()
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
                                    alignItems: 'center',
                                    justifyContent: "center",
                                    margin: 10,
                                    backgroundColor: '#fff',
                                    borderRadius: 5,
                                    shadowOffset: { width: 5, height: 5 },
                                    shadowColor: 'black',
                                    shadowOpacity: 0.5,
                                    elevation: 2
                                }}>
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', margin: 20, marginBottom: 10 }}>
                                    <Icon name='caretleft' type='AntDesign' style={{ color: "#47309C" }} fontSize={25} onPress={this.backwardSleepData} />
                                    <H3>Your Weekly Sleeping hours</H3>
                                    <Icon name='caretright' type='AntDesign' style={sleepRange ? { color: '#bebdbf'} : { color: "#47309C" }} fontSize={25} onPress={this.forwardSleepData} disabled={sleepRange}/>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    { !this.state.sleepDataLoading ? 
                                        <BarChart
                                            style={styles.graphContainer}
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
                                                textSize: 8,
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
                                            visibleRange={{ x: { min: 7, max: 7 } }}
                                            drawBarShadow={false}
                                            drawValueAboveBar={false}
                                            drawHighlightArrow={false}
                                        />
                                        :
                                        <View style={styles.graphContainer}>
                                            <ActivityIndicator size='large' color='#47309C' />
                                        </View>
                                    }
                                </View>
                                <Text style={{width:'100%',textAlign:'center',fontSize:12,color:'black',fontStyle:'italic',marginBottom:10}}>
                                Ideally you should sleep 8 hours every night
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: "center",
                                    margin: 10,
                                    backgroundColor: '#fff',
                                    borderRadius: 5,
                                    shadowOffset: { width: 5, height: 5 },
                                    shadowColor: 'black',
                                    shadowOpacity: 0.5,
                                    elevation: 2
                                }}>
                                <View style={{ width:'100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', margin: 20, marginBottom: 10 }}>
                                    <Icon name='caretleft' type='AntDesign' style={{ color: "#47309C" }} fontSize={25} onPress={this.backwardEnergyData} />
                                    <H3>Your Weekly Energy Score</H3>
                                    <Icon name='caretright' type='AntDesign' style={energyRange ? { color: '#bebdbf' } : { color: "#47309C" }} fontSize={25} onPress={this.forwardEnergyData} disabled={energyRange}/>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    {
                                        !this.state.energyDataLoading ? 
                                            <BarChart
                                                style={styles.graphContainer}
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
                                                    valueFormatter: this.energyLabel,
                                                    textSize: 8,
                                                    granularityEnabled: true,
                                                    granularity: 1
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
                                                visibleRange={{ x: { min: 7, max: 7 } }}
                                                drawBarShadow={false}
                                                drawValueAboveBar={false}
                                                drawHighlightArrow={false}
                                            />
                                            :
                                            <View style={styles.graphContainer}>
                                                <ActivityIndicator size='large' color='#47309C' />
                                            </View>
                                    }
                                    
                                </View>
                            </View>
                        </React.Fragment>
                    }
                </Content>

            </Container>

        );
    }
}

const styles = StyleSheet.create({
    graphContainer: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: 10, height: 200 
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
