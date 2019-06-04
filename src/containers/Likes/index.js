import React from 'react';
import {
    View,
    Text,
    BackHandler,
    RefreshControl,
    ToastAndroid,
    ScrollView,
    StyleSheet,
    Dimensions
} from 'react-native';

//Native base 
import { Icon } from 'native-base'

//Custom Data
import { data } from './data'

//Moment.js
import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'

//redux
import { connect } from 'react-redux'

class Likes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            peopleListrefresh: false
        }
        this.peopleList = []
        this.loadPeople = this.loadPeople.bind(this)

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
        this.loadPeople()
    }

    componentDidMount() {
        // Hardware backpress handle
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });
    }

    async goBack() {
        await this.props.navigation.goBack()
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    showToast() {
        ToastAndroid.showWithGravityAndOffset(
            'Please, Connect to the internet',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            100,
        );
    }

    loadPeople = () => {
        this.peopleList = []
        this.setState({ peopleListrefresh: true})
        data.map((item, index) => {
            this.peopleList.push(
                <View style={styles.tileContainer} key={index}>
                    <View style={styles.tileView}>
                        <View style={{alignItems: 'center', justifyContent: 'center', width: '20%'}}>
                            <View style={styles.iconView}>
                                <Icon name='person' style={{ fontSize: 26, color: 'white' }} />
                            </View>
                        </View>
                        <View style={styles.textViewWrapper}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Moment style={{ fontSize: 14, paddingVertical: 3 }} element={Text} fromNow>{item.time * 1000}</Moment>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 1/3, backgroundColor: '#c9cacc', marginTop: 5 }}></View>
                </View>
            )
        })
        this.setState({ peopleListrefresh: false })
    }

    render() {
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 5 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.peopleListrefresh}
                            onRefresh={() => {
                                if (this.props.isConnected) {
                                    if (!this.props.isFreshInstall && this.props.isAuthenticate) {
                                        this.loadPeople()
                                    }
                                }
                                else {
                                    this.showToast()
                                }
                            }}
                        />
                    }>
                    {this.peopleList}
                </ScrollView>
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
        aspectRatio: 1/1,
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

const mapStateToProps = (state) => {
    return {
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall,
        isConnected: state.system.isConnected

    };
}

export default connect(mapStateToProps, null)(Likes)