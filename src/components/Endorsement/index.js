import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, TextInput, Alert } from 'react-native';
import { Icon, Content } from 'native-base'
import EndorsementMessage from './EndorsementMessage'


class Endorsement extends Component {
    constructor(props) {
        super(props);

        this.initialState = {
            showTemplates: true,
            selectedStrength: '',
            selectedSource: null,
            text: ''
        }
        this.state = this.initialState
        this.endorsementData = [
            { name: 'Creativity', source: require('../../assets/endorsements/creativity.png') },
            { name: 'Curiosity', source: require('../../assets/endorsements/curiosity.png') },
            { name: 'Judgement', source: require('../../assets/endorsements/judgement.png') },
            { name: 'Perspective', source: require('../../assets/endorsements/perspective.png') },
            { name: 'Bravery', source: require('../../assets/endorsements/bravery.png') },
            { name: 'Perseverance', source: require('../../assets/endorsements/perseverance.png') },
            { name: 'Zest', source: require('../../assets/endorsements/zest.png') },
            { name: 'Honesty', source: require('../../assets/endorsements/honesty.png') },
            { name: 'Social Intelligence', source: require('../../assets/endorsements/socialIntelligence.png') },
            { name: 'Kindness', source: require('../../assets/endorsements/kindness.png') },
            { name: 'Love', source: require('../../assets/endorsements/love.png') },
            { name: 'Leadership', source: require('../../assets/endorsements/leadership.png') },
            { name: 'Fairness', source: require('../../assets/endorsements/fairness.png') },
            { name: 'Teamwork', source: require('../../assets/endorsements/teamwork.png') },
            { name: 'Forgiveness', source: require('../../assets/endorsements/forgiveness.png') },
            { name: 'Love of Learning', source: require('../../assets/endorsements/loveOfLearning.png') },
            { name: 'Spirituality', source: require('../../assets/endorsements/spirituality.png') },
            { name: 'Self-Regulation', source: require('../../assets/endorsements/selfRegulation.png') },
            { name: 'Humility', source: require('../../assets/endorsements/humility.png') },
            { name: 'Appreciation', source: require('../../assets/endorsements/appreciation.png') },
            { name: 'Prudence', source: require('../../assets/endorsements/prudence.png') },
            { name: 'Hope', source: require('../../assets/endorsements/hope.png') },
            { name: 'Humor', source: require('../../assets/endorsements/humor.png') },
            { name: 'Gratitude', source: require('../../assets/endorsements/gratitude.png') }

        ]
        this.endorsementMessages = EndorsementMessage,
        this.endorsedMessages = []
        
    }
    componentWillMount() {
        this.createEndorsementTemplate()
    }

    // handles populating random quote for selected strength 
    endorsementQuoteHandler = (name, source) => {
        const endorse = this.endorsementMessages.filter( item => item.name == name)
        const responseMessages = endorse[0].messages
        var rindex = Math.floor((Math.random() * responseMessages.length));
        const message = responseMessages[rindex]
        this.setState({ showTemplates: false, selectedStrength: name, selectedSource: source, text: message })
        this.props.endorsementHandler(name, message)
    }

    createEndorsementTemplate = () => {
        this.endorsementTemplate = []
        this.endorsementData.map((item, index) => {
        
            this.endorsementTemplate.push(

                <TouchableOpacity style={styles.template} key={index}
                    onPress={() => this.endorsementQuoteHandler(item.name, item.source)}
                >
                    <Image
                        source={item.source}
                        style={{ height: 50, aspectRatio: 1 / 1 }}
                    />
                    <Text style={styles.templateText}>
                        {item.name}
                    </Text>
                </TouchableOpacity>

            )
        })
        this.setState({ showTemplates: true })
    }
    suggestionSection = () => (
        <View style={{ width: '100%', alignItems: 'center' }}>
            <Text style={{ margin: 10 }}>Select the strength</Text>
            <View style={{
                height: 1,
                backgroundColor: '#ccc',
                width: '90%'

            }} />
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
                marginBottom: 10,
                flex: 1
            }}>
                <View style={{ backgroundColor: '#1c92c4', flexDirection: 'row', borderTopRightRadius: 10, borderTopLeftRadius: 10, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='md-people' style={{ fontSize: 18, paddingRight: 5, color: 'white' }} />
                        <Text style={{ fontSize: 18, color: '#fff', marginVertical: 10 }}>Endorse</Text>
                    </View>
                    <Icon name='md-close' style={{ padding: 10, fontSize: 18, color: '#fff' }} onPress={() => {
                        if (this.state.text === '') {
                            this.props.closeEndorseModal()
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
                                            this.props.closeEndorseModal()
                                        }
                                    }
                                ],
                                { cancelable: false },
                            )
                        }
                    }} />
                </View>

                {this.state.showTemplates ?
                    <this.suggestionSection />
                    : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={this.state.selectedSource}
                            style={{ height: 100, margin: 10, aspectRatio: 1 / 1 }}
                        />
                        <Text style={{ fontSize: 18, marginBottom: 10 }}>
                            {this.state.selectedStrength}
                        </Text>

                        <TextInput
                            multiline={true}
                            maxLength={255}
                            placeholder='Write something here'
                            scrollEnabled={true}
                            style={{
                                padding: 20,
                                fontSize: 20,

                                textAlignVertical: 'top'
                            }}
                            value={this.state.text}
                            onChangeText={(text) => {
                                this.setState({ text })
                                this.props.endorsementHandler(this.state.selectedStrength, text)
                            }}
                            autoFocus
                        />
                    </View>
                }

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
        height: 100,
        width: Dimensions.get('window').width / 2 - 45,
        margin: 10,
        maxWidth: 200
    },
    templateText: {

        color: '#000'
    }
})

export default Endorsement