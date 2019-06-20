import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet} from 'react-native'
//Native base 
import { Icon } from 'native-base'

//Moment.js
import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'
import AsyncStorage from '@react-native-community/async-storage';

export default class Like extends Component {
    constructor(props) {
        super(props)
        this.state ={
            associateName: ""
        }

        //formatting update locale
        Moment.globalMoment = moment;
        moment.updateLocale('en', {
            relativeTime: {
                past: function (input) {
                    return input === 'just now'
                        ? input
                        : input + ' ago'
                },
                s: 'just now',
                future: "in %s",
                ss: '%ds',
                m: "%dm",
                mm: "%dm",
                h: "%dh",
                hh: "%dh",
                d: "%dd",
                dd: "%dd",
                M: "%dm",
                MM: "%dm",
                y: "%dy",
                yy: "%dy"
            }
        });
    }

    componentWillMount() {
        this.getName()
    }

    getName = async () => {
        try {
            let name = await AsyncStorage.getItem(this.props.associateId)
            this.setState({ associateName: name })
        }
        catch {
            //Error retriving data
        }
    }

    render() {
        return(
            <View style={styles.tileContainer}>
                <View style={styles.tileView}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '20%' }}>
                        <View style={styles.iconView}>
                            <Icon name='person' style={{ fontSize: 26, color: 'white' }} />
                        </View>
                    </View>
                    <View style={styles.textViewWrapper}>
                        <Text style={styles.name}>{this.state.associateName}</Text>
                        <Moment style={{ fontSize: 14, paddingVertical: 3 }} element={Text} fromNow>{this.props.time * 1000}</Moment>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', height: 1 / 3, backgroundColor: '#c9cacc', marginTop: 5 }}></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tileContainer: {
        width: Dimensions.get('window').width
    },
    tileView: {
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconView: {
        flexDirection: 'column',
        borderRadius: 50,
        backgroundColor: '#1c92c4',
        height: 50,
        aspectRatio: 1 / 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    textViewWrapper: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: '80%',
        padding: 10,
        paddingHorizontal: 10,
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    name: {
        textAlign: 'left',
        fontFamily: "OpenSans-Regular",
        fontSize: 17,
        fontWeight: 'bold',
        color: '#111'
    }
})
