import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button
} from 'react-native'
import base64 from 'base-64'
import ModalSelector from 'react-native-modal-selector'
import AsyncStorage from '@react-native-community/async-storage'

export default class Match extends React.Component {
  constructor(props) {
    super(props)
    const match = this.props.navigation.getParam("match")
    this.state = {
      accessToken: null,
      userId: null,
      match: match,
      matchDateArray: match.Date.split("T")[0].split("-"),
      prediction: -1,
      predictionIsSaved: true
    }
  }

  async componentDidMount() {
    AsyncStorage.getItem("accessToken").then((token) => {
      const userId = JSON.parse(base64.decode(token.split('.')[1])).sub
      this.setState({userId: userId, accessToken: token})
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.matchHeading}>
          <Text style={{ flex: 3, textAlign: 'center', fontSize: 24 }}>{this.state.match.HomeTeam}</Text>
          <Text style={{ flex: 1, textAlign: 'center' }}> vs </Text>
          <Text style={{ flex: 3, textAlign: 'center', fontSize: 24 }}>{this.state.match.AwayTeam}</Text>
        </View>
        <View style={{ flex: 4, alignItems: 'center' }}>
          <Text>{this.state.matchDateArray[1]}/{this.state.matchDateArray[2]}/{this.state.matchDateArray[0]}</Text>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 20 }}>
            <ModalSelector
              data={
                [
                  { label: this.state.match.HomeTeam + " wins", key: 0 },
                  { label: this.state.match.AwayTeam + " wins", key: 1 },
                  { label: "Draw", key: 2 }
                ]
              }
              initValue={'Select Result'}
              labelExtractor={item => item.label}
              onChange={(option) => {
                var isNewPrediction = true
                if(option.key == this.state.prediction) {
                  isNewPrediction = false
                }
                this.setState({ prediction: option.key, predictionIsSaved: !isNewPrediction})
              }}
              animationType={'none'}
            />
            <Button
              title="Save Prediction"
              onPress={this._onPredictionSaved}
              disabled={this.state.predictionIsSaved}
            />
          </View>
        </View>
      </View>
    )
  }

  _onPredictionSaved = async () => {
    const result = await fetch(`http://localhost:8080/users/${this.state.userId}/bets`, {
      method: 'POST',
      headers: {
        authorization: this.state.accessToken
      },
      body: JSON.stringify({
        matchId: this.state.match.MatchID,
        prediction: this.state.prediction
      })
    })
    console.log("Result ", result)
    this.setState({ predictionIsSaved: true })
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