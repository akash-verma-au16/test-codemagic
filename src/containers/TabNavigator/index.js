import React from 'react';
import { Icon } from 'native-base'
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Home from '../Home'
import CreatePost from '../CreatePost'
import ListPost from '../ListPost'
import Settings from '../Settings'

const HomeStack = createStackNavigator({
    'home': {
        screen: ListPost,
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#1c92c4'
            },
            title: 'HappyWorks',
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign:"center",
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
                backgroundColor: '#1c92c4'
            },
            title: 'Leave a note',
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign:"center",
                flex: 1
            }
        }
    }
});

const ProfileStack = createStackNavigator({
    'profile': {
        screen: Home,
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#1c92c4'
            },
            title: 'Profile',
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign:"center",
                flex: 1
            }
        }
    },
    'settings': {
        screen: Settings,
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#1c92c4'
            },
            title: 'Settings',
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign:"center",
                flex: 1
            }
        }
    }
});
const TabNavigator = createBottomTabNavigator({
    Home: { screen: HomeStack },
    CreatePost: { screen: CreatePostStack },
    Profile: { screen: ProfileStack }
},
{
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
            getTabBarIcon(navigation, focused, tintColor)
    }),
    tabBarOptions: {
        activeTintColor: '#1c92c4',
        inactiveTintColor: 'black',
        showLabel: false
    }
}
);

const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    let iconName;
    if (routeName === 'Home') {
        iconName = 'md-home'

    } else if (routeName === 'Profile') {
        iconName = 'md-person'
    } else if (routeName === 'CreatePost') {
        iconName = 'md-add'
    }

    return <Icon name={iconName} style={{ color: tintColor }} />
};

export default createAppContainer(TabNavigator);
