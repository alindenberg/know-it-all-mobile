import React from 'react';
import {
  View,
  TextInput,
  Button,
} from 'react-native'
import {_onLogin} from '../services/Auth'

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <View style={{ flex: 1, padding: 10, alignItems: "center" }}>
        <TextInput
          style={{ height: 40 }}
          placeholder="Username"
          onChangeText={(text) => this.setState({ text })}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ text })}
        />
        <Button title="Login" onPress={async () => {
          await _onLogin().then(async (isSignup) => {
            // if(isSignup) {
            //   this.props.navaigation.navigate('Signup')
            // }
            this.props.navigation.navigate('Profile')
          }).catch(err => {
            console.log("Login error ", err)
          })
        }} />
      </View>
    );
  }
}