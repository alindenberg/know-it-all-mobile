import React from 'react'
import {
  View,
  TextInput,
  Text,
  Button,
  ScrollView
} from 'react-native'
import { Card, ListItem } from 'react-native-elements'
export default class AddFriends extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: this.props.user,
      searchResults: [],
      showingSearchResults: false,
      searchText: null,
      usernamedSearched: null
    }
  }

  searchByUsername = async (username) => {
    await fetch(`http://localhost:8080/users?username=${username}`, {
      headers: {
        ContentType: 'application/json',
        authorization: this.state.accessToken
      },
      method: 'GET'
    }).then(res => res.json()).then(
      results => {
        results = results == null ? [] : results
        this.setState({ searchResults: results, showingSearchResults: true, usernameSearched: username })
      })
  }

  render() {
    return (
      <View style={{ flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
        <View style={{ backgroundColor: '#bdbdbd', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <TextInput
            autoCapitalize='none'
            style={{ fontSize: 16, textAlign: 'center', width: '80%' }}
            placeholder={"Add Friend By Username"}
            onChangeText={text => {
              this.setState({ searchText: text, newSearch: true })
            }} />
          <Button
            onPress={() => this.searchByUsername(this.state.searchText)}
            title={'Search'}
            disabled={this.state.searchText == null || this.state.searchText == "" || this.state.searchText == this.state.usernameSearched} />
        </View>
        {this.state.searchResults.length > 0 ?
          <ScrollView style={{ width: '100%', height: '100%' }}>
            {this.state.searchResults.map((user, index) => {
              return (
                <Card key={index} containerStyle={{ padding: 0 }} >
                  <ListItem
                    key={index}
                    title={user.Username}
                    onPress={() => {
                      this.props.navigation.navigate('FriendProfile', { userId: user.UserID })
                    }}
                  />
                </Card>
              );
            })
            }
          </ScrollView>
          :
          <View style={{ marginTop: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {this.state.showingSearchResults ?
              <Text style={{ width: '80%', textAlign: 'center' }}>Couldn't find any users with a username containing: {this.state.usernameSearched}</Text>
              :
              <Text style={{ width: '80%', textAlign: 'center' }}>Users with matching usernames will be displayed here</Text>
            }
          </View>
        }
      </View>
    )
  }
}