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
class MultiSelectChoice extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            questionId:this.props.questionId,
            selectedOption: []
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
            /* check if the option is already selected */
            let isSelected=false
            this.state.selectedOption.map((item)=>{
                if(item.value===option.value){
                    /* already selected */
                    isSelected=true
                    return
                }else{
                    /* not selected */
                }
            })

            if(isSelected){
                /* delete from array */
                
                let finalArray = this.state.selectedOption.filter((item)=>{
                    if(JSON.stringify(item)!==JSON.stringify(option)){
                        return option
                    }
                })
                this.setState({selectedOption:finalArray})
            }
            else{
                /* add to array */
                this.setState((prevState)=>({selectedOption:[...prevState.selectedOption,option]}),
                    ()=>{
                        this.props.answerHandler(this.state.questionId,this.state.selectedOption)
                    })
            }

        }
    }

    render(){
        this.options=[]
        
        this.props.data.map((item,id)=>{
            let status=false
            
            if(this.state.selectedOption.value===item.value)
                status=true
            
            this.state.selectedOption.map((item2)=>{
                if(item.value===item2.value){
                    /* already selected */
                    status=true
                    return
                }
            })
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
        borderColor: '#9871d5',
        borderWidth: 1
        
    },
    activeOption:{
        backgroundColor:'#9871d5'
    },
    text:{
        textAlign:'left',
        marginHorizontal:30,
        color:'#9871d5'
    },
    activeText:{
        color:'#fff'
    }
})

export default MultiSelectChoice;
