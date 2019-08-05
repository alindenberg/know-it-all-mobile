import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native'
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import base64 from 'base-64'
import Loading from '../components/Loading';
import BetList from '../components/BetList';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      isLoading: true,
    }
  }

  async componentDidMount() {
    await AsyncStorage.getItem('accessToken').then(token => { this.setState({ accessToken: token }) })
    // Userid will be the id of the actual signed in user, the state's user will be whoever's profile we are viewing
    var userId = JSON.parse(base64.decode(this.state.accessToken.split('.')[1])).sub
    // Get profile object for user's who profile we are displaying
    this.fetchUser(userId).then((user) => {
      this.setState({
        isLoading: false,
        user: user
      })
    })
  }

  async fetchUser(userId) {
    return fetch(`http://localhost:8080/users/${userId}`, {
      headers: {
        authorization: this.state.accessToken
      },
      method: 'GET'
    }).then(res => res.json()).catch(err => { console.log("USER bets ERROR ", err) })
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />
    }
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents onWillFocus={async () => await this.fetchUser(this.state.user.UserID).then(user => {
          this.setState({ user: user })
        })} />
        <View style={{ flexDirection: 'column', width: '100%' }}>
          <View style={{ width: '100%', flexDirection: 'row', paddingRight: 10, justifyContent: 'flex-end' }}>
            <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10 }}>
              <Icon
                name='user-plus'
                type='font-awesome'
                color='#007AFF'
                onPress={() => this.props.navigation.navigate('FriendList', { user: this.state.user })} />
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
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <BetList user={this.state.user} navigation={this.props.navigation} bets={this.state.user.Bets} />
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