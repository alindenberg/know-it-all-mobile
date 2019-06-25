import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, FlatList } from 'react-native';
import Unauthorized from '../components/Unauthorized'
import EmptyList from '../components/EmptyList'
import Loading from '../components/Loading'
import AsyncStorage from '@react-native-community/async-storage';
import base64 from 'base-64'

export default class LeagueMatchesScreen extends React.Component {
  state = {
    user: null,
    matches: [],
    isLoading: true,
    isAuthorized: false
  }
  //Define your componentDidMount lifecycle hook that will retrieve data.
  async componentWillMount() {
    var accessToken = await AsyncStorage.getItem('accessToken')

    await fetch('http://localhost:8080/matches', {
      headers: {
        'authorization': accessToken
      }
    }).then(matchesResponse => {
      console.log("matches response ", matchesResponse)
      if (matchesResponse.status == 401) {
        this.setState({ matches: [], isLoading: false, isAuthorized: false })
      } else {
        matchesResponse.json().then(matches => {
          this.setState({ matches: matches, isLoading: false, isAuthorized: true });
        })
      }
    })

    // fetch user in the background
    var userId = JSON.parse(base64.decode(accessToken.split(".")[1])).sub
    fetch(`http://localhost:8080/users/${userId}`, {
      headers: {
        'authorization': accessToken
      }
    }).then((res) => {
      return res.json()
    }).then(user => {
      this.setState({user:  user})
    }).catch(err => {
      console.log("Unsuccessfully fetching user on LeagueMatches page ", err)
    })
  }
  //Define your renderItem method the callback for the FlatList for rendering each item, and pass data as a argument.
  renderItem = ({ item }) => {
    return (
      <View style={styles.match}>
        <Text>
          Home Team: {item.HomeTeam}{"\n"}
          Away Team: {item.AwayTeam}{"\n"}
          Home Score: {item.HomeScore}{"\n"}
          Away Score: {item.AwayScore}{"\n"}
          Date: {item.Date}{"\n"}
        </Text>
        <Button
          onPress={() => { this.props.navigation.navigate('Match', { match: item, user: this.state.user }) }}
          title="Bet on Match" />
      </View>
    )
  }
  render() {
    const { matches, isLoading, isAuthorized } = this.state;
    if (!isLoading) {
      if (!isAuthorized) {
        return <Unauthorized />
      } else {
        return (
          <View style={styles.container}>
            <Text>League_Name Matches</Text>
            {matches.length > 0 ?
              <FlatList
                style={styles.matchList}
                data={matches}
                renderItem={(item) => this.renderItem(item)}
                keyExtractor={(item) => item.MatchID}
              />
              :
              <EmptyList value="matches" />
            }
          </View>
        )
      }
    } else {
      return <Loading />
    }
  }
}

const styles = StyleSheet.create({
  matchList: {
    width: '100%',
    marginTop: 20,
  },
  match: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  emptyComponent: {
    flex: 1,
    justifyContent: 'center',
  }
})