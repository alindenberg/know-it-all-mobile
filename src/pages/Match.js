import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  Image
} from 'react-native'
import moment from 'moment'
import ModalSelector from 'react-native-modal-selector'
import AsyncStorage from '@react-native-community/async-storage'
import { SafeAreaView } from 'react-navigation';

export default class Match extends React.Component {
  constructor(props) {
    super(props)
    this.match = this.props.navigation.getParam("match")
    this.leagueId = this.props.navigation.getParam("leagueId")
    this.user = this.props.navigation.getParam("user")
    this.homeTeam = this.props.navigation.getParam("homeTeam")
    this.awayTeam = this.props.navigation.getParam("awayTeam")
    // Get YYYY-MM-DD array form of the match date
    this.matchDateArray = this.match.Date.split("T")[0].split("-"),

      this.modalOptions = [
        { label: this.homeTeam.Name + " Wins", key: 0 },
        { label: this.awayTeam.Name + " Wins", key: 1 },
        { label: "Draw", key: 2 }
      ]

    this.state = {
      canPlaceBet: this._canPlaceBet(this.match.Date),
      prediction: -1,
      betIndex: false,
      predictionIsSaved: true
    }
  }

  async componentDidMount() {
    accessToken = AsyncStorage.getItem("accessToken").then((token) => {
      var betIndex = -1
      var prediction = -1
      for (var index = 0; index < this.user.Bets.length; index++) {
        if (this.user.Bets[index].MatchID == this.match.MatchID) {
          betIndex = index
          prediction = this.user.Bets[index].Prediction
          break
        }
      }
      this.setState({ accessToken: token, betIndex: betIndex, prediction: prediction })
    })
  }

  render() {
    var bet = this.state.betIndex > -1 ? this.user.Bets[this.state.betIndex] : null
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.matchHeading}>
          <View style={styles.teamLogos}>
            <View style={styles.teamLogo}>
              <Image style={styles.logoImg} source={{ uri: this.homeTeam.LogoURL }}></Image>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}></View>
            <View style={styles.teamLogo}>
              <Image style={styles.logoImg} source={{ uri: this.awayTeam.LogoURL }}></Image>
            </View>
          </View>
          <View style={styles.teamNames}>
            <Text style={styles.teamName}>{this.homeTeam.Name}</Text>
            <Text style={{
              flex: 1,
              flexDirection: 'row',
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center'
            }}>vs</Text>
            <Text style={styles.teamName}>{this.awayTeam.Name}</Text>
          </View>
        </View>
        <View style={styles.scoreLineSection}>
          <Text style={styles.teamScore}>{this.match.HomeTeamScore}</Text>
          <Text style={styles.teamScore}>-</Text>
          <Text style={styles.teamScore}>{this.match.AwayTeamScore}</Text>
        </View>
        <View style={styles.matchDateSection}>
          <Text style={styles.betText}>{moment.utc(this.match.Date).format('MMMM Do, YYYY')}</Text>
        </View>
        <View style={styles.matchBetSection}>
          {this._getBetSection(bet)}
        </View>
      </SafeAreaView>
    )
  }
  _getBetSection = (bet) => {
    // We may place a new bet or modify our existing bet on this match
    if (this.state.canPlaceBet) {
      return (
        <View style={{ flexDirection: 'column',justifyContent: 'center', width: '100%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <ModalSelector
              data={this.modalOptions}
              initValue={this.state.prediction > -1 ? this.modalOptions[this.state.prediction].label : 'Place Bet'}
              labelExtractor={item => item.label}
              onChange={(option) => {
                if (option.key != this.state.prediction) {
                  this.setState({ prediction: option.key, predictionIsSaved: false })
                }
              }}
              style={{width: 300}}
              animationType={'none'}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Button
              title={"Save Bet"}
              onPress={this._onPredictionSaved}
              disabled={this.state.predictionIsSaved}
            />
          </View>
        </View>
      )
    }
    // We may not place a new bet
    // - If no bet was placed, display generic message
    // - If Bet was placed, display results
    return (
      <View style={{ flexDirection: 'column',justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {
          bet == null ?
          <Text style={{fontSize: 24}}>No bet was placed on match</Text>
          :
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{fontSize: 24}}>Bet: {this.modalOptions[bet.Prediction].label}</Text>
            <Text style={{marginTop: 10, fontSize: 24}}>Result: {this._getBetResult(bet)}</Text>
          </View>
        }
        </View>
    )
  }

  _canPlaceBet = (date) => {
    var utcNow = moment.utc()
    var matchUtc = moment.utc(date)

    if (matchUtc.isAfter(utcNow)) {
      return true
    }
    return false
  }
  _onPredictionSaved = () => {
    this.state.betIndex > -1 ? this.updateBet() : this.createBet()
    this.setState({ predictionIsSaved: true })
  }

  _getBetResult = (bet) => {
    var status = "Pending"
    if (bet.IsResolved) {
      if (bet.Won) {
        status = "Won"
      } else {
        status = "Lost"
      }
    }
    return status
  }

  updateBet() {
    fetch(`http://localhost:8080/users/${this.user.UserID}/bets/${this.match.MatchID}`, {
      method: 'POST',
      headers: {
        authorization: this.state.accessToken
      },
      body: JSON.stringify({
        prediction: this.state.prediction
      })
    }).then(() => {
      //update local user bet
      this.user.Bets[this.state.betIndex].Prediction = this.state.prediction
    })
  }

  createBet() {
    fetch(`http://localhost:8080/users/${this.user.UserID}/bets`, {
      method: 'POST',
      headers: {
        authorization: this.state.accessToken
      },
      body: JSON.stringify({
        MatchId: this.match.MatchID,
        LeagueId: this.leagueId,
        Prediction: this.state.prediction
      })
    }).then(bet => {
      //create local user bet
      this.user.Bets.push(bet)
      var betIndex = this.user.Bets.length - 1
      this.setState({ betIndex: betIndex })
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10
  },
  matchHeading: {
    flex: 1
  },
  teamLogos: {
    flex: 1,
    flexDirection: 'row'
  },
  teamLogo: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  logoImg: {
    height: 120,
    width: 120
  },
  teamNames: {
    flex: 1,
    flexDirection: 'row'
  },
  teamName: {
    flex: 3,
    flexDirection: 'row',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 28,
  },
  teamScore: {
    fontSize: 40,
    marginTop: 20
  },
  scoreLineSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  matchBetSection: {
    flex: 1,
    flexDirection: 'row'
  },
  betText: {
    fontSize: 24
  },
  matchDateSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})