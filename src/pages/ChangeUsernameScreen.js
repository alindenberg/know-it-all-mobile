import React from 'react'
import {
    View,
    Text,
    Button,
    TextInput
} from 'react-native'

export default class ChangeUsernameScreen extends React.Component {
    constructor(props) {
        console.log("PROPS ", props)
        super(props)
        this.state = {
            error: null,
            user: this.props.navigation.getParam("user"),
            text: null
        }
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'column' }}>
                    <TextInput 
                    style={{ fontSize: 30 }}
                    placeholder={"New Username"}
                    onChangeText={text => {
                        this.setState({text: text})
                    }}/>
                    <Button 
                        onPress={() => 
                            {
                                console.log("Text: ", this.state.text) 
                            }
                        } 
                        disabled={this.state.text == null || this.state.text == this.state.user.Username}
                        title="Save Username" />
                </View>
            </View>
        )
    }
}