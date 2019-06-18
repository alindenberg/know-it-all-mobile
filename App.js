/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import {createStackNavigator, createBottomTabNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import LeagueScreen from './src/components/leagues/LeagueScreen.js'
import LeagueMatchesScreen from './src/components/leagues/LeagueMatchesScreen.js'
import ProfileScreen from './src/components/users/ProfileScreen.js'
import AuthLoadingScreen from './src/pages/AuthLoading.js'
import LoginScreen from './src/pages/Login.js'
import SignUpScreen from './src/pages/SignUp'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const AppNavigator = createBottomTabNavigator({
  Profile: {
    screen: ProfileScreen
  },
  Leagues: {
    screen: LeagueScreen
  },
  LeagueMatches: {
    screen: LeagueMatchesScreen
  }
}, {
  // initialRouteName: 'Profile',
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  },
});

const AuthNavigator = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen,
  initialRouteName: 'Login'
})

const FullNavigator = createSwitchNavigator({
  AuthLoading: {
    screen: AuthLoadingScreen
  },
  Auth: AuthNavigator,
  App: AppNavigator
}, {
  initialRouteName: 'AuthLoading'
})

export default createAppContainer(FullNavigator);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
