import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    Alert
} from 'react-native';

import { Icon } from 'native-base'

//Cusotm component from VisibilityModal
import VisibilityModal from '../../containers/VisibilityModal/index'

//React navigation
import { withNavigation } from 'react-navigation';

//Redux
import { connect } from 'react-redux'

import Moment from 'react-moment'
import moment from 'moment/min/moment-with-locales'

class Comment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false, 
            isEdit: false, 
            editComment: ""
        }
        this.showToast = this.showToast.bind(this)
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

    //Static data for Edit/Delete Comment content
    data = [
        { icon: 'edit', type: 'AntDesign', text: 'Edit Comment', name: 'edit', key: 'edit' },
        { icon: 'delete', type: 'AntDesign', text: 'Delete Comment', name: 'delete', key: 'delete' }
    ]

    otherData = [
        { icon: 'report', type: 'MaterialIcons', text: 'Report Comment', name: 'report', key: 'report' }
    ]

    showToast() {
        ToastAndroid.showWithGravityAndOffset(
            'Coming soon',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            100,
        );
    }

    returnData(data) {
        this.setState({ 
            isEdit: true,
            editComment: data.message 
        })

        console.log("Return Data", data)
        // this.setState({ id: id, name: name });
    }

    render() {
        return (
            <View style={styles.container} key={this.props.key}>
                <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', width: '12%'}}>
                    <View name='image' style={styles.iconWrapper}>
                        <Icon name='person' style={{ fontSize: 22, color: 'white' }} />
                    </View>
                </View>
                <View style={{width: '88%'}}>
                    <View style={[styles.commentWrapper, { width: '100%' }]}>
                        <View style={[styles.footer, { justifyContent: 'space-between', width: '100%' }]}>
                            <Text style={styles.commentor}>{this.props.associate}</Text>
                            <TouchableOpacity 
                                style={{ height: 20, width: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                                underlayColor='#fff' 
                                onPress={() => this.setState({ modalVisible : true})}
                            >
                                <Icon
                                    name='dots-three-horizontal'
                                    type='Entypo'
                                    style={{ fontSize: 11, color: '#333' }}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.comment}>{this.state.isEdit ? this.state.editComment : this.props.message}</Text>
                    </View>
                    <Moment style={{ fontSize: 14, paddingVertical: 3, paddingLeft: 10 }} element={Text} fromNow>{this.props.time * 1000}</Moment>
                </View>
                <VisibilityModal
                    enabled={this.state.modalVisible}
                    data={this.props.associate_id === this.props.id ? this.data : this.otherData}
                    onChangeListener={({ text, name, key }) => {
                        if (key == 'edit') {
                            this.props.navigation.navigate('EditComment',{
                                associate: this.props.associate,
                                comment: this.props.message,
                                time: this.props.time,
                                postId: this.props.post_id, 
                                commentId: this.props.comment_id,
                                returnData: this.returnData.bind(this)
                            })
                        }
                        else if(key == 'delete') {
                            Alert.alert(
                                'Delete Comment?',
                                'Are you sure you want to delete this comment ?',
                                [
                                    {
                                        text: 'No',
                                        style: 'cancel'
                                    },
                                    {
                                        text: 'Yes', onPress: () => { this.props.commentDeletehandle(this.props.comment_id, this.props.message)}
                                    }
                                ],
                                { cancelable: false },
                            )
                        }
                        else {
                            this.showToast()
                        }
                    }}
                    visibilityDisableHandler={() => {
                        this.setState({ modalVisible: false })
                    }}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 10
    },
    iconWrapper: {
        borderRadius: 30,
        backgroundColor: '#1c92c4',
        height: 32,
        aspectRatio: 1 / 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    commentWrapper: {
        flexDirection: 'column',
        alignItems: 'flex-start', 
        justifyContent: 'flex-start',
        backgroundColor: '#efefef',
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 6
    },
    commentor: {
        fontWeight: 'bold',
        fontFamily: 'OpenSans- Regular',
        fontSize: 14,
        textAlign: 'left',
        color: '#111'
    },
    comment: {
        fontFamily: 'OpenSans- Regular',
        fontSize: 15,
        textAlign: 'left',
        // paddingTop: 3,
        paddingRight: 7,
        color: '#333'

    },
    footer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    // like: {
    //     fontFamily: 'OpenSans- Regular',
    //     fontSize: 16,
    //     color: '#1c92c4'
    // },
    // unlike: {
    //     fontFamily: 'OpenSans- Regular',
    //     fontSize: 16,
    //     color: '#ccc'
    // }
})

const mapStateToProps = (state) => {
    return {
        associate_id: state.user.associate_id
    };
}

export default connect(mapStateToProps, null)(withNavigation(Comment))