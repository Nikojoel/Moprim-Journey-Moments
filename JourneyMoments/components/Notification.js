import React from "react"
import {View, Text, StyleSheet} from 'react-native'

const Notification = ({message}) => {
    if (message === null) return null

    return (
        <View style={styles.container}>
            <Text style={styles.error}>{message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    error: {
        fontSize: 18,
        color: 'red'
    },
    container: {
        marginBottom: 5,
    }
})

export default Notification
