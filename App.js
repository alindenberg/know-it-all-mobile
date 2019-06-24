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
import LeagueScreen from './src/pages/LeagueScreen.js'
import LeagueMatchesScreen from './src/pages/LeagueMatchesScreen.js'
import MatchScreen from './src/pages/Match.js'
import ProfileScreen from './src/pages/Profile.js'
import AuthLoadingScreen from './src/pages/AuthLoading.js'
import LoginScreen from './src/pages/Login.js'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const MatchesNavigator = createStackNavigator({
  MatchList: LeagueMatchesScreen,
  Match: MatchScreen
})

const AppNavigator = createBottomTabNavigator({
  Profile: {
    screen: ProfileScreen
  },
  Leagues: {
    screen: LeagueScreen
  },
  Matches: MatchesNavigator
}, {
  initialRouteName: 'Profile',
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  },
});

const FullNavigator = createSwitchNavigator({
  AuthLoading: {
    screen: AuthLoadingScreen
  },
  Login: LoginScreen,
  App: AppNavigator
}, {
  initialRouteName: 'AuthLoading'
})

export default createAppContainer(FullNavigator);
