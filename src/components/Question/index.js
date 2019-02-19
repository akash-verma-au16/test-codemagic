import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native'
import { H3 } from 'native-base';
import MultipleChoice from '../MultipleChoice'

const Question = (props) => (
    <React.Fragment>
        <View name='question' style={styles.questionArea}>
            <H3 style={styles.questionText}>
                {props.question}
            </H3>

        </View>
        <View style={styles.optionArea}>
            <ScrollView style={styles.scrollableView}>
                <MultipleChoice
                    questionId={props.questionId}
                    data={props.options}
                    selectedOption={null}
                    pageSwitchHandler={props.pageSwitchHandler}
                    isSubmitLoading={props.isSubmitLoading}
                    answerHandler={props.answerHandler}
                />
            </ScrollView>
        </View>
    </React.Fragment>
)

const styles = StyleSheet.create({

    questionArea: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    questionText: {
        color: 'white',
        fontWeight: 'bold',
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
