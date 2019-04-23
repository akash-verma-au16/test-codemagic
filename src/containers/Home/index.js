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
            isLoading: false,
            isSignInLoading: false,
            selectedTab: 0
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
        console.log("Pager", this.pager)

    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    render() {

        return (

            <Container>
                <Content contentContainerStyle={{flex: 1, alignItems:'center', padding:10}} scrollEnabled={true}>
                    
                    <Image 
                        style={{ borderRadius: Dimensions.get('window').width/2, width:100,height:100, aspectRatio:1/1 , margin:10}}
                        source={thumbnail}
                        resizeMode='stretch'
                    />

                    <H2>{this.props.firstName + ' ' + this.props.lastName}</H2>

                    <Text style={styles.coloredText}>{this.props.email}</Text>
                    {/* <View style={{flex: 1, alignItems: 'center'}}> */}
                    <View style={{ flx: 1, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        <View style={styles.tabHeader}>
                            <TouchableOpacity onPress={() => this.pager.setPage(0)}>
                                <Icon name='md-thumbs-up' style={this.state.selectedTab === 0 ? styles.iconActive : styles.iconInactive} />
                                {/* <H3 style={{ textAlign: 'center' }}>9</H3>
                                <Text style={styles.coloredText} >Thanks</Text> */}
                            </TouchableOpacity>
                            
                            {/* <View style={{ backgroundColor:'#000',width:1,height:'50%'}}/> */}

                            <TouchableOpacity onPress={() => this.pager.setPage(1)}>
                                <Icon name='wallet' type={'Entypo'} style={this.state.selectedTab === 1 ? styles.iconActive : styles.iconInactive} />
                                {/* <Icon1 name="wallet" size={30} color="#900" /> */}
                                {/* <H3 style={{ textAlign: 'center' }}>100</H3>
                                <Text style={styles.coloredText} >Points</Text> */}
                            </TouchableOpacity>

                            {/* <View style={{backgroundColor:'#000',width:1,height:'50%'}}/> */}

                            <TouchableOpacity onPress={() => this.pager.setPage(2)}>
                                <Icon name='md-people' style={this.state.selectedTab === 2 ? styles.iconActive : styles.iconInactive} />
                                
                                {/* <H3 style={{textAlign:'center'}}>5</H3>
                                <Text style={styles.coloredText} >Endorses</Text> */}
                            </TouchableOpacity>
                        </View>
                        <IndicatorViewPager
                            ref={ref => this.pager = ref}
                            style={styles.viewPager}
                            onPageSelected={(page) => this.setState({ selectedTab: page.position })}
                        >
                            <View>
                                <ScrollView
                                    contentContainerStyle={{ backgroundColor: '#eee',flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.isLoading}
                                            onRefresh={() => {}}
                                        />
                                    }
                                    
                                >
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Thanks</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Thanks</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Thanks</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Thanks</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Thanks</Text>
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
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Transactions</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Transactions</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Transactions</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Transactions</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Transactions</Text>
                                    
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
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Endorsements</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Endorsements</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Endorsements</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Endorsements</Text>
                                    <Text style={{ height: 25, width: '100%', textAlign: 'center', color: '#1c92c4' }}>Endorsements</Text>
                                </ScrollView>
                            </View>
                        </IndicatorViewPager>
                    </View>
                </Content>
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    coloredText:{
        color:'#1c92c4',
        textAlign:'center'
    },

    iconActive: {
        fontSize: 26,
        color: '#1c92c4'
    },
    iconInactive: {
        fontSize: 26,
        color: '#8a8b8c'
    },
    tabHeader: {
        borderTopWidth: 1 / 5,
        borderBottomWidth: 1 / 5,
        flexDirection: 'row',
        margin: 10,
        marginTop: 25,
        height: 35,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },  
    viewPager: {
        width: '100%',
        height: 400,
        padding: 20
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