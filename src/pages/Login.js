import React from 'react';
import {
  View,
  TextInput,
  Button,
} from 'react-native'
import {_onLogin} from '../services/Auth'
import AsyncStorage from '@react-native-community/async-storage';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <View style={{ flex: 1, padding: 10, justfiyContent: 'center', alignItems: "center" }}>
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