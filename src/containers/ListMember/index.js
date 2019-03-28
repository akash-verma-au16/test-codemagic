import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
    BackHandler,
    TouchableOpacity,
    Text,
    TextInput,
    ScrollView,
    RefreshControl
} from 'react-native';

/* Native Base */
import {
    Container,
    Icon,
    Toast,
    Thumbnail,
    H2, H3
} from 'native-base';
/* Redux */
import { connect } from 'react-redux'

/* Service */
import { list_associate } from '../../services/tenant'

import SearchInput, { createFilter } from 'react-native-search-filter';

const KEYS_TO_FILTERS = ['first_name', 'last_name'];
class ListMember extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            refreshing: false
        }
        this.data=[]
    }
    componentWillMount(){
        this.loadMembers()
    }
    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }
    static navigationOptions = ({ navigation }) => {
        /* return {
            
            headerRight: (
                <Icon name='ios-arrow-round-forward' style={
                    {color: 'white',
                        margin:20
                    }
                } onPress={navigation.getParam('postSubmitHandler')} />
            )
            
        }; */
    };
    
    loadMembers =()=>{
        this.setState({refreshing:true})
        list_associate({
            tenant_id:"1l3jtp3hn"
        })
            .then(response=>{
                this.data=response.data.data
                console.log(this.data)
                this.setState({refreshing:false})
            })
            .catch(error=>{
                console.log(error.response)
                this.setState({refreshing:false})
            })
    }
    render() {
        const filteredData = this.data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
        return (
            <View style={styles.container}>
                <SearchInput
                    onChangeText={(term) => { this.searchUpdated(term) }}
                    style={styles.searchInput}
                    placeholder='Type a message to search'
                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.loadMembers}
                        />
                    }
                >
                    {filteredData.map((item,index) => {
                        const name = item.first_name + ' ' + item.last_name
                        return (
                            <TouchableOpacity onPress={() => alert(name)} key={index} style={styles.emailItem}>
                                <View>
                                    <Text>{name}</Text>
                                    
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start'
    },
    emailItem: {
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        flexDirection: 'row',
        alignItems: 'center'
    },
    emailSubject: {
        color: 'rgba(0,0,0,0.5)'
    },
    searchInput: {
        padding: 10,
        borderColor: '#CCC',
        borderWidth: 1
    }
});
const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id

    };
}

export default connect(mapStateToProps, null)(ListMember)

const emails = [
    {
        id: 1,
        user: {
            name: 'Juniper'
        },
        subject: 'Hello World!'
    },

    {
        id: 2,
        user: {
            name: 'Robert'
        },
        subject: 'React is <3'
    }, {
        id: 3,
        user: {
            name: 'you can'
        },
        subject: "What's Up?"
    }
    , {
        id: 4,
        user: {
            name: 'Georgia'
        },
        subject: 'How are you today?'
    }, {
        id: 5,
        user: {
            name: 'Albert'
        },
        subject: 'Hey!'
    }, {
        id: 6,
        user: {
            name: 'Zoey'
        },
        subject: 'React Native!'
    }, {
        id: 7,
        user: {
            name: 'Cody'
        },
        subject: 'is super!'
    }, {
        id: 8,
        user: {
            name: 'Chili'
        },
        subject: 'Awesome!'
    }
    
]

const response = {
    status: "success",
    "payload": "",
    "data": [
        {
            "associate_id": "5dffd531-55df-4631-83f2-4e1db4cedb0b",
            "tenant_id": "1l3jtp3hn",
            "tenant_ass_id": "123",
            "first_name": "Aayush_D",
            "last_name": "Dalvi",
            "email": "aayush@gmail.com",
            "phonenumber": "+917276793777",
            "is_disabled": false
        },
        {
            "associate_id": "9c2f6191-9594-4c90-acf4-d708ee461fd1",
            "tenant_id": "1l3jtp3hn",
            "tenant_ass_id": "123",
            "first_name": "Akshay",
            "last_name": "A",
            "email": "akshay@gmail.com",
            "phonenumber": "+917276793777",
            "is_disabled": false
        },
        {
            "associate_id": "fa9a8f60-4840-4c0a-b785-beebef4b1a24",
            "tenant_id": "1l3jtp3hn",
            "tenant_ass_id": "123",
            "first_name": "John",
            "last_name": "Snow",
            "email": "john@happyworks.com",
            "phonenumber": "+917276793777",
            "is_disabled": false
        },
        {
            "associate_id": "83e258db-0c7a-4d4c-bc67-d5a1aeb4bbb2",
            "tenant_id": "1l3jtp3hn",
            "tenant_ass_id": "123",
            "first_name": "Tenant",
            "last_name": "Admin",
            "email": "sony@gmail.com",
            "phonenumber": "+917276793777",
            "is_disabled": false
        },
        {
            "associate_id": "f5603da3-cb7b-4cd0-ba42-ceb728889779",
            "tenant_id": "1l3jtp3hn",
            "tenant_ass_id": "123",
            "first_name": "Sushant",
            "last_name": "S",
            "email": "sushant@gmail.com",
            "phonenumber": "+917276793777",
            "is_disabled": false
        }
    ],
    "message": "Asssociates!"
}