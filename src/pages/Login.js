import React from 'react';
import {
  View,
  TextInput,
  Button,
} from 'react-native'
import {_onLogin} from '../services/Auth'
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-navigation';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, padding: 10, justfiyContent: 'center', alignContent: "center" }}>
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
      </SafeAreaView>
    );
  }
}