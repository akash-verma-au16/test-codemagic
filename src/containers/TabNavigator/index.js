import React from 'react';
import { Icon } from 'native-base'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Home from '../Home'
import CreatePost from '../CreatePost'
import ListPost from '../ListPost'

const TabNavigator = createBottomTabNavigator({
    Home: { screen: ListPost },
    CreatePost: { screen: CreatePost },
    Profile: { screen: Home }
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
