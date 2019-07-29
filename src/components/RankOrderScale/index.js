import React from 'react';
import { StyleSheet , Dimensions,TouchableOpacity } from 'react-native'
import {  Text,Toast, View } from 'native-base';

import DraggableFlatList from 'react-native-draggable-flatlist'
class RankOrderScale extends React.Component {
    constructor(props) {
        super(props);
        
        this.data=[]
        props.data.map((item,index)=>{
            this.data.push({
                key:index,
                label:item.text
            })
        })
   
        this.state={
            questionId:this.props.questionId,
            value:0,
            selectedOption: {
                value: '',
                text: ''
            },
            data: this.data
        }
        this.props.answerHandler(this.state.questionId,this.data)
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
    renderItem = ({ item, index, move, moveEnd, isActive }) => {
        return (
            <TouchableOpacity
                key={index}
                style={[
                    styles.option,
                    {backgroundColor: isActive ? '#9871d5' : '#fff'}
                ]}
                onLongPress={move}
                onPressOut={moveEnd}
                
            >
                <Text
                    style={[
                        styles.text,
                        {color:isActive ? '#fff' : '#9871d5'}
                    ]}
                >{item.label}</Text>
            </TouchableOpacity>
        )
    }
    
    render(){
        
        return(
                
            <View style={{ flex: 1 }}>
                <DraggableFlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    scrollPercent={5}
                    onMoveEnd={({ data }) => {
                        this.setState({ data },()=>{
                            this.props.answerHandler(this.state.questionId,data)
                        })
                        
                    }}
                />
            </View>
                
        )
    }
            
}

const styles = StyleSheet.create({
    text:{
        textAlign:'left',
        marginHorizontal:30,
        color:'#9871d5'
    },
    option: {
        marginTop:15,
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 10,
        width: Dimensions.get('window').width-30 ,
        borderColor: '#9871d5',
        borderWidth: 1
    }

})

export default RankOrderScale;
