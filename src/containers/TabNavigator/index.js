import React from 'react';
import { Text, View} from 'react-native';
import {Icon} from 'native-base'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Home from '../Home'
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
    }

    return <Icon name={iconName} style={{ color: tintColor }} />
};
  
export default createAppContainer(TabNavigator);
