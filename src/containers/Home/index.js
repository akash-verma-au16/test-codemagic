import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image
} from 'react-native';
import {

    Container,
    Content,
    Text,
    Icon,
    H3,
    H2

} from 'native-base';

/* Redux */
import { connect } from 'react-redux'

/* Assets */
import image from '../../assets/profileImage.png'

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
                    {
                        color: 'white',
                        margin: 20
                    }
                } onPress={() => navigation.navigate('settings')} />
            )
        };
    };

    render() {

        return (

            <Container>
                <Content style={{flex:1}} contentContainerStyle={{alignItems:'center'}} scrollEnabled={true}>
                    
                    <Image 
                        style={{ borderRadius: Dimensions.get('window').width/2, width:100,height:100, aspectRatio:1/1 , margin:10}}
                        source={image}
                        resizeMode='stretch'
                    />

                    <H2>{this.props.firstName + ' ' + this.props.lastName}</H2>

                    <Text style={styles.coloredText}>{this.props.email}</Text>
                    <View style={{ borderColor: 'black', borderTopWidth: 1, borderBottomWidth: 1, flexDirection: 'row',margin:10,width:'90%',alignItems: 'center',justifyContent: 'space-between'}}>

                        <View style={styles.detailsTile}>
                            <H3>9</H3>
                            <Text style={styles.coloredText} >Thanks</Text>
                        </View>
                        
                        <View style={{backgroundColor:'black',width:1,height:'50%'}}/>

                        <View style={styles.detailsTile}>
                            <H3>100</H3>
                            <Text style={styles.coloredText} >Points</Text>
                        </View>

                        <View style={{backgroundColor:'black',width:1,height:'50%'}}/>

                        <View style={styles.detailsTile}>
                            <H3>5</H3>
                            <Text style={styles.coloredText} >Endorses</Text>
                        </View>
                    </View>

                </Content>
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    
    detailsTile:{
        alignItems: 'center',
        margin:10
    },
    coloredText:{
        color:'#1c92c4'
    }
});

const mapStateToProps = (state) => {
    return {
        email: state.user.emailAddress,
        firstName: state.user.firstName,
        lastName: state.user.lastName
    };
}

export default connect(mapStateToProps, null)(Home)