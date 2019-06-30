import React from 'react'
import {
    View,
    Text,
    FlatList
} from 'react-native'
import EmptyList from './EmptyList'


export default class LeaderboardList extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }

    renderItem = ({ item }) =>  {
        console.log("item is ", item)
        return (
            <View style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1}}>
                <View style={{flexDirection: 'column'}}>
                    <Text>{item.Email}</Text>
                    <Text>{item.Wins}</Text>
                    <Text>{item.Losses}</Text>
                    <Text>{item.WinPercentage}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View>
                {this.props.data.length > 0 ?
                    <FlatList
                        style={{ width: '100%'}}
                        data={this.props.data}
                        renderItem={(item) => this.renderItem(item)}
                        keyExtractor={(item) => item.UserID}
                    />
                    :
                    <EmptyList value="friends" />
                }
            </View>
        )
    }
}