import React from 'react';
import { StyleSheet , Dimensions} from 'react-native'
import {  Text,Toast, View } from 'native-base';
import Slider from 'react-native-slider'

class RatingScale extends React.Component {
    constructor(props) {
        super(props);
        this.startScale = -5
        this.endScale = 5
        this.data={}
        
        props.data.rows.map((item)=>{
            
            this.data={
                ...this.data,
                [item.text]:0
            }
        })
        this.state={
            questionId:this.props.questionId,
            data : this.data
        }
        
        this.props.answerHandler(this.state.questionId,this.state.data)
    
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
        }
    }
    scaleComponent=(text,key) => (
        <View
            style={styles.option}
            key={key}
        >   
            <Text
                style={{
                    marginHorizontal:15
                }}
            >{text}</Text>
        
            <View
                style={{
                    flexDirection:'row',
                    justifyContent:'space-between',
                    marginHorizontal:15
                }}
            >

                <Text>
                    {this.startScale}
                </Text>
                <Text>
                    {this.state.data[text]}
                </Text>
                <Text>
                    {this.endScale}
                </Text>
            </View>
            <Slider
                style={{
                    marginHorizontal:15
                }}
                minimumValue={this.startScale}
                maximumValue={this.endScale}
                step={1}
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                minimumTrackTintColor='#47309C'
                value={0}
                onValueChange={(value) =>{
                    this.setState({data:{
                        ...this.state.data,
                        [text]:value
                    }},()=>{
                        this.props.answerHandler(this.state.questionId,this.state.data)
                    })
                    
                } }
            />
        </View>)
    render(){
        this.scaleComponents=[]
        this.props.data.rows.map((item,index)=>{
            this.scaleComponents.push(
                this.scaleComponent(item.text,index)
            )
        })
        return(this.scaleComponents)
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
        borderColor: '#47309C',
        borderWidth: 2
    },
    option: {
        marginTop:15,
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 10,
        width: Dimensions.get('window').width-30 ,
        borderColor: '#47309C',
        borderWidth: 1,
        backgroundColor:'white'
    }

})

export default RatingScale;
