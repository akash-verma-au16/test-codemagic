import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Icon, Content } from 'native-base'

class Gratitude extends Component {
    constructor(props) {
        super(props);

        this.initialState = {
            showTemplates: true,
            text: ''
        }
        this.state = this.initialState
        this.endorsementData = [
            `I just wanted to say ThankYou`,
            `I really appreciate you`,
            `Thank you for setting a great example`,
            `Thanks for your support`

        ]
    }
    componentWillMount() {
        this.createEndorsementTemplate()
    }
    createEndorsementTemplate = () => {
        this.endorsementTemplate = []
        this.endorsementData.map((item, index) => {
            this.endorsementTemplate.push(

                <TouchableOpacity style={styles.template} key={index} onPress={() => {
                    this.setState({ text: item, showTemplates: false })
                    this.props.gratitudeHandler(item)
                    this.props.closeSelectionDrawer()
                }}>

                    <Text style={styles.templateText}>
                        {item}
                    </Text>

                </TouchableOpacity>
            )
        })
        this.setState({ showTemplates: true })
    }
    suggestionSection = () => (
        <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>

            <View style={{
                height: 1,
                backgroundColor: '#ccc',
                width: '90%'

            }} />
            <Text style={{ fontSize: 12, marginVertical: 10 }}>
                Suggestions
            </Text>
            <Content contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>

                {this.endorsementTemplate}

            </Content>
        </View>
    )
    render() {

        return (
            <View style={{
                alignItems: 'center',
                width: '90%',
                borderRadius: 10,
                backgroundColor: '#fff',
                shadowOffset: { width: 5, height: 5 },
                shadowColor: 'black',
                shadowOpacity: 0.2,
                elevation: 2,
                marginTop: 10,
                marginBottom: 10
            }}>
                <View style={{ backgroundColor: '#47309C', flexDirection: 'row', borderTopRightRadius: 10, borderTopLeftRadius: 10, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='md-people' style={{ fontSize: 18, paddingRight: 5, color: 'white' }} />
                        <Text style={{ fontSize: 18, color: '#fff', marginVertical: 10 }}>Thanks</Text>
                    </View>
                    <Icon name='md-close' style={{ padding: 10, fontSize: 18, color: '#fff' }} onPress={() => {
                        if (this.state.text === '') {
                            this.props.closeGratitudeModal()
                        } else {
                            Alert.alert(
                                'Are you sure?',
                                'Note will not be saved',
                                [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel'
                                    },
                                    {
                                        text: 'OK', onPress: () => {
                                            this.setState(this.initialState)
                                            this.props.closeGratitudeModal()
                                        }
                                    }
                                ],
                                { cancelable: false },
                            )
                        }
                    }} />
                </View>
                <TextInput
                    multiline={true}
                    maxLength={255}
                    placeholder='Write something here'
                    scrollEnabled={true}
                    style={{
                        padding: 20,
                        fontSize: 20,
                        width: '100%',
                        textAlignVertical: 'top'
                    }}
                    value={this.state.text}
                    onChangeText={(text) => {
                        if (text.length === 0)
                            this.setState({ text: text, showTemplates: true })
                        else
                            this.setState({ text: text, showTemplates: false })
                        this.props.gratitudeHandler(text)
                    }}
                />

                {this.state.showTemplates ?
                    <this.suggestionSection />
                    :
                    <Text style={{ fontSize: 12, marginBottom: 10 }}>
                        You can edit the above message
                    </Text>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    template: {
        borderRadius: 10,
        borderColor: '#47309C',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: Dimensions.get('window').width / 2 - 45,
        margin: 10,
        maxWidth: 200
    },
    templateText: {
        paddingHorizontal: 10,
        color: '#47309C'
    }
})

export default Gratitude