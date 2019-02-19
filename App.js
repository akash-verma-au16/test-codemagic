import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Toast, Root} from 'native-base'



export default class App extends Component {
  render() {
    return (
      <Root>
        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome to React Native!</Text>
          <Text style={styles.welcome}>Testing react native app</Text>
          <Button onPress={() => {
            Toast.show({
              text: 'Toast is integrated',
              type: 'success',
              duration: 3000
            })
          }}
            style={{alignSelf: 'center',}}
          >
            <Text>
              Show Toast
          </Text>
          </Button>
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
