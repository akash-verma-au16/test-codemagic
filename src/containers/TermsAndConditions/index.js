import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    BackHandler,
    NetInfo,
    ToastAndroid,
    WebView
} from 'react-native';
import {
    Form,
    Container,
    Content,
    H3,
    View,
    Toast
} from 'native-base';
/* Redux */
import { connect } from 'react-redux'
import { system } from '../../store/actions'
/* Custom components */
import Logo from '../../components/Logo'
import Slogan from '../../components/Slogan'
import RoundButton from '../../components/RoundButton'
/* Assets */
import image from '../../assets/rsz_gradient-background.png'

import {TermsOfUse} from '../../../config'
class TermsAndConditions extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isButtonEnabled: false
        }
        this.webViewref = React.createRef()
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });
        //Detecting network connectivity change
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = (isConnected) => {
        if (isConnected) {
            this.webViewref.reload()
        }
    }

    componentWillUnmount() {
        //Removing Event Handlers
        this.backHandler.remove();
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    buttonHandler = () => {
        if (this.state.isButtonEnabled) {
            this.props.acceptTermsAndConditions()
            this.props.navigation.navigate('LoginPage')
        } else {
            Toast.show({
                text: 'Please read the complete document',
                type: 'danger',
                duration: 1000
            })
        }

    }
    handleOnload = () => {
        if (!this.props.isConnected) {
            ToastAndroid.showWithGravityAndOffset(
                'Please, connect to the internet',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                100,
            );
        }
    }
    // Inject JS code string into WebView
    injectedJs = `
    window.addEventListener('scroll', function(e){
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1) {
            window.postMessage("");
          return
        }
    })
`;

    render() {
        const Header = 'Terms of Use'
        return (

            <Container>
                <Content
                    contentContainerStyle={styles.container}
                >
                    <ImageBackground
                        source={image}
                        style={styles.image}
                    >

                        <Form style={styles.form}>

                            <React.Fragment>
                                <Logo />
                                <Slogan />
                            </React.Fragment>
                            <H3 style={styles.h2}>{Header.toUpperCase()}</H3>
                            <View style={styles.scrollContainer}>
                                <WebView
                                    source={{ uri: TermsOfUse}}
                                    ref={(r) => this.webViewref = r}
                                    javaScriptEnabled={true}
                                    injectedJavaScript={this.injectedJs}
                                    onMessage={() => {
                                        if (!this.state.isButtonEnabled) {
                                            this.setState({ isButtonEnabled: true })
                                        }
                                    }}
                                    onLoad={this.handleOnload}
                                />
                            </View>
                            <RoundButton
                                onPress={this.buttonHandler}
                                value='Accept Terms of Use'
                                isDisabled={!this.state.isButtonEnabled}
                                isLight={true}
                            />

                        </Form>

                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    form: {
        flex: 1,
        alignItems: "center",
        paddingTop: 70
    },
    image: {
        width: '100%',
        height: '100%'
    },
    h2: {
        margin: 15,
        textAlign: "center",
        color: 'white',
        fontWeight: "bold"
    },
    scrollContainer: {
        flex: 1,
        width: "100%",
        marginBottom: 15,
        overflow: 'hidden'
    }

});

const mapStateToProps = (state) => {
    return {
        isConnected: state.system.isConnected
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        acceptTermsAndConditions: () => dispatch({ type: system.AGREE_POLICY })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndConditions)