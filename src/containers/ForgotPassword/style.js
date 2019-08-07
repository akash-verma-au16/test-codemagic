import {StyleSheet} from 'react-native'
export default StyleSheet.create({
    container: {
        flex:1
    },
    form: {
        flex: 1,
        alignItems: "center",
        paddingTop: 50
    },
    image: {
        width: '100%',
        height: '100%'
    },
    imageContainer: {
        height: '50%',
        maxHeight: 100,
        aspectRatio: 1 / 1,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15
    },
    imageWrapper:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    header: {
        fontWeight: "bold",
        margin: 15,
        marginTop: 30,
        fontSize: 20
    },
    text: {
        fontSize: 15,
        textAlign: 'center',
        margin:15,
        marginTop: 0
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#fff'

    },
    customForm: {
        overflow: 'hidden',
        alignItems: "center",
        backgroundColor: '#fff',
        justifyContent: "flex-end",
        width: '100%'
    },
    navigationLink: {
        color: '#47309C',
        marginBottom:15
    },
    icon: {
        fontSize: 50,
        paddingHorizontal: 10,
        color:'#47309C'
    }
})