import React from 'react';
import { StyleSheet, Dimensions } from 'react-native'
import { Button, Spinner, Text, Item } from 'native-base';

const RoundButton = (props) => (
    <Item last style={styles.item}>
        <Button
            disabled={props.isLoading}
            block
            style={[styles.button, { backgroundColor: props.isLight ?'#1c92c4':'#1c92c4'},props.isDisabled?styles.buttonDisabled:null]}
            onPress={props.onPress}>
            {props.isLoading ?
                <Spinner color={props.isLight ?'#fff':'#fff'} />
                :
                <Text style={[{color: !props.isLight?'#111':'#fff'}, {fontSize: 15, fontWeight: '400'}]}>
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
        paddingVertical: 20,
        borderRadius: 10,
        width: Dimensions.get('window').width - 30,
        height: 60
    },
    buttonDisabled: {
        backgroundColor: '#d3d3d3'
    }
})

export default RoundButton;
