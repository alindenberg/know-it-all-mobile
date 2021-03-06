import React from 'react';
import { TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Card, ListItem } from 'react-native-elements'
import Loading from '../components/Loading';

export default class LeagueScreen extends React.Component {
  state = {
    leagues: [],
    //Have a loading state where when data retrieve returns data.
    isLoading: true
  }

  async componentDidMount() {
    fetch('http://localhost:8080/leagues').then(res => {
      return res.json()
    }).then(leagues => {
      this.setState({ leagues: leagues, isLoading: false });
    }).catch(err => {
      this.setState({ isLoading: false });
    })
  }
  render() {
    if (this.state.isLoading) {
      return <Loading />
    }
    return (
      <ScrollView>
        {this.state.leagues.map((league, index) => {
          return (
            <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("LeagueScreen", { league: league })}>
              <Card key={index}>
                <ListItem
                  key={index}
                  title={league.Name}
                  leftAvatar={{ source: { uri: league.LogoURL }, size: 'large', rounded: false }}
                />
              </Card>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  iconStyle: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 10,
    alignSelf: 'center',
    justifyContent: 'flex-end'
  }
})
