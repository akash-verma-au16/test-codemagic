import React from 'react';
import { StyleSheet , Dimensions } from 'react-native'
import {  Text,Toast, View } from 'native-base';
import Slider from 'react-native-slider'

class RatingScale extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            questionId:this.props.questionId,
            value:0,
            selectedOption: {
                value: '',
                text: ''
            }
        }
    }
    optionHandler=(option)=>{
        if(this.props.isSubmitLoading){
            Toast.show({
                text: 'Cannot change the answers while submiting',
                type: 'warning',
                duration:3000
            })
        }
        else{
            this.setState({selectedOption:option},()=>{
                this.props.answerHandler(this.state.questionId,this.state.selectedOption)
            })
            /* trigger page switch */
            this.props.pageSwitchHandler()
        }
    }

    render(){
        
        return(
            <View
                style={styles.option}
            >
                <View
                    style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                        marginHorizontal:15
                    }}
                >
                    <Text>
                    0
                    </Text>
                    <Text>
                    10
                    </Text>
                </View>
                <Slider
                    style={{
                        marginHorizontal:10
                    }}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    minimumTrackTintColor='#1c92c4'
                    value={this.state.value}
                    onValueChange={(value) => this.setState({value})}
                />
                <Text>
                    Value : {this.state.value}
                </Text>
            </View>)
    }
            
}

const styles = StyleSheet.create({
    track: {
        height: 4,
        borderRadius: 2
    },
    thumb: {
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        backgroundColor: 'white',
        borderColor: '#1c92c4',
        borderWidth: 2
    },
    option: {
        marginTop:15,
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 10,
        width: Dimensions.get('window').width-30 ,
        borderColor: '#1c92c4',
        borderWidth: 1,
        backgroundColor:'white'
    }

})

export default RatingScale;
