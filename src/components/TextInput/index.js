import React from 'react';
import { StyleSheet } from 'react-native'
import { Input, Item } from 'native-base';

class InputText extends React.Component {

    constructor(props) {
        super(props);
        this.baseColor = this.props.color ? this.props.color :'#1c92c4'
        this.state = {
            borderColor: this.baseColor
        }
        this.styles = StyleSheet.create({
            inputText: {
                borderWidth: 1,
                borderRadius: 10,
                paddingLeft: 35,
                paddingRight: 35,
                color: this.baseColor
            },
            item: {
                margin: 15,
                marginTop:0,
                borderBottomWidth: 0
            }
        })
    }
    render() {
        return (
            <Item style={this.styles.item}>
                <Input
                    {...this.props}
                    style={{ ...this.styles.inputText, ...this.props.style, borderColor: this.state.borderColor }}
                    maxLength={200}
                    returnKeyType={"next"}
                    selectionColor='#1c92c4'
                    placeholderTextColor={'#000'}
                    onFocus={() => this.setState({ borderColor: this.props.color ? this.props.color : '#111' })}
                    onBlur={() => this.setState({ borderColor: this.baseColor })}
                    blurOnSubmit={false}
                    ref={this.props.inputRef}
                />
            </Item>
        )
    }
    
}

export default InputText;
