import React from 'react';
import {
  Text,
  SafeAreaView,
  TextInput,
  Button,
} from 'react-native'
import {_onLogin} from '../services/Auth'
import AsyncStorage from '@react-native-community/async-storage';
// import { SafeAreaView } from 'react-navigation';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  _onLogin = async () => {
    await _onLogin().then((isSignup) => {
      if(isSignup) {
        this.props.navigation.navigate('Signup')

      } else {
        this.props.navigation.navigate('Profile')
      }
  }).catch(err => {
  })}

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-evenly', alignItems: "center" }}>
        <Text style={{fontSize: 40}}>Know It All</Text>
        <Button title="Login / Sign-Up" onPress={this._onLogin} />
      </SafeAreaView>
    )
  }
}