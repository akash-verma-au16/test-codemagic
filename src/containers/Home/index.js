import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Image,
    BackHandler
} from 'react-native';
import {

    Container,
    Content,
    Text,
    Icon,
    H3,
    H2

} from 'native-base';

import { IndicatorViewPager } from 'rn-viewpager';

/* Redux */
import { connect } from 'react-redux'

/* Assets */
import thumbnail from '../../assets/thumbnail.jpg'
class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isSignInLoading: false
        }
        this.pager = React.createRef();
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

    async goBack() {
        await this.props.navigation.goBack()
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }
    render() {

        return (

            <Container>
                <Content style={{flex:1}} contentContainerStyle={{alignItems:'center'}} scrollEnabled={true}>
                    
                    <Image 
                        style={{ borderRadius: Dimensions.get('window').width/2, width:100,height:100, aspectRatio:1/1 , margin:10}}
                        source={thumbnail}
                        resizeMode='stretch'
                    />

                    <H2>{this.props.firstName + ' ' + this.props.lastName}</H2>

                    <Text style={styles.coloredText}>{this.props.email}</Text>
                    {/* <View style={{flex: 1, alignItems: 'center'}}> */}
                    <View style={{ borderColor: 'black', borderTopWidth: 1, borderBottomWidth: 1, flexDirection: 'row',margin:10,width:'90%',alignItems: 'center',justifyContent: 'space-between'}}>

                        <TouchableOpacity style={styles.detailsTile} onPress={() => this.pager.setPage(0)}>
                            <H3>9</H3>
                            <Text style={styles.coloredText} >Thanks</Text>
                        </TouchableOpacity>
                        
                        <View style={{backgroundColor:'black',width:1,height:'50%'}}/>

                        <TouchableOpacity style={styles.detailsTile} onPress={() => this.pager.setPage(1)}>
                            <H3>100</H3>
                            <Text style={styles.coloredText} >Points</Text>
                        </TouchableOpacity>

                        <View style={{backgroundColor:'black',width:1,height:'50%'}}/>

                        <TouchableOpacity style={styles.detailsTile} onPress={() => this.pager.setPage(2)}>
                            <H3>5</H3>
                            <Text style={styles.coloredText} >Endorses</Text>
                        </TouchableOpacity>
                    </View>
                    <IndicatorViewPager
                        ref={ref => this.pager = ref}
                        style={{ backgroundColor: 'blue', height: 200}}
                        onPageSelected={(page) => this.setState({ selectedTab: page.position })}
                    >
                        <View style={{height: 50, backgroundColor: 'blue'}}>
                            <ScrollView
                                contentContainerStyle={{ backgroundColor: '#000', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isLoading}
                                        onRefresh={() => {}}
                                    />
                                }
                            >
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                            </ScrollView>
                        </View>
                        <View>
                            <ScrollView
                                contentContainerStyle={{ backgroundColor: '#eee', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isLoading}
                                        onRefresh={() => {}}
                                    />
                                }
                            >
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                            </ScrollView>
                        </View>
                        <View>
                            <ScrollView
                                contentContainerStyle={{ backgroundColor: '#eee', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isLoading}
                                        onRefresh={() => {}}
                                    />
                                }
                            >
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                                <Text>Anything</Text>
                            </ScrollView>
                        </View>
                    </IndicatorViewPager>

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