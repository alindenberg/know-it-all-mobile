import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';

export default class LeagueMatchesScreen extends React.Component {
  state = {
      matches: [],
      //Have a loading state where when data retrieve returns data.
      isLoading: true
  }
  //Define your componentDidMount lifecycle hook that will retrieve data.
  //Also have the async keyword to indicate that it is asynchronous.
  async componentDidMount() {
      // const { navigation } = this.props;
      // const id = navigation.getParam('id', 'NO-ID');
      //Have a try and catch block for catching errors.
      try {
          //Assign the promise unresolved first then get the data using the json method.
          const matchesApiCall = await fetch('http://localhost:8080/matches');
          const matches = await matchesApiCall.json();
          this.setState({matches: matches, isLoading: false});
      } catch(err) {
          console.log("Error fetching data-----------", err);
      }
  }
  //Define your renderItem method the callback for the FlatList for rendering each item, and pass data as a argument.
  renderItem = ({item}) => {
      return (
        <View style={{
          flexDirection: 'row',
          height: 100,
        }}>
          <Text>
          Home Team: { item.HomeTeam }{"\n"}
          Away Team: { item.AwayTeam }{"\n"}
          Home Score: { item.HomeScore }{"\n"}
          Away Score: { item.AwayScore }{"\n"}
          Match ID: { item.MatchID }{"\n"}
          Date: { item.Date }{"\n"}
          </Text>
        </View>
      )
  }
  render() {
    const { matches, isLoading } = this.state;
    if(!isLoading) {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <FlatList
                data={matches}
                renderItem={(item) => this.renderItem(item)}
                keyExtractor={(item) => item.MatchID}
            />
            <Text>League Screen</Text>
            <Button
              title="Go to Home"
              onPress={() => this.props.navigation.navigate('Home')}
            />
          </View>
        )
    } else {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
          </View>
        )
    }
  }
}
