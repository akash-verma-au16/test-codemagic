import React from 'react';
import { 
    StyleSheet, 
    KeyboardAvoidingView, 
    ImageBackground 
} from 'react-native';
import {
    Form,
    Container,
    Content,
    Text,
    Icon
} from 'native-base';

/* Redux */
import { connect } from 'react-redux'
import { auth,dev } from '../../store/actions'
/* Custom components */
import Logo from '../../components/Logo'
import Slogan from '../../components/Slogan'
import RoundButton from '../../components/RoundButton'
/* Assets */
import image from '../../assets/image.jpg'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
            isSignInLoading: false
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
            
            headerRight: (
                <Icon name='md-settings' style={
                    {color: 'white',
                        margin:20
                    }
                } onPress={()=>navigation.navigate('settings')} />
            ),
            headerLeft: (
                <React.Fragment/>
            )
        };
    };

    render() {

        return (

            <Container>
               
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
        flexDirection: "column",
        paddingTop: 70
    },
    image: {
        width: '100%',
        height: '100%'
    }
});

const mapStateToProps = (state) => {
    return {
        isAuthenticate: state.isAuthenticate,
        accountAlias: state.user.accountAlias,
        email: state.user.emailAddress,
        isFreshInstall: state.system.isFreshInstall,
        firstName: state.user.firstName
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        clearData: () => dispatch({ type: dev.CLEAR_DATA })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)