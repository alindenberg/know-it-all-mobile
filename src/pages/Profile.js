import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-navigation';
import { TabView, SceneMap } from 'react-native-tab-view';
import { _onLogout, _onPasswordChange } from '../services/Auth'
import AsyncStorage from '@react-native-community/async-storage'
import base64 from 'base-64'
import Loading from '../components/Loading';
import BetList from '../components/BetList';
import UserList from '../components/UserList';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.sentUserId = this.props.navigation.getParam("userId")
    this.state = {
      user: null,
      friends: null,
      isLoading: true,
      isUsersProfile: true
    }
  }

  async componentDidMount() {
    await AsyncStorage.getItem('accessToken').then(token => {this.setState({accessToken: token})})
    var userId = JSON.parse(base64.decode(this.state.accessToken.split('.')[1])).sub
      if(this.sentUserId != null && this.sentUserId != userId) {
        this.state.isUsersProfile = false
        userId = this.sentUserId
      }
      const requests = []
      requests.push(fetch(`http://localhost:8080/users/${userId}`, {
        headers: {
          authorization: this.state.accessToken
        },
        method: 'GET'
      }).then(res => {
        return res.json()
      }).then(user => {
        this.state.user = user;
      }).catch(err => {console.log("USER bets ERROR ", err)}))

      requests.push(fetch(`http://localhost:8080/users`, {
        headers: {
          authorization: this.state.accessToken
        },
        method: 'GET'
      }).then(res => {
        return res.json()
      }).then(friends => {
        this.state.friends = friends;
      }).catch(err => {console.log("USER ERROR ", err)}))

      Promise.all(requests).then(() => {
        this.state.isLoading = false
        this.setState(this.state)
      })
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ marginTop: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 24 }}>{this.state.user.Email}</Text>
          {this.state.isUsersProfile ? <View style={{ flexDirection: 'row' }}>
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
          </View> : null}
          <BetList user={this.state.user} navigation={this.props.navigation} bets={this.state.user.Bets} />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  betList: {
    width: '100%',
  }
})