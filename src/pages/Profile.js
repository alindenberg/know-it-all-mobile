import React, { Component } from 'react';
import { View, Text, Button } from 'react-native'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { TextInput } from 'react-native-paper';
import { conditionalExpression } from '@babel/types';
import { _onLogout, _onPasswordChange } from '../services/auth'
import AsyncStorage from '@react-native-community/async-storage'

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: null
    }

    AsyncStorage.getItem('idToken').then(idToken => {
      console.log("Id token: ", idToken)
      var email = JSON.parse(atob(idToken.split('.')[1])).email
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
              console.log("Password change done")
            })
          }}
          title="Change Password"
        />
      </View>
    )
  }
}
