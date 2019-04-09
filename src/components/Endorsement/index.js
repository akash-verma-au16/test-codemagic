import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base'

class Endorsement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTemplates: true,
            text: ''
        }
        this.endorsementData = [
            `I just wanted to say ThankYou`,
            `I really appreciate you`,
            `Just when I thought your work couldn't get any better`,
            `Thanks you for setting a great example`,
            `You are such an invaluable member of the team`,
            `I am continually impressed by the results you produce`,
            `I couldn't imagine working without you`,
            `Without you I'd be lost. Thanks for your support`,
            `I am so lucky to have you as my mentor`,
            `You come up with fantastic ideas`,
            `You come up with fantastic ideas,You come up with fantastic ideas,You come up with fantastic ideas,You come up with fantastic ideas`

        ]
    }
    componentWillMount() {
        this.createEndorsementTemplate()
    }
    createEndorsementTemplate = () => {
        this.endorsementTemplate = []
        this.endorsementData.map((item, index) => {
            this.endorsementTemplate.push(
                <View style={styles.template} key={index} >
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, justifyContent: 'center' }} >
                        <TouchableOpacity onPress={() => {
                            this.setState({ text: item, showTemplates: false })
                        }}>
                            <Text style={styles.templateText}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            )
        })
        this.setState({ showTemplates: true })
    }
    suggestionSection = () => (
        <View style={{ height: 120, width: '100%' }}>
            <Text style={{ marginHorizontal: 10, marginTop: 10 }}>
                Suggestions:
            </Text>
            <ScrollView horizontal style={{}} >
                {this.endorsementTemplate}
            </ScrollView>
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
                minHeight: 200
            }}>
                <View style={{ backgroundColor: '#1c92c4', flexDirection: 'row', borderTopRightRadius: 10, borderTopLeftRadius: 10, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='md-people' style={{ fontSize: 18, paddingRight: 5, color: 'white' }} />
                        <Text style={{ fontSize: 18, color: '#fff', marginVertical: 10 }}>Endorse</Text>
                    </View>
                    <Icon name='md-close' style={{ fontSize: 18, color: '#fff' }} onPress={() => this.setState({ selectedItems: [] })} />
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

                    }}
                    ref={this.inputTextRef}
                />

                {this.state.showTemplates ?
                    <this.suggestionSection />
                    : null}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    template: {
        borderRadius: 10,
        borderColor: '#1c92c4',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        maxWidth: 200
    },
    templateText: {

        color: '#1c92c4'
    }
})

export default Endorsement