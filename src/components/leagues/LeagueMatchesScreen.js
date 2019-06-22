import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Unauthorized from '../../components/unauthorized.js'
import EmptyList from '../../components/emptyList.js'
import Loading from '../../components/loading.js'
import AsyncStorage from '@react-native-community/async-storage';

export default class LeagueMatchesScreen extends React.Component {
  state = {
    matches: [],
    isLoading: true,
    isAuthorized: false
  }
  //Define your componentDidMount lifecycle hook that will retrieve data.
  async componentDidMount() {
    try {
      var accessToken = await AsyncStorage.getItem('accessToken')
      //Assign the promise unresolved first then get the data using the json method.
      const response = await fetch('http://localhost:8080/matches', {
        headers: {
          'authorization': accessToken
        }
      });
      if (response.status == 401) {
        this.setState({ matches: [], isLoading: false, isAuthorized: false })
      } else {
        var matches = await response.json()
        this.setState({ matches: matches, isLoading: false, isAuthorized: true });
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
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
          Match ID: {item.MatchID}{"\n"}
          Date: {item.Date}{"\n"}
        </Text>
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
      flex: 1,
      marginTop: 20,
  },
  match: {
      alignItems: 'center',
  },
  container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 50,
  },
  emptyComponent: {
    flex: 1,
    justifyContent: 'center',
  }
})