import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-navigation';
import { TabView, SceneMap } from 'react-native-tab-view';
import { _onLogout, _onPasswordChange } from '../services/Auth'
import { Icon } from 'react-native-elements'
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
    await AsyncStorage.getItem('accessToken').then(token => { this.setState({ accessToken: token }) })
    var userId = JSON.parse(base64.decode(this.state.accessToken.split('.')[1])).sub
    if (this.sentUserId != null && this.sentUserId != userId) {
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
    }).catch(err => { console.log("USER bets ERROR ", err) }))

    requests.push(fetch(`http://localhost:8080/users`, {
      headers: {
        authorization: this.state.accessToken
      },
      method: 'GET'
    }).then(res => {
      return res.json()
    }).then(friends => {
      this.state.friends = friends;
    }).catch(err => { console.log("USER ERROR ", err) }))

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
        {this.state.isUsersProfile ?
          <View style={{ width: '100%', flexDirection: 'row', paddingRight: 10, paddingLeft: 10, justifyContent: 'space-between', alignItems: 'center' }}>
            <Icon
              name='users'
              type='font-awesome'
              color='#007AFF'
              onPress={() => this.props.navigation.navigate('Friends')} />
            <Text style={{ fontSize: 40 }}>{this.state.user.Username}</Text>
            <Icon
              name='gear'
              type='font-awesome'
              color='#007AFF'
              onPress={() => this.props.navigation.navigate('Settings', {user: this.state.user})} />
          </View>
          :
          // TODO: Button to add this person as a friend
          <Text style={{ fontSize: 40 }}>{this.state.user.Username}</Text>
          // null
        }
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <BetList user={this.state.user} navigation={this.props.navigation} bets={this.state.user.Bets} />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  }
})