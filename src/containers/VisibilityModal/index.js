import React, { Component } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {
    Icon
} from 'native-base'

export default class VisibilityModal extends Component {

    componentDidMount(){
        if(this.props.data.text)
            this.onPressHandler(this.props.data[0].text,this.props.data[0].name)
    }
    onPressHandler=(text,name,key)=>{
        this.props.onChangeListener({text,name,key})
        this.props.visibilityDisableHandler()
    }
    render() {
        let tiles = []
        const lastTile = this.props.data.length -1
        this.props.data.map((item, index) => {
            
            const color = this.props.state && this.props.state===item.text? '#9871d5' : '#555'
            tiles.push(
                <React.Fragment key={index}>
                    <TouchableOpacity
                        key={index}
                        style={{

                            flexDirection: 'row',
                            padding: 10,
                            width: '100%'
                        }}
                        onPress={()=>this.onPressHandler(item.text,item.name,item.key)}
                    >
                        <Icon name={item.icon} 
                            type={item.type ? item.type : 'Ionicons'}
                            style={[
                                styles.icon,
                                {color:color} 
                            ]} />
                        
                        <Text style={{
                            color: color,
                            textAlign: 'center'

                        }}
                        >
                            {item.text}
                        </Text>
                    </TouchableOpacity>
                    {index!==lastTile?
                        <View style={{
                            backgroundColor: '#ddd',
                            height: 1,
                            width: '90%',
                            marginVertical: 10
                        }} />
                        :null}
                </React.Fragment>
            )

        })
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={this.props.enabled}
                hardwareAccelerated={true}
                onRequestClose={this.props.onRequestClose}
                style={{
                    height: 500,
                    width: 500,
                    backgroundColor: '#00000033'
                }}
            >
                <TouchableHighlight
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#00000055'
                    }}
                    onPress={this.props.visibilityDisableHandler} 
                    underlayColor='#00000055'
                    // activeOpacity={1}
                >
                    <View
                        style={{

                            width: '80%',
                            backgroundColor: 'white',
                            borderRadius: 5,
                            alignItems: 'center',
                            padding: 10
                        }}
                    >
                        {
                            this.props.header ? 
                                <View 
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'transparebt',
                                        alignItems: 'center'
                                    }}>
                                    <View
                                        name='header'
                                        style={{
                                            flexDirection: 'row',

                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Icon name='md-eye' style={{ fontSize: 20, paddingHorizontal: 5, color: 'black' }} />
                                        <Text style={{
                                            color: 'black',
                                            textAlign: 'center'

                                        }}
                                        >{this.props.header}</Text>
                                    </View>

                                    <View style={{
                                        backgroundColor: '#333',
                                        height: 1,
                                        width: '100%',
                                        marginVertical: 10
                                    }} />
                                </View>
                                :
                                <View></View>
                        } 
                        
                        {tiles}
                    </View>
                </TouchableHighlight>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 20,
        paddingHorizontal: 10
    }
})