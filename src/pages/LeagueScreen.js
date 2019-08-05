import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, ListItem } from 'react-native-elements'
import Loading from '../components/Loading'
import AsyncStorage from '@react-native-community/async-storage';
import base64 from 'base-64'
import { TouchableOpacity } from 'react-native-gesture-handler';
import EmptyList from '../components/EmptyList';

var moment = require('moment')
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
    var teamPromise = fetch(`http://localhost:8080/teams?leagueId=${this.league.LeagueID}`, {
      headers: {
        'authorization': accessToken
      }
    }).then(res => {
      return res.json()
    }).then(teams => {
      this.setState({ leagueTeams: teams })
    }).catch(err => {
      console.log("Error fetching league teams : ", err)
    })

    // get upcoming matches
    var upcomingMatchesPromise = fetch(`http://localhost:8080/matches?leagueId=${this.league.LeagueID}&excludePast=true`, {
      headers: {
        'authorization': accessToken
      }
    }).then(res => {
      return res.json()
    }).then(matches => {
      matches = matches == null ? [] : matches
      this.setState({ matches: matches })
    }).catch(err => {
      console.log("Error fetching league matches : ", err)
    })
    // fetch user in the background
    var userId = JSON.parse(base64.decode(accessToken.split(".")[1])).sub
    var userPromise = fetch(`http://localhost:8080/users/${userId}`, {
      headers: {
        'authorization': accessToken
      }
    }).then((res) => {
      return res.json()
    }).then(user => {
      this.setState({ user: user })
    }).catch(err => {
      console.log("Unsuccessfully fetching user on LeagueMatches page ", err)
    })

    console.log("Declared all promises")
    Promise.all([teamPromise, upcomingMatchesPromise, userPromise]).then(() => {
      console.log("All league screen promises have resolved", this.state)
      this.setState({ isLoading: false })
    }).catch(err => {
      console.log("error resolving league screen promises ", err)
    })
  }

  goToMatch = (match, homeTeam, awayTeam) => {
    this.props.navigation.navigate('Match', {
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
  render() {
    if (this.state.isLoading) {
      return <Loading />
    }
    else if (this.state.matches.length == 0) {
      return <EmptyList value="upcoming matches" />
    }
    return (
      <ScrollView style={{ width: '100%', height: '100%' }}>
        {this.state.matches.map((match, index) => {
          var homeTeam = this.getTeam(match.HomeTeamID)
          var awayTeam = this.getTeam(match.AwayTeamID)
          if (homeTeam == null || awayTeam == null) {
            return null
          }
          return (
            <TouchableOpacity key={index} onPress={() => this.goToMatch(match, homeTeam, awayTeam)}>
              <Card key={index}>
                <ListItem
                  key={index}
                  contentContainerStyle={{ alignItems: 'center' }}
                  leftAvatar={{ source: { uri: homeTeam.LogoURL }, subtitle: 'Chelsea', size: 'large', rounded: false, overlayContainerStyle: { backgroundColor: 'white' } }}
                  rightAvatar={{ source: { uri: awayTeam.LogoURL }, size: 'large', rounded: false, overlayContainerStyle: { backgroundColor: 'white' } }}
                  title={
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={{ textAlign: 'center' }}>{homeTeam.Name}</Text>
                      <Text style={{ fontSize: 8, textAlign: 'center', marginBottom: 5, marginTop: 5 }}>VS</Text>
                      <Text style={{ textAlign: 'center' }}>{awayTeam.Name}</Text>
                      <Text style={{ fontSize: 8, marginTop: 10 }}>{moment.utc(match.Date).format("MMMM Do, YYYY")}</Text>
                    </View>
                  }
                />
              </Card>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    )
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
  },
  teamName: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center'
  }
})