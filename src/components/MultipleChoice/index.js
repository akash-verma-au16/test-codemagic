import React from 'react';
import { StyleSheet,TouchableOpacity , Dimensions } from 'react-native'
import {  Text,Toast } from 'native-base';

const Option = (props)=>(
    
    <TouchableOpacity   
        style={
            props.active?
                [styles.option,styles.activeOption]
                :styles.option
        }
        onPress={()=>props.optionHandler(props.data)}
    >
        <Text style={
            props.active?
                [styles.text,styles.activeText]
                :styles.text
        }>
            {props.data.text}
        </Text>
    </TouchableOpacity >
    
)
class MultipleChoice extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            questionId:this.props.questionId,
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
        this.options=[]
        
        this.props.data.map((item,id)=>{
            let status=false
            
            if(this.state.selectedOption.value===item.value)
                status=true

            this.options.push(
                <Option 
                    key={id}
                    data={item}
                    active={status}
                    optionHandler={this.optionHandler}
                />
            )
        })
        return(this.options)
    }
            
}

const styles = StyleSheet.create({

    option: {
        marginTop:15,
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 10,
        width: Dimensions.get('window').width-30 ,
        borderColor: '#47309C',
        borderWidth: 1
        
    },
    activeOption:{
        backgroundColor:'#47309C'
    },
    text:{
        textAlign:'left',
        marginHorizontal:30,
        color:'#47309C'
    },
    activeText:{
        color:'#fff'
    }
})

export default MultipleChoice;
