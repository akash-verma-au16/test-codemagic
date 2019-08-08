import React from 'react';
import {StyleSheet} from 'react-native'
import { Text} from 'native-base';

const Slogan = (props) => (
    <Text style={[styles.text,props.style]}>where positivity multiplies productivity!</Text>
);

const styles = StyleSheet.create({
    text: {
        color: "white", 
        fontSize: 12
    }
})

export default Slogan;
