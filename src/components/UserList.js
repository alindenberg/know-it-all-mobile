import React from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import EmptyList from './EmptyList'

export default class UserList extends React.Component {
    constructor(props) {
        super(props)
    }

    renderItem = ({ index, item }) => {
        return (
            <TouchableOpacity onPress={() => {this.props.navigation.navigate('Profile')}}style={styles.itemStyle}>
                <Text style={{fontSize: 14}}>#{index + 1})</Text>
                <Text style={{ fontSize: 14, flex: 3, marginLeft: 10 }}>{item.Email}</Text>
                <Text style={{ fontSize: 14, flex: 3, marginLeft: 10 }}>{item.Wins}-{item.Losses}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View>
                {this.props.data.length > 0 ?
                    <FlatList
                        style={{ width: '100%' }}
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

const styles = StyleSheet.create({
    itemStyle: {
        padding: 5,
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 1
    }
})