import React from 'react';
import {
  AsyncStorage,
  View,
  TextInput,
  Button
} from 'react-native'
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({ domain: process.env.appDomain, clientId: process.env.kiaClientId});

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { accessToken: null }
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
        <Button title="Login" onPress={this._onLogin} />
        <Button title="Logout" onPress={this._onLogout} />
        <Button style={{ padding: 10 }} title="Sign Up" onPress={() => this.props.navigation.navigate('SignUp')} />
      </View>
    );
  }

  _onLogin = () => {
    auth0.webAuth
      .authorize({
        scope: 'read:bets',
        audience: 'http://localhost:8080',
      })
      .then(credentials => {
        console.log("credentials ", credentials)
        this.setState({ accessToken: credentials.accessToken });
      })
      .catch(error => console.log(error));
  };

  _onLogout = () => {
    auth0.webAuth
      .clearSession({})
      .then(success => {
        this.setState({ accessToken: null });
      })
      .catch(error => console.log(error));
  }
}