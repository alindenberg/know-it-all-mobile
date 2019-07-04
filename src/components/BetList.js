import React from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native'
import { ListItem } from 'react-native-elements'
import base64 from 'base-64'
import EmptyList from './EmptyList'
import AsyncStorage from '@react-native-community/async-storage';
import Loading from './Loading';

export default class BetList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            bets: this.props.bets ? this.props.bets : [],
            user: this.props.user
        }
    }

    async componentDidMount() {
        AsyncStorage.getItem('accessToken').then(async accessToken => {
            // load matches for bets, append to bet object
            var requests = []
            for (var index = 0; index < this.state.bets.length; index++) {
                var promise = this.getInfoForBet(accessToken, index)
                requests.push(promise)
            }

            await Promise.all(requests).then(() => {
                this.state.isLoading = false
                this.setState(this.state)
            }).catch(err => {
                this.state.isLoading = false
                this.setState(this.state)
            })
        })
    }

    async getInfoForBet(accessToken, index) {
        var requests = []
        // Get match
        var match = await fetch(`http://localhost:8080/leagues/${this.state.bets[index].LeagueID}/matches/${this.state.bets[index].MatchID}`, {
            headers: {
                authorization: accessToken,
                contentType: 'application/json'
            }
        }).then(res => res.json()).then(match => match)

        this.state.bets[index].match = match

        // Get home team
        var homeTeamRequest = fetch(`http://localhost:8080/teams/${match.HomeTeamID}`, {
            headers: {
                authorization: accessToken,
                contentType: 'application/json'
            }
        }).then(res => res.json()).then(team => {
            this.state.bets[index].homeTeam = team
        })

        // Get away team
        var awayTeamRequest = fetch(`http://localhost:8080/teams/${match.AwayTeamID}`, {
            headers: {
                authorization: accessToken,
                contentType: 'application/json'
            }
        }).then(res => res.json()).then(team => {
            this.state.bets[index].awayTeam = team
        })

        requests.push(homeTeamRequest, awayTeamRequest)

        return Promise.all(requests)
    }

    getBetResult(bet) {
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

    goToMatch(bet, match, homeTeam, awayTeam) {
        this.props.navigation.navigate('Match', {
            match: match,
            leagueId: bet.LeagueID,
            user: this.state.user,
            homeTeam: homeTeam,
            awayTeam: awayTeam
        })
    }

    renderItem = ({ index, item }) => {
        var bet = item
        return (
                <TouchableOpacity style={styles.itemStyle} onPress={() => this.goToMatch(bet, bet.match, bet.homeTeam, bet.awayTeam)}>
                    <View style={styles.itemSection}>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Image style={styles.image} source={{ uri: bet.homeTeam.LogoURL }}></Image>
                            <Text style={{fontSize: 20}}>{bet.homeTeam.Name}</Text>
                        </View>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                            {bet.IsResolved ? 
                                <Text style={{alignSelf: 'center', fontSize: 20}}>{bet.match.HomeTeamScore} - {bet.match.AwayTeamScore}</Text>
                            : 
                                <Text style={{alignSelf: 'center', fontSize: 20}}>vs</Text> 
                            }
                            <Text style={{alignSelf: 'center', fontSize: 14}}>Bet: {this.getBetResult(bet)}</Text>
                        </View>
                    </View>
                    <View style={styles.itemSection}>
                        <View style={{ flexDirection: 'column' }}>
                            <Image style={styles.image} source={{ uri: bet.awayTeam.LogoURL }}></Image>
                            <Text style={{fontSize: 20}}>{bet.awayTeam.Name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
        )
    }

    render() {
        if (this.state.isLoading) {
            return <Loading />
        }
        return (
            <View style={{ width: '100%', height: '100%'}}>
                {this.state.bets.length > 0 ?
                    <FlatList
                        style={{ width: '100%', borderTopWidth: 1, flex: 1 }}
                        data={this.state.bets}
                        renderItem={(item) => this.renderItem(item)}
                        keyExtractor={(item) => item.MatchID}
                    />
                    :
                    <EmptyList value="friends" />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemStyle: {
        flexDirection: 'row' ,
        flex: 1,
        borderBottomWidth: 1
    },
    image: {
        height: 75,
        borderRadius: 40,
        width: 75
    },
    itemSection: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center'
    }
})