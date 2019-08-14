import React, { Component } from 'react';
import { View, Text,processColor,StyleSheet,AsyncStorage } from 'react-native';
import { H2 ,H3} from 'native-base'
import { PieChart } from 'react-native-charts-wrapper';
import {daily} from '../../services/mobileDashboard'
export default class DailyStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdating:false
        };
    }

    componentWillMount(){
        this.restoreState()
        this.syncWithCloud()
    }

    restoreState = async ()=>{
        //Check if old data is present
        let data = await AsyncStorage.getItem('dailyStats')
        
        if(data){
            this.setState({isUpdating:false})
        }
    }

    updateState = () =>{

    }

    syncWithCloud = () =>{
        
        const payload = {
            "tenant_id": this.props.accountAlias,
            "associate_id": this.props.associate_id
        }
        const headers = {
            headers: {
                Authorization: this.props.accessToken
            }
        }

        daily(payload,headers).then((response)=>{
            console.log(response)
        }).catch((error)=>{
            console.log(error.response)
        })
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
    render() {
        if(this.state.isUpdating){
            return(
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
                    <H3 style={{ margin: 20, marginBottom: 10 }}>Updating...</H3>
                </View>
            )
        }
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
                            data={this.pieData.red}
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
                            data={this.pieData.orange}
      
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
        );
    }
}
const styles = StyleSheet.create({
    pieStyle:{
        flex: 1,
        margin: 10

    }
})