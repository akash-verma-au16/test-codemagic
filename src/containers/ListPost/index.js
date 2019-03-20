import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
/* Redux */
import { connect } from 'react-redux'
import {

    Container,
    Content,
    H2,
    Icon,
    Toast
} from 'native-base';
/* Services */
import {list_posts} from '../../services/post'
/* Components */
import LoadingModal from '../LoadingModal'
import { NavigationEvents } from 'react-navigation';
class ListPost extends React.Component {
    constructor(props){
        super(props)
        this.state={
            isLoading:false
        }
        this.postList=[]
    }
    static navigationOptions = ({navigation}) => {
        return {
            
            headerRight: (
                <Icon name='md-notifications' style={
                    {color: 'white',
                        margin:20
                    }
                } onPress={()=>navigation.navigate('notifications')} />
            ),
            headerLeft: (
                <React.Fragment/>
            )
        };
    };
    componentWillMount() {
        if(this.props.isFreshInstall){
            this.props.navigation.navigate('TermsAndConditions')
            return
        }else if (!this.props.isAuthenticate) {
            this.props.navigation.navigate('LoginPage')
            return
        }
        
    }

    commingSoon=()=>{
        Toast.show({
            text: 'Coming Soon!',
            type: 'success',
            duration:3000
        })
    }
    loadPosts=()=>{
        this.postList=[]
        const payload = {
            tenant_id: this.props.accountAlias,
            associate_id:this.props.associate_id
            
        }
        this.setState({isLoading:true})
        try {
            list_posts(payload).then(response=>{
                this.createTiles(response.data.data)
                this.setState({isLoading:false})
            }).catch((error)=>{
                
                Toast.show({
                    text: error.response.data.code,
                    type: 'danger',
                    duration:3000
                })
                this.setState({isLoading:false})
                
            })    
        } catch (error) {
            Toast.show({
                text: 'No internet connection',
                type: 'danger',
                duration:3000
            })
            this.setState({isLoading:false})
        }
    }
    createTiles=(data)=>{
        if(data.length===0){
            this.postList.push(<Text key={0}>No post to display</Text>)
            return
        }
        data.map((item,index)=>{
            this.postList.push(
                <View style={styles.card} key={index}>
                    <View name='header'
                        style={{
                            flex:1,
                                
                            flexDirection:'row',
                            alignItems: 'center'
                        }}
                    >
                        <View name='image' style={{
                            borderRadius:30,
                            backgroundColor:'#1c92c4',
                            height:30,
                            aspectRatio:1/1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Icon name='person' style={{fontSize:20,color:'white'}}/>
                        </View>
                        <Text style={{marginHorizontal:10,color:'#333',fontWeight:'500'}}>John Snow</Text>
                    </View>
                    <View style={{
                        backgroundColor: '#ddd',
                        height: 1,
                        width: '100%',
                        marginVertical: 10
                    }} />
                    <View name='content'
                        style={{
                            flex:2,
                                
                            padding:10
                        }}
                    >
                        <H2 >{item.message}</H2>
                    </View>
                    <View style={{
                        backgroundColor: '#ddd',
                        height: 1,
                        width: '100%',
                        marginVertical: 10
                    }} />
                    <View name='footer'
                        style={{
                            flex:1,
                                
                            flexDirection:'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}
                    >
                            
                        <Icon name='md-thumbs-up' style={{fontSize: 20,color:'#ddd'}}onPress={this.commingSoon}/>
                    </View>
                </View>
            )
        })
    }
    render() {

        return (

            <Container style={{backgroundColor:'#eee'}}>
                <Content
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                >
                    
                    {this.postList}
                    {this.state.isLoading?null:
                        <TouchableOpacity style={{
                            backgroundColor:'#1c92c4',
                            height:50,
                            aspectRatio:1/1,
                            borderRadius:25,
                            alignItems:'center',
                            justifyContent: 'center'
                        }}
                        onPress={this.loadPosts}
                        >
                            <Icon name='md-refresh' style={{color:'white'}}/>
                        </TouchableOpacity>
                    }
                </Content>
                
                <LoadingModal
                    enabled={this.state.isLoading}
                />
                <NavigationEvents
                    onWillFocus={() => this.loadPosts()}
                />
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        
        backgroundColor:'#eee'
    },

    card: {
        marginBottom: 10,
        backgroundColor:'white',
        width: '100%',
        borderRadius: 10,
        padding:20,
        shadowOffset:{ width: 5, height: 5 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 2
    }
});

const mapStateToProps = (state) => {
    return {
        accountAlias:state.user.accountAlias,
        associate_id: state.user.associate_id,
        isAuthenticate: state.isAuthenticate,
        isFreshInstall: state.system.isFreshInstall

    };
}

export default connect(mapStateToProps, null)(ListPost)