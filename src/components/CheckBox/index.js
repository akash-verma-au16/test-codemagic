import React from 'react';
import { StyleSheet } from 'react-native'
import { CheckBox, Body, Text, Item } from 'native-base';

const StyledCheckBox = ({ color, value }) => (
    <Item style={styles.item}>
        <CheckBox
            checked={true}
            style={{
                ...styles.checkBox,
                borderColor: color
            }}
            color='transparent' />
        <Body style={styles.body}>
            <Text style={{color: color}}>{value}</Text>
        </Body>
    </Item>
)
const styles = StyleSheet.create({
    checkBox: {
        marginLeft: 15,
        borderWidth: 1
    },
    body: {
        alignItems: "flex-start",
        paddingLeft: 15
    },
    item: {
        margin: 15,
        borderColor: '#000',
        borderBottomWidth: 0
    }
})

export default StyledCheckBox;
