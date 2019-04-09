import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Modal
} from 'react-native';

/* Native Base */
import {
    H3,
    Icon
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
        this.data = []
    }
    componentWillMount() {
        this.loadMembers()
    }
    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }

    loadMembers = () => {
        this.setState({ refreshing: true })
        list_associate({
            tenant_id: "1l3jtp3hn"
        })
            .then(response => {
                this.data = response.data.data
                this.setState({ refreshing: false })
            })
            .catch(() => {
                this.setState({ refreshing: false })
            })
    }
    closeHandler = () => {
        this.setState({ searchTerm: '' })
        this.props.closeHandler()
    }
    render() {
        const filteredData = this.data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
        return (
            <Modal
                animationType='slide'
                visible={this.props.enabled}
                hardwareAccelerated={true}
                onRequestClose={() => {

                }}
                style={styles.container}
            >
                <View style={{ flexDirection: 'row', backgroundColor: '#1c92c4', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Icon name='md-close' style={
                        {
                            color: 'white',
                            margin: 20

                        }
                    } onPress={this.closeHandler} />
                    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white', borderRadius: 50, marginRight: 10 }}>
                        <Icon name='ios-search' style={
                            {
                                color: '#1c92c4',
                                margin: 10,
                                marginHorizontal: 20
                            }
                        } onPress={null} />
                        <SearchInput
                            onChangeText={(term) => { this.searchUpdated(term) }}
                            style={{
                                flex: 1,
                                maxWidth: '90%',
                                minWidth: '50%'
                            }}
                            placeholder='Search recipient'

                        />

                    </View>

                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.loadMembers}
                        />
                    }
                >
                    {this.data ?
                        filteredData.map((item, index) => {
                            const name = item.first_name + ' ' + item.last_name

                            /* const initals = item.first_name.chatAt(0)  */
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.onPressListener(item.first_name)        
                                    }} 
                                    key={index} 
                                    style={styles.item}
                                >
                                    <View style={{
                                        backgroundColor: '#BBBBBE',
                                        height: '80%',
                                        aspectRatio: 1 / 1,
                                        marginLeft: 10,
                                        borderRadius: 100,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <H3 styles={{ color: '#fff' }}>
                                            {item.first_name.charAt(0) + item.last_name.charAt(0)}
                                        </H3>
                                    </View>
                                    <H3 style={{ marginHorizontal: 10 }}>{name}</H3>

                                </TouchableOpacity>
                            )
                        })
                        : null}
                </ScrollView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start'
    },
    item: {
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        height: 70
    }
});
const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id

    };
}

export default connect(mapStateToProps, null)(ListMember)