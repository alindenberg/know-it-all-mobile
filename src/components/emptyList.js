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
                <Text>No {this.props.value ? this.props.value : "items"} to display</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    emptyComponent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})