import React from 'react';
import {
    AsyncStorage,
    View,
    TextInput,
    Button
} from 'react-native'
export default class LoginScreen extends React.Component {
    static navigationOptions = {
      title: 'Please sign in',
    };
  
    render() {
      return (
        <View style={{ flex: 1, padding: 10, alignItems: "center" }}>
            <TextInput
                style={{height: 40}}
                placeholder="Username"
                onChangeText={(text) => this.setState({text})}
            />
            <TextInput
                style={{height: 40}}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => this.setState({text})}
            />
          <Button title="Login" onPress={this._signInAsync} />
          <Button style={{padding: 10}} title="Sign Up" onPress={() => this.props.navigation.navigate('SignUp')} />
        </View>
      );
    }
  
    _signInAsync = async () => {
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('App');
    };
  }