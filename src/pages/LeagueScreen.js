import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, FlatList } from 'react-native';
import { Icon } from 'react-native-elements'
import Unauthorized from '../components/Unauthorized'
import EmptyList from '../components/EmptyList'
import Loading from '../components/Loading'
import AsyncStorage from '@react-native-community/async-storage';
import base64 from 'base-64'

export default class LeagueScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      isLoading: true,
      leagueTeams: []
    }
    this.league = props.navigation.getParam('league')
  }
  //Define your componentDidMount lifecycle hook that will retrieve data.
  async componentDidMount() {
    var accessToken = await AsyncStorage.getItem('accessToken')

    // Pre-fetch all teams in the league so we can render their names / logos for the match list
    // without needing to fetch them individually each time
    await fetch(`http://localhost:8080/leagues/${this.league.LeagueID}/teams`, {
      headers: {
        'authorization': accessToken
      }
    }).then(res => {
      console.log(res)
      return res.json()
    }).then(teams => {
      this.setState({ leagueTeams: teams })
    }).catch(err => {
      console.log("Error fetching league teams : ", err)
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
      this.setState({ user: user, isLoading: false })
    }).catch(err => {
      console.log("Unsuccessfully fetching user on LeagueMatches page ", err)
    })
  }

  goToMatch = (navigation, match, homeTeam, awayTeam) => {
    navigation.navigate('Match', {
      match: match,
      leagueId: this.league.LeagueID,
      user: this.state.user,
      homeTeam: homeTeam,
      awayTeam: awayTeam
    })
  }

  getTeam = (teamId) => {
    for (var i = 0; i < this.state.leagueTeams.length; i++) {
      if (this.state.leagueTeams[i].TeamID == teamId) {
        return this.state.leagueTeams[i]
      }
    }
    return null
  }
  //Define your renderItem method the callback for the FlatList for rendering each item, and pass data as a argument.
  renderMatch = ({ item }) => {
    var homeTeam = this.getTeam(item.HomeTeamID)
    var awayTeam = this.getTeam(item.AwayTeamID)
    if (homeTeam == null || awayTeam == null) {
      return null
    }
    return (
      <View style={{ flex: 1, flexDirection: 'row', padding: 5, borderBottomWidth: 1 }}>
        <View style={{ flex: 9 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text style={{ fontSize: 20, fontStyle: 'italic' }}>{homeTeam.Name}</Text>
            <Text style={{ fontSize: 20 }}> vs </Text>
            <Text style={{ fontSize: 20, fontStyle: 'italic' }}>{awayTeam.Name}</Text>
          </View>
          <Text style={{ fontSize: 12, fontStyle: 'italic' }}>{item.Date.split("T")[0]}</Text>
        </View>
        <View style={styles.iconView}>
          <Icon
            size={34}
            name="angle-right"
            type="font-awesome"
            color='#5388d0'
            onPress={() => { this.goToMatch(this.props.navigation, item, homeTeam, awayTeam) }}>
          </Icon>
        </View>
      </View>
    )
  }
  render() {
    var matches = this.league.UpcomingMatches
    if (matches == null) {
      matches = []
    }
    if (!this.state.isLoading) {
      // if (!isAuthorized) { 
      //   return <Unauthorized />
      // } else {
      return (
        <View style={styles.container}>
          {matches.length > 0 ?
            <FlatList
              style={styles.matchList}
              data={matches}
              renderItem={(match) => this.renderMatch(match)}
              keyExtractor={(item) => item.MatchID}
            />
            :
            <EmptyList value="matches" />
          }
        </View>
      )
      // }
    } else {
      return <Loading />
    }
  }
}

const styles = StyleSheet.create({
  matchList: {
    width: '100%'
  },
  match: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  emptyComponent: {
    flex: 1,
    justifyContent: 'center',
  },
  iconView: {
    flex: 1,
    marginRight: 10,
    alignSelf: 'center'
  }
})