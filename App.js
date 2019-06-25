/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {createStackNavigator, createBottomTabNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import AllLeagueScreen from './src/pages/AllLeagueScreen.js'
import LeagueScreen from './src/pages/LeagueScreen.js'
import MatchScreen from './src/pages/Match.js'
import ProfileScreen from './src/pages/Profile.js'
import AuthLoadingScreen from './src/pages/AuthLoading.js'
import LoginScreen from './src/pages/Login.js'

const LeagueNavigator = createStackNavigator({
  AllLeagueScreen: {
    screen: AllLeagueScreen,
    navigationOptions: ({ navigation }) => ({
      title: `All Leagues`,
    }),
  },
  LeagueScreen: {
    screen: LeagueScreen,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.league.Name}`,
    }),
  },
  Match: {
    screen: MatchScreen,
    navigationOptions: ({ navigation }) => ({
      title: `Match`,
    }),
  },
}, {
  initialRouteName: 'AllLeagueScreen'
})

// Leaderboards | Leagues | Friends | Profile
const AppNavigator = createBottomTabNavigator({
  Profile: ProfileScreen,
  Leagues: LeagueNavigator
}, {
  initialRouteName: 'Profile',
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  },
});

const FullNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Login: LoginScreen,
  App: AppNavigator
}, {
  initialRouteName: 'AuthLoading'
})

export default createAppContainer(FullNavigator);
