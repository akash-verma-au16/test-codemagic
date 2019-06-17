import { StyleSheet, Dimensions } from 'react-native'

export const styles = StyleSheet.create({
    coloredText: {
        fontSize: 14,
        color: '#1c92c4',
        fontFamily: "OpenSans-Regular",
        flexWrap: 'wrap'
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: "OpenSans-Regular",
        color: '#333'
    },
    companyName: {
        color: '#1c92c4',
        fontSize: 15,
        fontWeight: 'bold',
        flexWrap: 'wrap',
        // fontStyle: 'italic',
        fontFamily: "OpenSans-Regular"
    },
    mobilNo: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium'
    },
    text: {
        fontSize: 13,
        fontFamily: "OpenSans-Regular",
        paddingBottom: 5
    },
    iconTouch: {
        alignItems: 'center',
        justifyContent: 'center',
        // height: 32,
        width: '33%',
        paddingHorizontal: 10
        // borderRadius: 32,
        // backgroundColor: "blue"
    },
    textLeft: {
        width: "100%"
    },
    helperText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15
    },
    textActive: {
        color: '#1c92c4',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 22,
        width: "100%"
        // marginTop: 5
    },
    textInactive: {
        textAlign: 'center'
    },
    iconActive: {
        fontSize: 26,
        color: '#1c92c4'
    },
    iconInactive: {
        fontSize: 25,
        color: '#8a8b8c'
    },
    tabHeader: {
        borderTopWidth: 1 / 5,
        borderBottomWidth: 1 / 5,
        flexDirection: 'row',
        // margin: 10,
        marginTop: 5,
        marginBottom: 0,
        padding: 3,
        height: 34,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    viewPager: {
        flex: 1,
        width: '100%'
        // padding: 5
    },
    transactionContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10, 
        paddingVertical: 13
    },
    iconView: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    transactionView: {
        width: '80%',
        paddingLeft: 10,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    textView: {
        width: "80%",
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    debit: {
        color: 'red',
        fontSize: 17,
        fontWeight: 'bold',
        fontFamily: "OpenSans-Regular"
    },
    credit: {
        color: 'green',
        fontSize: 17,
        fontWeight: 'bold',
        fontFamily: "OpenSans-Regular"
    },
    surveryText: {
        fontFamily: "OpenSans-Regular",
        fontSize: 15
    },
    tText: {
        paddingBottom: 10,
        fontFamily: "OpenSans-Regular",
        fontSize: 14
    },
    pointsView: {
        height: 30,
        width: "20%",
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    fromTo: {
        color: '#333',
        fontSize: 12,
        marginTop: 7,
        textAlign: 'left',
        fontFamily: "OpenSans-Regular"
    },
    timeStampS: {
        color: '#aaa',
        fontSize: 12,
        textAlign: 'left',
        fontFamily: "OpenSans-Regular"
    },
    timeStamp: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 7,
        textAlign: 'left',
        fontFamily: "OpenSans-Regular"
    },
    // Edit profile button style classes
    editText: {
        color: '#FFF',
        fontFamily: "OpenSans-Regular",
        fontSize: 14
    },
    editBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1c92c4',
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 15,
        // backgroundColor: '#efefef'
    },
    modalCaontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width
    },
    headerContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        backgroundColor: '#fff',
        // height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0,
        shadowOffset: { width: 5, height: 0 },
        shadowColor: '#666',
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2
    },
    headerText: {
        textAlign: 'left',
        fontSize: 19,
        fontFamily: "OpenSans-Regular",
        fontWeight: '300'
    },
    fieldText: {
        textAlign: 'left',
        paddingBottom: 0,
        fontSize: 16,
        color: '#444',
        fontFamily: 'OpenSans-Regular'
    },
    textInputWraper: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: "100%",
        paddingVertical: 5
    },
    textInput: {
        width: "100%",
        // padding: 0,
        paddingBottom: 15,
        height: 45,
        fontSize: 15
    },
    profilePic: {
        height: 130,
        aspectRatio: 1 / 1,
        borderRadius: 130
    },
    t_time: {
        marginTop: 7,
        color: '#777',
        fontSize: 13, 
        fontFamily: 'Opensans-Regular'
    },
    tbWrapper: {
        height: 95,
        width: 95,
        borderRadius: 95,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: '#FFF',
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#333',
        shadowRadius: 2,
        shadowOpacity: 0.4,
        elevation: 5,
        marginBottom: 15
    },
    imageWrapper: {
        height: 137,
        width: 137,
        borderRadius: 137,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 7,
        borderColor: '#FFF',
        shadowOffset: { width: 7, height: 7 },
        shadowColor: '#333',
        shadowRadius: 2,
        shadowOpacity: 0.4,
        elevation: 5
    },
    changePicText: {
        fontSize: 18,
        fontFamily: 'OpenSans-Regular',
        fontWeight: "400",
        color: '#1c92c4',
        textAlign: 'center',
        padding: 20
    }
});