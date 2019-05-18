import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';

export default class LeagueScreen extends React.Component {
  state = {
      leagues: [],
      //Have a loading state where when data retrieve returns data.
      isLoading: true
  }
  //Define your componentDidMount lifecycle hook that will retrieve data.
  //Also have the async keyword to indicate that it is asynchronous.
  async componentDidMount() {
      //Have a try and catch block for catching errors.
      try {
          //Assign the promise unresolved first then get the data using the json method.
          const leaguesApiCall = await fetch('http://localhost:8080/leagues');
          const leagues = await leaguesApiCall.json();
          this.setState({leagues: leagues, isLoading: false});
      } catch(err) {
          console.log("Error fetching data-----------", err);
      }
  }
  //Define your renderItem method the callback for the FlatList for rendering each item, and pass data as a argument.
  renderItem = ({item}) => {
      return (
        <View style={{
          flexDirection: 'row',
          height: 100
        }}>
          <Text>
          League Name: { item.Name }{"\n"}
          League Country: { item.Country }{'\n'}
          League Division: { item.Division }{'\n'}
          </Text>
          <Button
            title="View matches"
            onPress={() => this.props.navigation.navigate('LeagueMatches', {id: item.LeagueID})}
          />
        </View>
      )
  }
  render() {
      const { leagues, isLoading } = this.state;
      if(!isLoading) {
          return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 200 }}>
              <FlatList
                  data={leagues}
                  renderItem={(item) => this.renderItem(item)}
                  keyExtractor={(item) => item.LeagueID}
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
