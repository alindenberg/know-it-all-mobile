import React from 'react'
import {
  ScrollView,
  Text,
  View
} from 'react-native'
import { Card, ListItem } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import EmptyList from '../components/EmptyList'

export default class FriendsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: this.props.navigation.getParam("user"),
      friends: []
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
        this.setState({ accessToken: accessToken, friends: friends })
      })
    })
  }

  render() {
    return (
      // <View>
      //   <Text>
      //     Gary
      //   </Text>
      // </View>
      <ScrollView style={{ width: '100%', height: '100%' }}>
        {this.state.friends.map((friend, index) => {
          return (
            <Card key={index} containerStyle={{ padding: 0 }} >
              <ListItem
                key={index}
                title={friend.Username}
                // rightTitle={`${user.Wins}-${user.Losses}`}
                onPress={() => this.props.navigation.navigate('UserProfile', { userId: friend.UserID })}
              />
            </Card>
          );
        })
        }
      </ScrollView>
    )
  }
}