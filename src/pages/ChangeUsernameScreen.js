import React from 'react'
import {
    View,
    Text,
    Button,
    TextInput
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

export default class ChangeUsernameScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            accessToken: null,
            user: this.props.navigation.getParam("user"),
            text: null
        }

        AsyncStorage.getItem("accessToken").then(token => {
            this.setState({accessToken: token})
        })
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'column' }}>
                    <TextInput 
                    autoCapitalize='none'
                    style={{ fontSize: 30 }}
                    placeholder={"New Username"}
                    onChangeText={text => {
                        this.setState({text: text, error: null})
                    }}/>
                    {this.state.error ? <Text style={{fontSize: 10, color: 'red'}}>Error: {this.state.error}</Text> : null}
                    <Button 
                        onPress={() => 
                            {
                                if(this.state.text.length < 5 || this.state.text.length > 20) {
                                    this.setState({error: "Username must be between 5 and 20 characters in length."})
                                } else {
                                    fetch(`http://localhost:8080/users/${this.state.user.UserID}/username`, {
                                        method: 'POST',
                                        headers: {
                                            ContentType: 'application/json',
                                            authorization: this.state.accessToken
                                        },
                                        body: JSON.stringify({username: this.state.text})
                                    }).then(async res => {
                                        if(res.status == 400) {
                                            var errorMessage = await res.json().then(error => error.error)
                                            this.setState({error: errorMessage})
                                        } else {
                                            this.state.user.Username = this.state.text
                                            this.setState(this.state)
                                        }
                                    })
                                }
                            }
                        } 
                        disabled={this.state.text == null || this.state.text == this.state.user.Username}
                        title="Save Username" />
                </View>
            </View>
        )
    }
}