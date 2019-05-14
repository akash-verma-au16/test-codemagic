import React from 'react';
import {
    View,
    Text
} from 'react-native';

class Likes extends React.Component {
    render() {
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                <Text>Likes</Text>
            </View>
        )
    }
}

export default Likes