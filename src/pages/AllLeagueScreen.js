import React from 'react';
import { Icon } from 'react-native-elements';
import { Text, View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

  goToLeague = (navigation, league) => {
    navigation.navigate("LeagueScreen", { league: league })
  }
  //Define your renderItem method the callback for the FlatList for rendering each item, and pass data as a argument.
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => { this.goToLeague(this.props.navigation, item) }}
        style={{
          flexDirection: 'row',
          padding: 5,
          borderBottomWidth: 1
        }}>
        <View style={{ justifyContent: 'flex-start', marginLeft: 10 }}>
          <Text style={{ fontSize: 20 }}>{item.Name}</Text>
          <Text style={{ fontSize: 12 }}>{item.Country}, Division {item.Division}</Text>
        </View>
        <View style={styles.iconStyle}>
          <Icon
            size={34}
            name="angle-right"
            type="font-awesome"
            color='#5388d0'>
          </Icon>
        </View>
      </TouchableOpacity>
    )
  }
  render() {
    const { leagues, isLoading } = this.state;
    if (!isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <FlatList
            style={{ width: '100%', borderTopWidth: 1 }}
            data={leagues}
            renderItem={(item) => this.renderItem(item)}
            keyExtractor={(item) => item.LeagueID}
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

const styles = StyleSheet.create({
  iconStyle: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 10,
    alignSelf: 'center',
    justifyContent: 'flex-end'
  }
})
