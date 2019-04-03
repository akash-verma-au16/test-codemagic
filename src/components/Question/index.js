import React from 'react';
import { StyleSheet, View, ScrollView,Text } from 'react-native'
import { H3 } from 'native-base';
import MultipleChoice from '../MultipleChoice'
import RankOrderScale from '../RankOrderScale'
import RatingScale from '../RatingScale'
const Question = (props) => {
    let option = null
    let helperText = null

    switch (props.type) {

    case 'MCQ':
    case 'DSQ':
        helperText = '[choose any option]'
        option = (
            <MultipleChoice
                questionId={props.questionId}
                data={props.options}
                pageSwitchHandler={props.pageSwitchHandler}
                isSubmitLoading={props.isSubmitLoading}
                answerHandler={props.answerHandler}
            />
        )
        break

    case 'SCQ':
        helperText = '[Drag the Slider(s)]'
        option=(
            <RatingScale
                questionId={props.questionId}
                data={props.options}
                pageSwitchHandler={''}
                isSubmitLoading={props.isSubmitLoading}
                answerHandler={props.SCQHandler}
            /> 
        )
        break
    case 'ROS':
        helperText = '[press and hold to drag]'
        option=(
            <RankOrderScale
                questionId={props.questionId}
                data={props.options}
                pageSwitchHandler={''}
                isSubmitLoading={props.isSubmitLoading}
                answerHandler={props.ROSHandler}
            />
        )
        break
    }
    return (
        <React.Fragment>
            <View name='question' style={styles.questionArea}>
                <H3 style={styles.questionText}>
                    {props.question}
                </H3>
                <Text style={[styles.questionText,{margin:10}]}>{helperText}</Text>
            </View>
            <View style={styles.optionArea}>
                <ScrollView style={styles.scrollableView}>
                    {option}
                </ScrollView>
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({

    questionArea: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    questionText: {
        color: 'white',
        
        marginHorizontal: 30,
        textAlign: 'center'
    },
    optionArea: {
        backgroundColor: 'white',
        flex: 2,
        alignItems: 'center'
    },
    scrollableView: {
        marginBottom: 30
    }

})

export default Question;
