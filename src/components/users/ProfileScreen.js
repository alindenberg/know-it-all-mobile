import React, {Component} from 'react';
import {View, Text, Button} from 'react-native'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { TextInput } from 'react-native-paper';


export default class ProfileScreen extends React.Component {
  state = {

  }
  // textChange = ({text}) => {
  //   console.log("Text changed")
  // }
  async componentDidMount() {
    console.log('Profile component mounted')
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> Profile Screen </Text>
        <Button 
            onPress={() => this.props.navigation.navigate('Auth')}
            title="Login"
        />
      </View>
    )
  }
}
