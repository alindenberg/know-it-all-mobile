import React from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import {
    Card,
    ListItem
} from 'react-native-elements'
import base64 from 'base-64'
import EmptyList from './EmptyList'
import AsyncStorage from '@react-native-community/async-storage';

export default class LeaderboardList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            accessToken: null,
            loggedInUserId: null
        }
    }

    async componentDidMount() {
        await AsyncStorage.getItem('accessToken').then(token => {
            this.setState({ accessToken: token, loggedInUserId: JSON.parse(base64.decode(token.split('.')[1])).sub })
        })
    }
    render() {
        return (
            <ScrollView>
                {this.props.data.length > 0 ?
                    this.props.data.map((user, index) => {
                        return (
                            <Card key={index} containerStyle={{ padding: 0 }} >
                                <ListItem
                                    key={index}
                                    title={`${index + 1}) ${user.Username}`}
                                    rightTitle={`${user.Wins}-${user.Losses}`}
                                    onPress={() => {
                                        console.log("LOGGED IN ID ", this.state.loggedInUserId)
                                        console.log("USER ID ", user.UserID)
                                        if (this.state.loggedInUserId == user.UserID) {
                                            this.props.navigation.navigate('Profile')
                                        } else {
                                            this.props.navigation.navigate('FriendProfile', { userId: user.UserID })
                                        }
                                    }}
                                />
                            </Card>
                        );
                    })
                    :
                    <EmptyList value="users" />
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    itemStyle: {
        padding: 5,
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 1
    }
})