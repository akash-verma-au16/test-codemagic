import React, { Component } from 'react';
import { View, Text,processColor,StyleSheet } from 'react-native';
import { H2 } from 'native-base'
import { PieChart } from 'react-native-charts-wrapper'
export default class DailyStats extends Component {
    constructor(props){
        super(props)
        this.green = '#2ecc71'
        this.orange = '#e67e22'
        this.red = '#e74c3c'
    }
    pieData = {
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
    renderSleepCycle=()=>{
        const sleepHrs = this.props.dailyStatsPayload.sleepHrs
        this.activePortion = sleepHrs * 10
        this.inactivePortion = 100 - this.activePortion
        //Circle Middle Label
        if(sleepHrs>1)
            this.sleepLabel = sleepHrs + ' hrs'
        else
            this.sleepLabel = sleepHrs + ' hr'

        //Remove zero hrs
        if(sleepHrs===0)
            this.sleepLabel=''

        //Circle Color
        if(sleepHrs>=8){
            this.activePortionColor = this.green
        }else if(sleepHrs<8 && sleepHrs>=5){
            this.activePortionColor = this.orange
        }else{
            this.activePortionColor = this.red
        }
    }
    renderEnergyCycle=()=>{
        const energyPts = this.props.dailyStatsPayload.energyPts
        this.activeEnergyPortion = energyPts
        this.inactiveEnergyPortion = 100 - this.activeEnergyPortion
        //Circle Middle Label
        if(energyPts>1)
            this.energyLabel = energyPts + ' pts'
        else
            this.energyLabel = energyPts + ' pt'

        //Remove zero hrs
        if(energyPts===0)
            this.energyLabel=''

        //Circle Color
        if(energyPts>=80){
            this.activeEnergyPortionColor = this.green
        }else if(energyPts<80 && energyPts>=50){
            this.activeEnergyPortionColor = this.orange
        }else{
            this.activeEnergyPortionColor = this.red
        }
    }
    render() {
        this.renderEnergyCycle()
        this.renderSleepCycle()
        return (
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
                            data={{
                                dataSets: [{
                                    values: [{value: this.activePortion,label:''},
                                        {value: this.inactivePortion,label:''}
                                    ],
                                    label: '',
                                    config: {
                                        colors: [processColor(this.activePortionColor), processColor('#eee')],
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
                            
                            }}
                            rotationEnabled={true}
                            styledCenterText={{ text: this.sleepLabel, color: processColor('#47309C'), size: 18 }}
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
                            data={{
                                dataSets: [{
                                    values: [{value: this.activeEnergyPortion,label:''},
                                        {value: this.inactiveEnergyPortion,label:''}
                                    ],
                                    label: '',
                                    config: {
                                        colors: [processColor(this.activeEnergyPortionColor), processColor('#eee')],
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
                            
                            }}
      
                            rotationEnabled={true}
                            styledCenterText={{ text: this.energyLabel, color: processColor('#47309C'), size: 18 }}
                            centerTextRadiusPercent={100}
                            holeRadius={50}

                            onSelect={null}
                        />
                        <Text style={{width:'100%',textAlign:'center',fontSize:18,color:'black'}}>Energy Cycle</Text>
                    </View>
                </View>
                <Text onPress={()=>{
                    this.props.navigation.navigate('DetailedInsights')
                }} style={{ margin: 20, marginBottom: 10 ,color:'#47309C'}}>Preview Analytics</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    pieStyle:{
        flex: 1,
        margin: 10

    }
})