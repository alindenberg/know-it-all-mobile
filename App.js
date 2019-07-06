import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import AllLeagueScreen from './src/pages/AllLeagueScreen.js'
import LeagueScreen from './src/pages/LeagueScreen.js'
import MatchScreen from './src/pages/Match.js'
import ProfileScreen from './src/pages/Profile.js'
import LeaderboardScreen from './src/pages/Leaderboard.js'
import AuthLoadingScreen from './src/pages/AuthLoading.js'
import LoginScreen from './src/pages/Login.js'
import SettingsScreen from './src/pages/SettingsScreen.js';
import SignupScreen from './src/pages/SignupScreen.js';

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

const ProfileNavigator = createStackNavigator({
  Profile: ProfileScreen,
  Match: MatchScreen,
  Settings: {
    screen: SettingsScreen,
    navigationOptions: () => ({
      title: `Settings`,
    })
  }
}, {
  initialRouteName: 'Profile'
})

const LeaderboardNavigator = createStackNavigator({
  Leaderboard: LeaderboardScreen,
  UserProfile: ProfileScreen,
  Match: MatchScreen
}, {
  initialRouteName: 'Leaderboard'
})

// Leaderboards | Leagues | Friends | Profile
const AppNavigator = createBottomTabNavigator({
  Profile: ProfileNavigator,
  Leaderboard: LeaderboardNavigator,
  Leagues: LeagueNavigator
}, {
  initialRouteName: 'Profile',
  tabBarOptions: {
    activeTintColor: '#007AFF',
    inactiveTintColor: 'gray',
  },
});

const LoginNavigator = createSwitchNavigator({
  Login: LoginScreen,
  Signup: SignupScreen
}, {
  initialRouteName: 'Login'
})
const FullNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Login: LoginNavigator,
  App: AppNavigator
}, {
  initialRouteName: 'AuthLoading'
})

export default createAppContainer(FullNavigator);
