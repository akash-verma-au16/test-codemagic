import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerText: {
        fontSize: 16,
        fontFamily: 'OpenSans- Regular',
        color: '#111',
        fontWeight: '400',
        marginLeft: 10
    },
    horizontalLine: { 
        width: '100%', 
        flexDirection: 'row', 
        height: 1 / 3, 
        backgroundColor: '#c9cacc', 
        marginTop: 5 
    },
    addCommentView: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderTopWidth: 1/3,
        borderTopColor: '#c9cacc',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    addComment: {
        padding: 5,
        paddingHorizontal: 10, 
        width: '88%',
        fontSize: 14,
        borderRadius: 15,
        backgroundColor: '#efefef'
    },
    iconInactive: {
        color: '#d1d1d1',
        fontSize: 26,
        paddingVertical: 5
    },
    iconActive:{
        color: '#47309C',
        fontSize: 26,
        paddingVertical: 5
    }
})