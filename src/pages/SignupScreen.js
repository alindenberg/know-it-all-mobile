import React from 'react'
import {
    View,
    Text,
    TextInput,
    Button
} from 'react-native'
import base64 from 'base-64'
import AsyncStorage from '@react-native-community/async-storage';

export default class SignupScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            text: null,
            accessToken: null
        }
    }

    async componentDidMount() {
        AsyncStorage.getItem('accessToken').then(token => {
            this.setState({ accessToken: token })
        })
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                    autoCapitalize='none'
                    style={{ fontSize: 30 }}
                    placeholder={"Create Username"}
                    onChangeText={text => {
                        this.setState({text: text})
                    }}
                />
                {this.state.error ? <Text style={{ fontSize: 10, color: 'red' }}>Error: {this.state.error}</Text> : null}
                <Button
                    onPress={() => {
                        if (this.state.text.length < 5 || this.state.text.length > 20) {
                            this.setState({ error: "Username must be between 5 and 20 characters in length." })
                        } else {
                            var idCreds = JSON.parse(base64.decode(this.state.accessToken.split(".")[1]))
                            fetch(`http://localhost:8080/users`, {
                                method: 'POST',
                                headers: {
                                    ContentType: 'application/json',
                                    authorization: this.state.accessToken
                                },
                                body: JSON.stringify({ userid: idCreds.sub, email: idCreds.email, username: this.state.text })
                            }).then(async (res) => {
                                if (res.status == 400) {
                                    var errorMessage = await res.json().then(error => error.error)
                                    this.setState({ error: errorMessage })
                                } else {
                                    console.log("Navigating")
                                    this.props.navigation.navigate('App')
                                }
                            })
                        }
                    }
                    }
                    disabled={this.state.text == null}
                    title="Save Username" />
            </View>
        )
    }
}