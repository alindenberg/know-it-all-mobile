import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button
} from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import AsyncStorage from '@react-native-community/async-storage'

export default class Match extends React.Component {
  constructor(props) {
    super(props)
    this.match = this.props.navigation.getParam("match")
    this.user = this.props.navigation.getParam("user")
    // Get YYYY-MM-DD array form of the match date
    this.matchDateArray = this.match.Date.split("T")[0].split("-"),

    this.modalOptions = [
      { label: this.match.HomeTeam + " wins", key: 0 },
      { label: this.match.AwayTeam + " wins", key: 1 },
      { label: "Draw", key: 2 }
    ]

    this.state = {
      hasMadeBet: false,
      prediction: -1,
      predictionIsSaved: true,
    }
  }

  async componentWillMount() {
    AsyncStorage.getItem("accessToken").then((token) => {
      this.setState({ accessToken: token })
    })
    var bet = null
    for (var i = 0; i < this.user.Bets.length; i++) {
      bet = this.user.Bets[i]
      if (bet.MatchID == this.match.MatchID) {
        this.setState({ prediction: bet.Prediction, hasMadeBet: true })
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.matchHeading}>
          <Text style={{ flex: 3, textAlign: 'center', fontSize: 24 }}>{this.match.HomeTeam}</Text>
          <Text style={{ flex: 1, textAlign: 'center' }}> vs </Text>
          <Text style={{ flex: 3, textAlign: 'center', fontSize: 24 }}>{this.match.AwayTeam}</Text>
        </View>
        <View style={{ flex: 4, alignItems: 'center' }}>
          <Text>{this.matchDateArray[1]}/{this.matchDateArray[2]}/{this.matchDateArray[0]}</Text>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 20 }}>
            <ModalSelector
              data={this.modalOptions}
              initValue={this.state.prediction > -1 ? this.modalOptions[this.state.prediction].label : 'Select Result'}
              labelExtractor={item => item.label}
              onChange={(option) => {
                if (option.key != this.state.prediction) {
                  this.setState({ prediction: option.key, predictionIsSaved: false })
                }
              }}
              animationType={'none'}
            />
            <Button
              title={this.state.hasMadeBet ? "Edit Bet" : "Save Bet"}
              onPress={this._onPredictionSaved}
              disabled={this.state.predictionIsSaved}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
            {this.state.hasMadeBet ? <Text>Edit your existing bet!</Text> : <Text>Create a new bet!</Text>}
          </View>
        </View>
      </View>
    )
  }

  _onPredictionSaved = async () => {
    await fetch(`http://localhost:8080/users/${this.user.UserID}/bets`, {
      method: 'POST',
      headers: {
        authorization: this.state.accessToken
      },
      body: JSON.stringify({
        matchId: this.match.MatchID,
        prediction: this.state.prediction
      })
    })
    this.updateLocalUserBet(this.match.MatchID, this.state.prediction)
    // mark prediction as saved to disable button
    this.setState({ predictionIsSaved: true })
  }

  // Update client side version of user bets array
  updateLocalUserBet = (matchId, prediction) => {
    if(this.state.hasMadeBet) {
      for (var i = 0; i < this.user.Bets.length; i++) {
        if (this.user.Bets[i].MatchID == matchId) {
          this.user.Bets[i].Prediction = prediction
        }
      }
    } else {
      this.user.Bets.push({MatchID: this.match.MatchID, Prediction: this.state.prediction})
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20
  },
  matchHeading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})