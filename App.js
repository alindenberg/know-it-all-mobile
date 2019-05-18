/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

class LeaguesScreen extends React.Component {
  state = {
      leagues: [],
      //Have a loading state where when data retrieve returns data.
      loading: true
  }
  //Define your componentDidMount lifecycle hook that will retrieve data.
  //Also have the async keyword to indicate that it is asynchronous.
  async componentDidMount() {
      //Have a try and catch block for catching errors.
      try {
          //Assign the promise unresolved first then get the data using the json method.
          const leaguesApiCall = await fetch('http://localhost:8080/leagues');
          const leagues = await leaguesApiCall.json();
          this.setState({leagues: leagues, loading: false});
      } catch(err) {
          console.log("Error fetching data-----------", err);
      }
  }
  //Define your renderItem method the callback for the FlatList for rendering each item, and pass data as a argument.
  renderItem(data) {
      return (
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                      <Text>{data.LeagueID}</Text>
                      <Text>{data.Name}</Text>
                      <Text>{data.Country}</Text>
                      <Text>{data.Division}</Text>
                  </View>
              )
  }
  render() {
    console.log("state")
    console.log(this.state)
      const { leagues, loading } = this.state;
      //If laoding to false, return a FlatList which will have data, rednerItem, and keyExtractor props used.
      //Data contains the data being  mapped over.
      //RenderItem a callback return UI for each item.
      //keyExtractor used for giving a unique identifier for each item.
      if(!loading) {
          return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <FlatList
                  data={leagues}
                  renderItem={({ item }) => (
                    <View>
                    <Text>{ item.Country }</Text>
                    <Text>{ item.LeagueID }</Text>
                    <Text>{ item.Division }</Text>
                    <Text>{ item.Name }</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.Name}
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
//
// class HomeScreen extends React.Component {
//   static navigationOptions = {
//     title: 'Welcome',
//   };
//   render() {
//     const {navigate} = this.props.navigation;
//     return (
//       <Button
//         title="Go to Jane's profile"
//         onPress={() => navigate('Default')}
//       />
//     );
//   }
// }
//
// const navigation = {
//   Home: {screen: HomeScreen},
//   Default: {screen: DefaultScreen}
// };
// const MainNavigator = createStackNavigator(navigation);
// const AppContainer = createAppContainer(mainNavigator);
//
// export default class App extends React.Component {
//   render() {
//     return <AppContainer />;
//   }
// }

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Leagues"
          onPress={() => this.props.navigation.navigate('Leagues')}
        />
      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  Leagues: {
    screen: LeaguesScreen
  }
});

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
