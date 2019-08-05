import React from 'react'
import {
  ScrollView,
  TextInput,
  Text,
  Button,
  View
} from 'react-native'
import { Card, ListItem } from 'react-native-elements'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import AsyncStorage from '@react-native-community/async-storage';
import EmptyList from '../components/EmptyList'
import AddFriends from '../components/AddFriends'

export default class FriendListScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      user: this.props.navigation.getParam("user"),
      friends: [],
      routes: [
        { key: 'first', title: 'Friends' },
        { key: 'second', title: 'Add Friends' },
      ]
    }
  }

  async componentDidMount() {
    await AsyncStorage.getItem("accessToken").then(accessToken => {
      fetch(`http://localhost:8080/users/${this.state.user.UserID}/friends`, {
        headers: {
          ContentType: 'application/json',
          authorization: accessToken
        },
        method: 'GET'
      }).then(res => {
        return res.json()
      }).then(friends => {
        friends = friends == null ? [] : friends
        this.setState({ accessToken: accessToken, friends: friends, isLoading: false })
      })
    })
  }

  getFriendListComponent() {
    if (this.state.isLoading) {
      return <Loading />
    }
    else if (this.state.friends.length == 0) {
      return <EmptyList value="friends" />
    }
    return (
      <ScrollView style={{ width: '100%', height: '100%' }}>
        {this.state.friends.map((user, index) => {
          return (
            <Card key={index} containerStyle={{ padding: 0 }} >
              <ListItem
                key={index}
                title={user.Username}
                onPress={() => this.props.navigation.navigate('FriendProfile', { userId: user.UserID })}
              />
            </Card>
          );
        })}
      </ScrollView>
    )
  }
  render() {
    if (this.state.isLoading) {
      return <Loading />
    }
    return (
      <View style={{ flex: 1 }}>
        <TabView
          renderTabBar={props =>
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: 'black' }}
              style={{ backgroundColor: 'white' }}
              renderLabel={({ route, index }) => {
                return (
                  <View style={{ height: 30 }}>
                    <Text style={{ color: 'black', textAlign: 'center' }}>{route.title}</Text>
                  </View>
                )
              }}
            />
          }
          navigationState={this.state}
          renderScene={SceneMap({
            first: () => this.getFriendListComponent(),
            second: () => <AddFriends navigation={this.props.navigation} user={this.state.user} />,
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ height: 100, width: 100 }}
        />
      </View>
    );
  }
}