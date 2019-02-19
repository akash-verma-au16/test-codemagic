import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    ScrollView
} from 'react-native';
import {
    Form,
    Container,
    Content,
    Text,
    H3,
    View
} from 'native-base';
/* Redux */
import { connect } from 'react-redux'
import { system } from '../../store/actions'
/* Custom components */
import Logo from '../../components/Logo'
import Slogan from '../../components/Slogan'
import RoundButton from '../../components/RoundButton'
/* Assets */
import image from '../../assets/image.jpg'

import clearStackNavigate from '../../utilities/clearStackNavigate'

const loremIpsum = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
class TermsAndConditions extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isButtonEnabled: false
        }

    }

    scrollHandler = (event) => {

        if (!this.state.isButtonEnabled) {
            const { contentSize, contentOffset, layoutMeasurement } = event.nativeEvent
            const scrollPosition = Math.floor(layoutMeasurement.height + contentOffset.y)
            const height = Math.floor(contentSize.height)

            if (scrollPosition === height) {
                this.setState({ isButtonEnabled: true })
            }
        }
    }

    buttonHandler = () => {
        this.props.acceptTermsAndConditions()
        clearStackNavigate('LoginPage',this.props)
    }

    render() {
        const Header = 'Terms & Conditions'
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
                                <ScrollView onScroll={this.scrollHandler} >
                                    <Text>{loremIpsum}</Text>
                                    <Text>{loremIpsum}</Text>
                                    <Text>{loremIpsum}</Text>
                                    <Text>{loremIpsum}</Text>
                                    <Text>{loremIpsum}</Text>
                                </ScrollView>
                            </View>
                            <RoundButton
                                onPress={this.buttonHandler}
                                value='Accept Terms & Conditions'
                                isDisabled={!this.state.isButtonEnabled}
                                
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
    h2:{
        margin:15,
        textAlign:"center",
        color:'white',
        fontWeight:"bold"
    },
    scrollContainer:{ 
        flex: 1,
        backgroundColor:'#fff',
        padding:15,
        marginBottom: 15
    }

});

const mapDispatchToProps = (dispatch) => {
    return {
        acceptTermsAndConditions: () => dispatch({ type: system.AGREE_POLICY})
    };
}

export default connect(null, mapDispatchToProps)(TermsAndConditions)