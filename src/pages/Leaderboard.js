import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { TabView, SceneMap } from 'react-native-tab-view';
import AsyncStorage from '@react-native-community/async-storage';
import LeaderboardList from '../components/LeaderboardList'
import base64 from 'base-64'
import { ActivityIndicator } from 'react-native-paper';

export default class Leaderboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            routes: [
                { key: 'first', title: 'Friends' },
                { key: 'second', title: 'Global' },
            ],
            isLoading: true,
            friendLeaderboard: [],
            globalLeaderboard: []
        }

        // Load access token, load global leaderboard, load friends leaderboard
        // get a better way to do this
        AsyncStorage.getItem('accessToken').then(accessToken => {
            var userId = JSON.parse(base64.decode(accessToken.split(".")[1])).sub
            fetch("http://localhost:8080/leaderboard", {
                // headers: {
                //     authorization: accessToken
                // },
                method: 'GET'
            }).then(res => {
                return res.json()
            }).then(leaderboard => {
                this.state.globalLeaderboard = leaderboard
                fetch(`http://localhost:8080/leaderboard/${userId}`, {
                    // headers: {
                    //     authorization: accessToken
                    // },
                    method: 'GET'
                }).then(res => {
                    return res.json()
                }).then(leaderboard => {
                    this.state.friendLeaderboard = leaderboard
                    console.log(this.state)
                    this.state.isLoading = false
                    this.setState(this.state)
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
            })
        })
    };

    render() {
        console.log("is loading : ", this.state.isLoading)
        if (this.state.isLoading) {
            console.log("Returning activity indicator")
            return <ActivityIndicator />
        }
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <TabView
                    style={{ marginTop: 20 }}
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <LeaderboardList data={this.state.friendLeaderboard} />,
                        second: () => <LeaderboardList data={this.state.globalLeaderboard} />,
                    })}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ height: 100, width: 100 }}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});