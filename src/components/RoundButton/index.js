import React from 'react';
import { StyleSheet, Dimensions } from 'react-native'
import { Button, Spinner, Text, Item } from 'native-base';

const RoundButton = (props) => (
    <Item last style={styles.item}>
        <Button
            disabled={props.isLoading || props.isDisabled}
            block
            style={props.isDisabled ?
                { ...styles.button, ...styles.buttonDisabled }
                :styles.button}
            onPress={props.onPress}>
            {props.isLoading ?
                <Spinner color='white' />
                :
                <Text>
                    {props.value}
                </Text>
            }
        </Button>
    </Item>
)

const styles = StyleSheet.create({

    item: {
        margin: 15,
        marginTop: 0,
        borderColor: '#000',
        borderBottomWidth: 0,
        flexDirection: "row",
        justifyContent: "center"
    },
    button: {
        justifyContent: "center",
        backgroundColor: '#1c92c4',
        paddingVertical: 20,
        borderRadius: 10,
        width: Dimensions.get('window').width - 30,
        height: 60
    },
    buttonDisabled: {
        backgroundColor: '#adadad'
    }
})

export default RoundButton;
