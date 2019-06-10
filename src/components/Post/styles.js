import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
        // padding: 10
    },
    card: {
        // marginTop: 10,
        marginBottom: 8,
        backgroundColor: 'white',
        width: '100%',
        // borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#111',
        shadowOpacity: 0.8,
        elevation: 2
    },
    postText: {
        fontFamily: "OpenSans-Regular",
        fontWeight: '400',
        color: '#000',
        fontSize: 15
    },
    associate: {
        color: '#1c92c4',
        fontWeight: 'bold'
    },
    strength: {
        fontWeight: 'bold',
        fontSize: 15
    },
    like: {
        fontSize: 20,
        color: '#1c92c4'
    },
    unlike: {
        fontSize: 20,
        color: '#ccc'
    },
    comment: {
        fontSize: 19,
        color: '#ccc'
    },
    infoTab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        width: "100%"
    },
    infoText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 12
    },
    navBar: { 
        flexDirection: 'row', 
        width: "40%", 
        alignItems: 'center'
    },
    infoNo: {
        fontSize: 13,
        fontFamily: "Roboto-Medium",
        paddingRight: 5
    },
    footerText: {
        fontFamily: "OpenSans-Regular",
        fontSize: 13,
        marginLeft: 11
    },
    footerTextActive: {
        fontFamily: "OpenSans-Regular",
        fontSize: 13,
        marginLeft: 11,
        color: '#1c92c4'
    },
    footerTextInactive: {
        fontFamily: "OpenSans-Regular",
        fontSize: 13,
        marginLeft: 11
    },
    footerConetntView: {
        width: '33.33%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addon: {
        color: '#1c92c4',
        fontSize: 15,
        fontFamily: 'Opensans-Regular',
        fontWeight: '400'
    },
    addOnView: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#1c92c4'
    },
    pointButtonView: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    pointsView: {
        width: '30%',
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#1c92c4',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 7
    },
    points: {
        color: '#1c92c4',
        fontSize: 16
    }

})