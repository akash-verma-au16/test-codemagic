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
                backgroundColor: '#9871d5'
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
                backgroundColor: '#9871d5'
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
                backgroundColor: '#9871d5'
            },
            title: 'My Survey',
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
        screen: CreatePostStack, navigationOptions: {
            tabBarVisible: false
        }
    },
    ListSurvey: { screen: ListSurveyStack }
},
{
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
            getTabBarIcon(navigation, focused, tintColor)
    }),
    tabBarOptions: {
        activeTintColor: '#9871d5',
        inactiveTintColor: 'black',
        showLabel: false
    },
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
