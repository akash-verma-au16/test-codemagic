import React from 'react';
import { StyleSheet, Dimensions } from 'react-native'
import { Text, Toast, View } from 'native-base';
import Slider from 'react-native-slider'

class RangeScale extends React.Component {
    constructor(props) {
        super(props);
        this.data = {}
        props.data.map((item) => {
            this.data = {
                ...this.data,
                [item.title]: 0
            }
        })
        this.state = {
            questionId: this.props.questionId,
            data: this.data
        }
        this.props.answerHandler(this.state.questionId, this.state.data)
        
        if(props.data.length===1){
            this.isSingleQuestion = true
            console.log('isSingle')
        }else{
            this.isSingleQuestion = false
        }
    }
    optionHandler = (option) => {
        if (this.props.isSubmitLoading) {
            Toast.show({
                text: 'Cannot change the answers while submiting',
                type: 'warning',
                duration: 3000
            })
        }
        else {
            this.setState({ selectedOption: option }, () => {
                this.props.answerHandler(this.state.questionId, this.state.selectedOption)
            })
        }
    }
    scaleComponent = (props) => {
        const title =props.title?props.title:''
        let start=props.start.value
        let end = props.end.value
        let startUnit = ''
        let endUnit= ''
        if(props.unit !=='NA'){
            startUnit=' ' + props.unit
            endUnit = ' ' + props.unit + 's'
        }
        const startText=props.start.text?props.start.text:''
        
        const endText=props.end.text?props.end.text:''
        const index=props.index
        const step =props.step
        const defaultValue=props.default_value
        return (
            <View
                style={styles.option}
                key={index}
            >
                {this.isSingleQuestion?
                    null
                    :
                    <Text
                        style={{
                            marginHorizontal: 15
                        }}
                    >{title}</Text>
                }
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 15
                    }}
                >

                    <Text>
                        {start + startUnit}
                    </Text>
                    
                    <Text>
                        {this.state.data[title]}
                    </Text>
                    
                    <Text>
                        {end + endUnit}
                    </Text>
                </View>
                <Slider
                    style={{
                        marginHorizontal: 15
                    }}
                    minimumValue={start}
                    maximumValue={end}
                    step={step}
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    minimumTrackTintColor='#1c92c4'
                    value={defaultValue}
                    onValueChange={(value) => {
                        this.setState({
                            data: {
                                ...this.state.data,
                                [title]: value
                            }
                        }, () => {
                            this.props.answerHandler(this.state.questionId, this.state.data)
                        })

                    }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 15
                    }}
                >

                    <Text>
                        {startText}
                    </Text>
                    
                    <Text>
                        {endText}
                    </Text>
                </View>
            </View>)
    }
    render() {
        this.scaleComponents = []
        this.props.data.map((item, index) => {
            this.scaleComponents.push(
                this.scaleComponent({ ...item, index })
            )
        })
        return (this.scaleComponents)
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
        marginTop: 15,
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 10,
        width: Dimensions.get('window').width - 30,
        borderColor: '#1c92c4',
        borderWidth: 1,
        backgroundColor: 'white'
    }

})

export default RangeScale;
