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
    }
    this.league = props.navigation.getParam('league')
    console.log("League is ", this.league)
  }
  //Define your componentDidMount lifecycle hook that will retrieve data.
  async componentWillMount() {
    var accessToken = await AsyncStorage.getItem('accessToken')

    // await fetch('http://localhost:8080/matches', {
    //   headers: {
    //     'authorization': accessToken
    //   }
    // }).then(matchesResponse => {
    //   if (matchesResponse.status == 401) {
    //     this.setState({ matches: [], isLoading: false, isAuthorized: false })
    //   } else {
    //     matchesResponse.json().then(matches => {
    //       this.setState({ matches: matches, isLoading: false, isAuthorized: true });
    //     })
    //   }
    // })

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

  goToMatch = (navigation, match) => {
    navigation.navigate('Match', { match: match, user: this.state.user })
  }
  //Define your renderItem method the callback for the FlatList for rendering each item, and pass data as a argument.
  renderItem = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', padding: 5, borderBottomWidth: 1 }}>
        <View style={{ justifyContent: 'flex-start', marginLeft: 10 }}>
          <Text style={{ fontSize: 24 }}>{item.HomeTeam} vs {item.AwayTeam}</Text>
          <Text style={{fontSize: 12, fontStyle: 'italic'}}>{item.Date.split("T")[0]}</Text>
        </View>
        <View style={styles.iconView}>
          <Icon
            size={34}
            name="angle-right"
            type="font-awesome"
            color='#5388d0'
            onPress={() => { this.goToMatch(this.props.navigation, item) }}>
          </Icon>
        </View>
      </View>
    )
  }
  render() {
    const matches = this.league.Matches
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
              renderItem={(item) => this.renderItem(item)}
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,
    alignSelf: 'center'
  }
})