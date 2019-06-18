import React from 'react';
import {
    AsyncStorage,
    View,
    TextInput,
    Button
} from 'react-native'
export default class SignUpScreen extends React.Component {
    static navigationOptions = {
      title: 'Please sign in',
    };
  
    render() {
      return (
        <View style={{ flex: 1, padding: 10, alignItems: "center" }}>
            <TextInput
                style={{height: 65}}
                placeholder="Email"
                autoCompleteType="email"
                onChangeText={(text) => this.setState({text})}
            />
            <TextInput
                style={{height: 65}}
                placeholder="Username"
                onChangeText={(text) => this.setState({text})}
            />
            <TextInput
                style={{height: 65}}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => this.setState({text})}
            />
          <Button style={{padding: 10}} title="Sign Up" onPress={() => this.props.navigation.navigate('SignUp')} />
        </View>
      );
    }
  
    _signInAsync = async () => {
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('App');
    };
  }