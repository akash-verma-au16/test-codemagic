import React from 'react';
import { StyleSheet , Dimensions,TouchableOpacity } from 'react-native'
import {  Text,Toast, View } from 'native-base';

import DraggableFlatList from 'react-native-draggable-flatlist'
class RankOrderScale extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            questionId:this.props.questionId,
            value:0,
            selectedOption: {
                value: '',
                text: ''
            },
            data: [...Array(10)].map((d, index) => ({
                key: `index`,
                label: index,
                backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index * 5}, ${132})`
            }))
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
    renderItem = ({ item, index, move, moveEnd, isActive }) => {
        return (
            <TouchableOpacity
                style={{ 
                    height: 100,
                    width: 200, 
                    backgroundColor: isActive ? 'blue' : item.backgroundColor,
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}
                onLongPress={move}
                onPressOut={moveEnd}
            >
                <Text style={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    fontSize: 32
                }}>{item.label}</Text>
            </TouchableOpacity>
        )
    }
    
    render(){
        
        return(
                
            <View style={{ flex: 1 }}>
                <DraggableFlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => `draggable-item-${item.key}`}
                    scrollPercent={5}
                    onMoveEnd={({ data }) => this.setState({ data })}
                />
            </View>
                
        )
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

export default RankOrderScale;
