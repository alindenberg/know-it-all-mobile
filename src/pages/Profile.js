import React from 'react';
import { View, Text, Button, Alert } from 'react-native'
import { _onLogout, _onPasswordChange } from '../services/Auth'
import AsyncStorage from '@react-native-community/async-storage'
import base64 from 'base-64'

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: null
    }

    AsyncStorage.getItem('idToken').then(idToken => {
      var email = JSON.parse(base64.decode(idToken.split('.')[1])).email
      this.setState({
        email: email
      })
    })
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> Profile Screen {"\n"}</Text>
        <Text>Email : {this.state.email}</Text>

        <Button
          onPress={() => {
            _onLogout().then(() => {
              AsyncStorage.removeItem('idToken')
              AsyncStorage.removeItem('accessToken')
              this.props.navigation.navigate('Login')
            })
          }}
          title="Logout"
        />

        <Button
          onPress={() => {
            _onPasswordChange().then(() => {
              // Works on both iOS and Android
              Alert.alert(
                'Email Sent!',
                'Check your inbox for a link to change your password.',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
              );
            })
          }}
          title="Change Password"
        />
      </View>
    )
  }
}
