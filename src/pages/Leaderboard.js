import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import AsyncStorage from '@react-native-community/async-storage';
import LeaderboardList from '../components/LeaderboardList'
import base64 from 'base-64'
import Loading from '../components/Loading';

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
                headers: {
                    authorization: accessToken
                },
                method: 'GET'
            }).then(res => {
                return res.json()
            }).then(leaderboard => {
                this.state.globalLeaderboard = leaderboard
                fetch(`http://localhost:8080/leaderboard/${userId}`, {
                    headers: {
                        authorization: accessToken
                    },
                    method: 'GET'
                }).then(res => {
                    return res.json()
                }).then(leaderboard => {
                    this.state.friendLeaderboard = leaderboard
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
        if (this.state.isLoading) {
            return <Loading />
        }
        return (
            <View style={{ flex: 1 }}>
                <TabView
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: 'black' }}
                            style={{ backgroundColor: 'white' }}
                            renderLabel={({ route, index }) => {
                                return (
                                    <View style={{ height: 30 }}>
                                        <Text style={{ color: 'black', textAlign: 'center' }}>{route.title}</Text>
                                    </View>
                                )
                            }}
                        />
                    }
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: () => <LeaderboardList navigation={this.props.navigation} data={this.state.friendLeaderboard} />,
                        second: () => <LeaderboardList navigation={this.props.navigation} data={this.state.globalLeaderboard} />,
                    })}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ height: 100, width: 100 }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});