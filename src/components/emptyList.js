import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

export default class EmptyList extends React.Component {
    render() {
        return (
            <View style={styles.emptyComponent}>
                <Text>No matches to display</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    emptyComponent: {
        flex: 1,
        justifyContent: 'center',
    }
})