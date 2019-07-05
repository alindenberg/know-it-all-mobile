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
import EmptyList from './EmptyList'

export default class LeaderboardList extends React.Component {
    constructor(props) {
        super(props)
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
                                    title={`${index+1}) ${user.Username}`}
                                    rightTitle={`${user.Wins}-${user.Losses}`}
                                    onPress={() => this.props.navigation.navigate('UserProfile', { userId: user.UserID })}
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