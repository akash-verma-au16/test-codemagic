import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'native-base'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Home from '../Home'
import CreatePost from '../CreatePost'
class HomeScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>posts</Text>
            </View>
        );
    }
}

const TabNavigator = createBottomTabNavigator({
    Home: { screen: HomeScreen },
    CreatePost: { screen: CreatePost },
    Settings: { screen: Home }
},
{
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
            getTabBarIcon(navigation, focused, tintColor)
    }),
    tabBarOptions: {
        activeTintColor: '#1c92c4',
        inactiveTintColor: '#aaa'
    }
}
);

const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    let iconName;
    if (routeName === 'Home') {
        iconName = 'md-home'

    } else if (routeName === 'Settings') {
        iconName = 'md-settings'
    } else if (routeName === 'CreatePost') {
        iconName = 'md-add'
    }

    return <Icon name={iconName} style={{ fontSize: 20, color: tintColor }} />
};

export default createAppContainer(TabNavigator);
