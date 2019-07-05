import React from 'react';
import { StyleSheet } from 'react-native'
import { Text } from 'native-base';

const Title = () => (
    <Text style={styles.text}>HAPPYWORKS</Text>
);

const styles = StyleSheet.create({
    text: {
        fontSize: 44,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff",
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: {
            width: 0,
            height: 1.7
        },
        textShadowRadius: 0.3
    }
})

export default Title;
