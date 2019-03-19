import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList
} from 'react-native';

/* Native Base */
import {
    Container,
    Content,
    Icon,
    H3,
    Toast
} from 'native-base';

class CreatePost extends React.Component {
    static navigationOptions = () => {
        return {
            
            headerRight: (
                <React.Fragment/>
            )
            
        };
    };
    toast = ()=>{
        Toast.show({
            text: 'Releasing in next update',
            type: 'success',
            duration:3000
        })
    }
    data = [
        {
            key:'Push Notification',
            icon:'md-notifications',
            onPress:()=>this.toast()
        },
        {
            key:'Change Password',
            icon:'md-key',
            onPress:()=>this.toast()
        },
        {
            key:'Privacy Policy',
            icon:'md-lock',
            onPress:()=>this.toast()
        },
        {
            key:'User Agreement',
            icon:'md-document',
            onPress:()=>this.toast()
        },
        {
            key:'App Version : 1.4',
            icon:'md-phone-portrait'
        },
        {
            key:'Logout',
            icon:'md-log-out',
            onPress:()=>this.toast()
        }
    ]

    render() {

        return (

            <Container>
                <Content
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    style={{
                        paddingHorizontal: 20
                    }}
                >
                    <FlatList
                        data={this.data}
                        renderItem={
                            ({item}) =>
                                <TouchableOpacity
                                    disabled={item.onPress?false:true}
                                    style={{
                                        flexDirection: 'row',
                                        paddingVertical: 20,
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        borderColor: 'black',
                                        borderBottomWidth: 1
                                    }}
                                    onPress={item.onPress}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name={item.icon} style={styles.icon} />

                                        <H3 style={{
                                            color: 'black',
                                            textAlign: 'center'

                                        }}
                                        >
                                            {item.key}
                                        </H3>
                                    </View>
                                    {item.onPress?
                                        <Icon name='ios-arrow-forward' style={[
                                            styles.icon,
                                            {color:'black'}
                                        ]} />
                                        :null}
                                </TouchableOpacity>
                        }
                    />
                </Content>
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 20,
        paddingHorizontal: 10,
        color:'#1c92c4'
    }
})

export default CreatePost