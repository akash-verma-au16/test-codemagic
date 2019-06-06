import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

class Card extends Component {
    constructor(props) {
        super(props);
    }

    navigationHandler = () => {
        this.props.postNavigationHandeler(this.props.strength)
    }

    render() {
        return(
            <TouchableOpacity style={styles.container} activeOpacity={0.9} key={this.props.key} onPress={this.navigationHandler}>
                <Image
                    source={this.props.image}
                    style={{ height: 75, aspectRatio: 1 / 1, borderRadius: 75, paddingBottom: 5 }}
                />
                <Text style={styles.count}>{this.props.count}</Text>
                <Text style={styles.type}>{this.props.strength}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (Dimensions.get('window').width - 45) / 2,
        height: (Dimensions.get('window').width - 45) / 2,
        marginBottom: 15,
        // marginRight: 10,
        // borderWidth: 1/4,
        borderColor: "#222",
        borderRadius: 3,
        backgroundColor: '#FFF',
        //shadow style
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#444',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3
    },
    count: {
        fontFamily: "Roboto-Medium",
        fontSize: 20,
        fontWeight: '500',
        paddingTop: 7
    },
    type: {
        fontFamily: "OpenSans-Regular",
        fontSize: 13
    }
})

export default Card