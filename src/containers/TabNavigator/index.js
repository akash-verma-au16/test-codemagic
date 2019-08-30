import React from 'react';
import { Icon } from 'native-base'
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import ListSurvey from '../ListSurvey'
import CreatePost from '../CreatePost'
import ListPost from '../ListPost'
const HomeStack = createStackNavigator({
    'home': {
        screen: ListPost,
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#47309C'
            },
            title: 'HappyWorks',
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: "center",
                flex: 1
            }
        }
    }
});
const CreatePostStack = createStackNavigator({
    'createPost': {
        screen: CreatePost,
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#47309C'
            },
            title: 'Leave a note',
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: "center",
                flex: 1
            }
        }
    }
});

const ListSurveyStack = createStackNavigator({
    'listSurvey': {
        screen: ListSurvey,
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#47309C'
            },
            title: 'Insights',
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: "center",
                flex: 1
            }
        }
    }
});
const TabNavigator = createBottomTabNavigator({
    Home: { screen: HomeStack },
    CreatePost: {
        screen: CreatePostStack
    },
    ListSurvey: { screen: ListSurveyStack }
},
{
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
            getTabBarIcon(navigation, focused, tintColor)
    }),
    tabBarOptions: {
        activeTintColor: '#47309C',
        inactiveTintColor: 'black',
        showLabel: false
    },
    backBehavior: 'none',
    lazy: false
}
);

const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    let iconName;
    if (routeName === 'Home') {
        iconName = 'md-home'

    } else if (routeName === 'ListSurvey') {
        iconName = 'md-stats'
    } else if (routeName === 'CreatePost') {
        iconName = 'md-add'
    }

    return <Icon name={iconName} style={{ color: tintColor }} />
};

export default createAppContainer(TabNavigator);
