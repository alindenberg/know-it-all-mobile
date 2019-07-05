import React from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native'
import { Card, ListItem } from 'react-native-elements'
import EmptyList from './EmptyList'
import AsyncStorage from '@react-native-community/async-storage';
import Loading from './Loading';

var moment = require('moment');

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

            await Promise.all(requests).finally(() => {
                // sort bets from future -> past
                var sortedBets = this.state.bets.sort(function (bet1, bet2) {
                    var date1 = moment.utc(bet1.match.Date)
                    var date2 = moment.utc(bet2.match.Date)
                    return (date1 > date2 ? -1 : (date1 < date2 ? 1 : 0));
                })

                this.state.bets = sortedBets
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

    render() {
        if (this.state.isLoading) {
            return <Loading />
        }
        return (
            <ScrollView style={{ width: '100%', height: '100%' }}>
                {this.state.bets.map((bet, index) => {
                    return (
                        <Card containerStyle={{ padding: 0}} key={index}>
                            <ListItem
                                key={index}
                                title={
                                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                        <Text style={{fontSize: 24, textAlign: 'center'}}>{bet.match.HomeTeamScore} - {bet.match.AwayTeamScore}</Text>
                                        <Text style={{fontSize: 12, paddingBottom: 0}}>Bet: {this.getBetResult(bet)}</Text>
                                    </View>
                                }
                                contentContainerStyle={{ alignItems: 'center' }}
                                leftAvatar={{ source: { uri: bet.homeTeam.LogoURL }, size: 'large', rounded: false, overlayContainerStyle: { backgroundColor: 'white' } }}
                                rightAvatar={{ source: { uri: bet.awayTeam.LogoURL }, size: 'large', rounded: false, overlayContainerStyle: { backgroundColor: 'white' } }}
                                onPress={() => this.goToMatch(bet, bet.match, bet.homeTeam, bet.awayTeam)}
                            />
                        </Card>
                    )
                })}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    itemStyle: {
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 1
    },
    image: {
        height: 75,
        width: 75
    },
    itemSection: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center'
    }
})