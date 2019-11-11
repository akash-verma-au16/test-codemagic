import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    ImageBackground,
    Image,
    Dimensions,
    Linking,
    TouchableOpacity,
    BackHandler
} from 'react-native';

//Assets
import image from '../../assets/rsz_gradient-background.png'
import logo from '../../assets/logo-original.png'

class Welcome extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    render() {
        return (
            <ImageBackground source={image} style={{ width: '100%', height: '100%' }}>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    scrollEnabled={false}
                    style={styles.scrollView}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 20, height: Dimensions.get('window').height }}>
                        <Image source={logo} style={{ width: '85%', height: 200, resizeMode: 'contain', marginTop: 30 }} />
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                            <Text style={styles.aboutAppText}>Healthy Minds... Healthy Returns...</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 36, width: '100%' }}>
                            <TouchableOpacity onPress={() => Linking.openURL('http://happyworks.io/')} activeOpacity={0.8}>
                                <Text style={styles.knowMore}>KNOW MORE ABOUT HAPPYWORKS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => Linking.openURL('https://portal.happyworks.io/#/pages/signup-page')}>
                                <Text style={styles.signUp}>SIGN UP</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginPage')}>
                                <Text style={styles.backText}>Back to Login Page</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: 'transparent',
        height: Dimensions.get('window').height
    },
    aboutAppText: {
        fontWeight: '900',
        fontSize: 32,
        textAlign: 'center',
        color: '#FFF'
    },
    backText:{
        textAlign: 'center',
        color: '#FFF'
    },
    knowMore: {
        fontWeight: '900',
        fontSize: 16,
        textAlign: 'center',
        color: '#FFF',
        textDecorationLine: 'underline'
    },
    signUp: {
        color: '#47309C',
        fontWeight: 'bold',
        fontSize: 21
    },
    button: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 7,
        marginTop: 15,
        marginBottom: 15
    }
});

export default Welcome
