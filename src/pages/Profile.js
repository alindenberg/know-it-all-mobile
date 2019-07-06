import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
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

    // requests.push(fetch(`http://localhost:8080/users`, {
    //   headers: {
    //     authorization: this.state.accessToken
    //   },
    //   method: 'GET'
    // }).then(res => {
    //   return res.json()
    // }).then(friends => {
    //   this.state.friends = friends;
    // }).catch(err => { console.log("USER ERROR ", err) }))

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
          <View style={{ flexDirection: 'column', width: '100%' }}>
            <View style={{ width: '100%', flexDirection: 'row', paddingRight: 10, justifyContent: 'flex-end' }}>
              <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10 }}>
                <Icon
                  name='user-plus'
                  type='font-awesome'
                  color='#007AFF'
                  onPress={() => this.props.navigation.navigate('Friends', { user: this.state.user })} />
              </View>
              <Icon
                name='gear'
                type='font-awesome'
                color='#007AFF'
                style={{ marginRight: 10 }}
                onPress={() => this.props.navigation.navigate('Settings', { user: this.state.user })} />
            </View>
            <View>
              <Text style={{ fontSize: 40, textAlign: 'center' }}>{this.state.user.Username}</Text>
            </View>
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