import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList
} from 'react-native';
/* Redux */
import { connect } from 'react-redux'
import { auth,dev } from '../../store/actions'
/* Native Base */
import {
    Container,
    Content,
    Icon,
    H3,
    Toast,
    Thumbnail
} from 'native-base';
/* Services */
import {logout} from '../../services/bAuth'
/* Custom Components */
import LoadingModal from '../LoadingModal'
import thumbnail from '../../assets/thumbnail.jpg'
class ListSurvey extends React.Component {
    constructor(props){
        super(props)
        this.state={
            isLoading:false
        }
    }
    static navigationOptions = ({navigation}) => {
        return {
            
            headerRight: (
                <React.Fragment/>
            ),
            headerLeft: (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}  
                >
                    <Thumbnail
                        source={thumbnail} 
                    
                        style={
                            {
                                height:'70%',
                                borderRadius:50,
                                margin:10
                            }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )
        };
    };
    toast = ()=>{
        Toast.show({
            text: 'Coming Soon!',
            type: 'success',
            duration:3000
        })
    }
    data = [
        {
            key:'Daily Survey',
            icon:'md-stats',
            onPress:()=>this.props.navigation.navigate('SurveyIntro',{
                surveyId:'3',
                surveyName:'Daily-Questionnaire',
                surveyDescription:'Daily Survey',
                surveyNote:'note',
                surveyLevel:'beginner'
            })
        },
        {
            key:'Weekly Survey',
            icon:'md-stats',
            onPress:()=>this.props.navigation.navigate('SurveyIntro',{
                surveyId:'1 ',
                surveyName:'Weekly-Questionnaire',
                surveyDescription:'Weekly Survey',
                surveyNote:'note',
                surveyLevel:'beginner'
            })
        }
    ]

    signOutHandler = () => {
        this.setState({isLoading:true})
        logout({
            accountAlias: this.props.accountAlias,
            email:this.props.email
        }).then(()=>{
            this.props.deAuthenticate()
            this.setState({isLoading:false})
            Toast.show({
                text: 'Signed out Successfully',
                type: "success"
            })
            this.props.navigation.navigate('LoginPage')
            return
        }).catch(()=>{
            Toast.show({
                text: 'Unable to communicate with server',
                type: "danger"
            })
            this.setState({isLoading:false})
        })
    }
    render() {

        return (

            <Container>
                <Content
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    style={{
                        paddingHorizontal: 20
                    }}
                >
                    <FlatList
                        data={this.data}
                        renderItem={
                            ({item}) =>
                                <TouchableOpacity
                                    disabled={item.onPress?false:true}
                                    style={{
                                        flexDirection: 'row',
                                        paddingVertical: 20,
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        borderColor: 'black',
                                        borderBottomWidth: 1
                                    }}
                                    onPress={item.onPress}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name={item.icon} style={styles.icon} />

                                        <H3 style={{
                                            color: 'black',
                                            textAlign: 'center'

                                        }}
                                        >
                                            {item.key}
                                        </H3>
                                    </View>
                                    {item.onPress?
                                        <Icon name='ios-arrow-forward' style={[
                                            styles.icon,
                                            {color:'black'}
                                        ]} />
                                        :null}
                                </TouchableOpacity>
                        }
                    />
                </Content>
                <LoadingModal
                    enabled={this.state.isLoading}
                />
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 20,
        paddingHorizontal: 10,
        color:'#1c92c4'
    }
})
const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        email: state.user.emailAddress

    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        clearData: () => dispatch({ type: dev.CLEAR_DATA })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListSurvey)