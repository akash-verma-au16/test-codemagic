import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon, Spinner } from 'native-base'
import { list_associate } from '../../services/tenant'
import MultiSelect from 'react-native-multiple-select';
/* Redux */
import { connect } from 'react-redux'
class AssociateTager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            refreshing: true
        };
        this.data = []
    }
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    }
    componentDidMount() {
        this.loadMembers()
    }
    loadMembers = () => {
        list_associate({
            tenant_id: this.props.accountAlias
        })
            .then(response => {
                /* Clear Garbage */
                this.data = []
                response.data.data.map(item => {
                    /* Create List items */
                    const fullName = item.first_name + ' ' + item.last_name
                    this.data.push({ id: item.associate_id, name: fullName })
                })

                this.setState({ refreshing: false })
            })
            .catch(() => {
                this.setState({ refreshing: false })
            })
    }
    render() {

        const { selectedItems } = this.state;
        return (
            <View style={{
                alignItems: 'center',
                width: '90%',
                borderRadius: 10,
                backgroundColor: '#fff',
                shadowOffset: { width: 5, height: 5 },
                shadowColor: 'black',
                shadowOpacity: 0.2,
                elevation: 2
            }}>
                <View style={{ backgroundColor: '#1c92c4', flexDirection: 'row', borderTopRightRadius: 10, borderTopLeftRadius: 10, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='md-person-add' style={{ fontSize: 18, paddingRight: 5, color: 'white' }} />
                        <Text style={{ fontSize: 18, color: '#fff', marginVertical: 10 }}>Tag your colleagues</Text>
                    </View>

                    {this.state.selectedItems.length > 0 ?
                        <Icon name='md-close' style={{ fontSize: 18, color: '#fff' }} onPress={() => this.setState({ selectedItems: [] })} />
                        : null}

                </View>
                {this.state.refreshing ?
                    <Spinner color='#1c92c4' />
                    :
                    <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 10, marginBottom: 10 }}>

                        <MultiSelect
                            hideTags
                            items={this.data}
                            uniqueKey='id'
                            ref={(component) => { this.multiSelect = component }}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={selectedItems}
                            selectText='Select colleagues'
                            searchInputPlaceholderText='Search colleagues...'
                            onChangeInput={(text) => console.log(text)}
                            tagRemoveIconColor='#1c92c4'
                            tagBorderColor='#1c92c4'
                            tagTextColor='#1c92c4'
                            selectedItemTextColor='#1c92c4'
                            selectedItemIconColor='#1c92c4'
                            itemTextColor='#000'
                            displayKey='name'
                            searchInputStyle={{ color: '#1c92c4' }}
                            submitButtonColor='#1c92c4'
                            submitButtonText='Submit'
                        />
                        {this.props.isShowingKeyboard ?
                            null
                            :
                            <View>
                                {this.multiSelect && this.multiSelect.getSelectedItemsExt(selectedItems)}
                            </View>
                        }

                    </View>
                }
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        associate_id: state.user.associate_id

    };
}

export default connect(mapStateToProps, null)(AssociateTager)