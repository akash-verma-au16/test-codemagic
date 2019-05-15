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
    }
})