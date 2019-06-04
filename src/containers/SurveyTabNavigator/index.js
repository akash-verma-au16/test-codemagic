import React from 'react';
import { View, Dimensions, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import { Content, H3, Toast } from 'native-base'
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';

/* Assets */
import nature1 from '../../assets/tileBackgrounds/nature1.jpg'
import nature2 from '../../assets/tileBackgrounds/nature2.jpg'
import nature3 from '../../assets/tileBackgrounds/nature3.jpeg'
class Screen1 extends React.Component {
    componentWillMount() {
        this.itterator()
    }
    tiles = []

    itterator = () => {
        for (let i = 0; i < 20; i++) {
            switch (i % 3) {
            case 0:
                this.image = nature1
                break
            case 1:
                this.image = nature2
                break
            case 2:
                this.image = nature3
            }
            this.tiles.push(
                <TouchableOpacity
                    onPress={() => Toast.show({
                        text: 'coming soon.',
                        type: 'success',
                        duration: 3000
                    })}
                    key={i}
                >
                    <View>
                        <ImageBackground style={styles.tile} resizeMode='cover' source={this.image} blurRadius={0.2} borderRadius={5}>
                            <H3 style={styles.tileText}>Survey Name</H3>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
            )

        }
    }
    render() {
        
        return (

            <Content contentContainerStyle={{ backgroundColor: '#eee', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>

                {this.tiles}

            </Content>

        )
    }
}
class Screen2 extends React.Component {
    componentWillMount() {
        this.itterator()
    }
    tiles = []

    itterator = () => {
        for (let i = 0; i < 5; i++) {
            switch (i % 3) {
            case 0:
                this.image = nature2
                break
            case 1:
                this.image = nature1
                break
            case 2:
                this.image = nature3
            }
            this.tiles.push(
                <TouchableOpacity
                    onPress={() => Toast.show({
                        text: 'coming soon.',
                        type: 'success',
                        duration: 3000
                    })}
                    key={i}
                >
                    <View>
                        <ImageBackground style={styles.tile} resizeMode='cover' source={this.image} blurRadius={0.2} borderRadius={5}>
                            <H3 style={styles.tileText}>Survey Name</H3>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
            )

        }
    }
    render() {
        return (

            <Content contentContainerStyle={{ backgroundColor: '#eee', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>

                {this.tiles}

            </Content>

        )
    }
}
const SurveyTabNavigator = createMaterialTopTabNavigator({

    Screen1: { 
        screen: Screen1,
        navigationOptions: {
            title: 'Daily Surveys'
        } 
    },
    Screen2: { 
        screen: Screen2,
        navigationOptions: {
            title: 'Weekly Surveys'
        }
    }
},
{
    tabBarOptions: {
        style: {
            backgroundColor: '#1c92c4'
        },
        indicatorStyle: {
            height: 0
        }
    }
}
)

const styles = StyleSheet.create({
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

export default createAppContainer(SurveyTabNavigator);