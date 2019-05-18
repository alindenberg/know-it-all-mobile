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
import LeaguesScreen from './components/leagues/LeagueScreen.js'
import LeagueMatchesScreen from './components/matches/LeagueMatchesScreen.js'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};


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
  },
  LeagueMatches: {
    screen: LeagueMatchesScreen
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
