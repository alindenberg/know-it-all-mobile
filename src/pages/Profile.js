import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native'
import { SafeAreaView } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import base64 from 'base-64'
import Loading from '../components/Loading';
import BetList from '../components/BetList';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.sentUserId = this.props.navigation.getParam("userId")
    this.state = {
      profileUser: null,
      loggedInUser: null,
      isLoading: true,
      isUsersProfile: true
    }
  }

  async componentDidMount() {
    await AsyncStorage.getItem('accessToken').then(token => { this.setState({ accessToken: token }) })
    // Userid will be the id of the actual signed in user, the state's user will be whoever's profile we are viewing
    var loggedInUserId = JSON.parse(base64.decode(this.state.accessToken.split('.')[1])).sub

    var profileId = loggedInUserId
    if (this.sentUserId != null && this.sentUserId != loggedInUserId) {
      this.state.isUsersProfile = false
      var profileId = this.sentUserId
    }
    const requests = []
    // Get profile object for user's who profile we are displaying
    requests.push(fetch(`http://localhost:8080/users/${profileId}`, {
      headers: {
        authorization: this.state.accessToken
      },
      method: 'GET'
    }).then(res => {
      return res.json()
    }).then(user => {
      this.state.profileUser = user;
    }).catch(err => { console.log("USER bets ERROR ", err) }))

    // Get logged in user as well if viewing other user's profile
    if (profileId != loggedInUserId) {
      requests.push(fetch(`http://localhost:8080/users/${loggedInUserId}`, {
        headers: {
          ContentType: 'application/json',
          authorization: this.state.accessToken
        },
        method: 'GET'
      }).then(res => res.json()).then(user => this.state.loggedInUser = user))
    }

    Promise.all(requests).then(() => {
      this.state.isLoading = false
      this.setState(this.state)
    })
  }

  getFriendIndex = () => {
    for (var i = 0; i < this.state.loggedInUser.Friends.length; i++) {
      if (this.state.loggedInUser.Friends[i] == this.state.profileUser.UserID) {
        return i
      }
    }

    return -1
  }

  _deleteFriend = () => {
    fetch(`http://localhost:8080/users/${this.state.loggedInUser.UserID}/friends/${this.state.profileUser.UserID}`, {
      headers: {
        ContentType: 'application/json',
        authorization: this.state.accessToken
      },
      method: 'DELETE'
    }).then(() => {
      var index = this.getFriendIndex()
      this.state.loggedInUser.Friends.splice(index, 1)
      this.setState(this.state)
    })
  }

  _addFriend = () => {
    fetch(`http://localhost:8080/users/${this.state.loggedInUser.UserID}/friends/${this.state.profileUser.UserID}`, {
      headers: {
        ContentType: 'application/json',
        authorization: this.state.accessToken
      },
      method: 'POST'
    }).then(() => {
      this.state.loggedInUser.Friends.push(this.state.profileUser.UserID)
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
          <View style={{ flexDirection: 'column', width: '100%' }}>
            <View style={{ width: '100%', flexDirection: 'row', paddingRight: 10, justifyContent: 'flex-end' }}>
              <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10 }}>
                <Icon
                  name='user-plus'
                  type='font-awesome'
                  color='#007AFF'
                  onPress={() => this.props.navigation.navigate('Friends', { user: this.state.profileUser })} />
              </View>
              <Icon
                name='gear'
                type='font-awesome'
                color='#007AFF'
                style={{ marginRight: 10 }}
                onPress={() => this.props.navigation.navigate('Settings', { user: this.state.profileUser })} />
            </View>
            <View>
              <Text style={{ fontSize: 40, textAlign: 'center' }}>{this.state.profileUser.Username}</Text>
            </View>
          </View>
          :
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ textAlign: 'center', fontSize: 40 }}>{this.state.profileUser.Username}</Text>
            {(this.getFriendIndex() > -1) ?
              <Button style={{ padding: 0 }} onPress={() => this._deleteFriend()} title="Remove Friend"></Button>
              :
              <Button style={{ padding: 0 }} onPress={() => this._addFriend()} title="Add Friend"></Button>
            }
          </View>
        }
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <BetList user={this.state.profileUser} navigation={this.props.navigation} bets={this.state.profileUser.Bets} />
        </View>
      </SafeAreaView >
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