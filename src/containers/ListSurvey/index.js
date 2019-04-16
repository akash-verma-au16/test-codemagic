import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ImageBackground,
    Dimensions,
    RefreshControl,
    ScrollView
} from 'react-native';
import { H2, H3 } from 'native-base'
/* Redux */
import { connect } from 'react-redux'
import { auth, dev } from '../../store/actions'
import { BarChart } from 'react-native-charts-wrapper';
/* Native Base */
import {
    Container,
    Content,
    Toast,
    Thumbnail
} from 'native-base';
/* Assets */
import nature1 from '../../assets/tileBackgrounds/nature1.jpg'
import nature2 from '../../assets/tileBackgrounds/nature2.jpg'
import nature3 from '../../assets/tileBackgrounds/nature3.jpeg'
import { list_survey } from '../../services/questionBank'
/* Custom Components */
import thumbnail from '../../assets/thumbnail.jpg'
class ListSurvey extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            selectedTab: 0
        }
        this.MyPulse = []
        this.OrgPulse = []
        this.FunQuiz = []
    }
    componentDidMount() {
        this.loadSurveys()
    }
    loadSurveys = () => {
        this.MyPulse = []
        this.OrgPulse = []
        this.FunQuiz = []
        this.setState({ isLoading: true })
        list_survey({
            tenant_id: this.props.accountAlias
        })
            .then(response => {
                response.data.data.tenant_specific.map((item, index) => {
                    switch (index % 3) {
                    case 0:
                        this.image = nature1
                        break
                    case 1:
                        this.image = nature2
                        break
                    case 2:
                        this.image = nature3
                    }
                    const card = (
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('SurveyIntro', {
                                surveyId: item.id,
                                surveyName: item.name,
                                surveyDescription: '',
                                surveyNote: '',
                                surveyLevel: item.level
                            })}
                            key={index}
                        >
                            <View>
                                <ImageBackground style={styles.tile} resizeMode='cover' source={this.image} blurRadius={0.2} borderRadius={5}>
                                    <Text style={styles.tileText}>{item.name}</Text>
                                </ImageBackground>
                            </View>
                        </TouchableOpacity>
                    )
                    if (item.type === "Daily-Questionnaire") {
                        this.MyPulse.push(card)
                    } else if (item.type === "Weekly-Questionnaire") {
                        this.OrgPulse.push(card)
                    } else {
                        this.FunQuiz.push(card)
                    }

                })
                if (this.MyPulse.length == 0) {
                    this.MyPulse.push(
                        <Text key={0} style={{ padding: 10}}>No Surveys Available</Text>
                    )
                }
                if (this.OrgPulse.length == 0) {
                    this.OrgPulse.push(
                        <Text key={0} style={{ padding: 10}}>No Surveys Available</Text>
                    )
                }
                if (this.FunQuiz.length == 0) {
                    this.FunQuiz.push(
                        <Text key={0} style={{ padding: 10}}>No Surveys Available</Text>
                    )
                }
                this.setState({ isLoading: false })
            })
            .catch(() => {
                this.setState({ isLoading: false })
            })

    }
    static navigationOptions = ({ navigation }) => {
        return {

            headerRight: (
                <React.Fragment />
            ),
            headerLeft: (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Thumbnail
                        source={thumbnail}

                        style={
                            {
                                height: '70%',
                                borderRadius: 50,
                                margin: 10
                            }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )
        };
    };
    toast = () => {
        Toast.show({
            text: 'Coming Soon!',
            type: 'success',
            duration: 3000
        })
    }

    data = [
        {
            key: 'Daily Survey',
            icon: 'md-stats',
            onPress: () => this.props.navigation.navigate('SurveyIntro', {
                surveyId: '3',
                surveyName: 'Daily-Questionnaire',
                surveyDescription: 'Daily Survey',
                surveyNote: 'note',
                surveyLevel: 'beginner'
            })
        },
        {
            key: 'Weekly Survey',
            icon: 'md-stats',
            onPress: () => this.props.navigation.navigate('SurveyIntro', {
                surveyId: '1 ',
                surveyName: 'Weekly-Questionnaire',
                surveyDescription: 'Weekly Survey',
                surveyNote: 'note',
                surveyLevel: 'beginner'
            })
        }
    ]

    render() {

        return (

            <Container style={{ backgroundColor: '#eee' }}>

                <View style={{
                    flex: 1,
                    margin: 10,
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    shadowOffset: { width: 5, height: 5 },
                    shadowColor: 'black',
                    shadowOpacity: 0.5,
                    elevation: 2
                }}>
                    <H2 style={{ margin: 20, marginBottom: 10 }}>Survey summary</H2>
                    <BarChart style={{
                        flex: 1,
                        margin: 10

                    }}
                    data={{ dataSets: [{ label: "Sample Data", values: [{ y: 10 }, { y: 20 }, { y: 1 }, { y: 10 }, { y: 15 }, { y: 5 }, { y: 18 }, { y: 12 }, { y: 1 }] }] }}
                    />
                </View>
                <Content
                    contentContainerStyle={{ flex: 1 }}
                    scrollEnabled={true}

                >
                    <View style={{ flex: 1 }}>

                        <View style={{ flexDirection: 'row', width: '100%', backgroundColor: '#1c92c4', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <TouchableOpacity onPress={() => this.setState({ selectedTab: 0 })}>
                                <Text name='16/17' style={this.state.selectedTab === 0 ? styles.tabActive : styles.tabInactive}>
                                    My Pusle
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ selectedTab: 1 })}>
                                <Text name='7~13' style={this.state.selectedTab === 1 ? styles.tabActive : styles.tabInactive}>
                                    Org Pulse
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ selectedTab: 2 })}>
                                <Text style={this.state.selectedTab === 2 ? styles.tabActive : styles.tabInactive}>
                                    Fun Quiz
                                </Text>
                            </TouchableOpacity>

                        </View>
                        {this.state.selectedTab === 0 ?
                            <ScrollView
                                contentContainerStyle={{ backgroundColor: '#eee', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isLoading}
                                        onRefresh={() => {
                                            this.loadSurveys()
                                        }}
                                    />
                                }
                            >
                                {this.MyPulse}
                            </ScrollView>

                            : null}
                        {this.state.selectedTab === 1 ?
                            <ScrollView
                                contentContainerStyle={{ backgroundColor: '#eee', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isLoading}
                                        onRefresh={() => {
                                            this.loadSurveys()
                                        }}
                                    />
                                }
                            >
                                {this.OrgPulse}
                            </ScrollView>

                            : null}
                        {this.state.selectedTab === 2 ?
                            <ScrollView
                                contentContainerStyle={{ backgroundColor: '#eee', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isLoading}
                                        onRefresh={() => {
                                            this.loadSurveys()
                                        }}
                                    />
                                }
                            >
                                {this.FunQuiz}
                            </ScrollView>

                            : null}

                    </View>

                </Content>

            </Container>

        );
    }
}
const styles = StyleSheet.create({
    tabActive: {
        color: '#fff',
        paddingVertical: 10
    },
    tabInactive: {
        color: '#ccc',
        paddingVertical: 10
    },
    tile: {
        height: 100,
        width: Dimensions.get('window').width / 2 - 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        margin: 10
    },
    tileText: {
        color: '#fff'
    }
})

const mapStateToProps = (state) => {
    return {
        accountAlias: state.user.accountAlias,
        email: state.user.emailAddress

    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        deAuthenticate: () => dispatch({ type: auth.DEAUTHENTICATE_USER }),
        clearData: () => dispatch({ type: dev.CLEAR_DATA })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListSurvey)