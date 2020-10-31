import React from "react"
import {View, Text} from 'react-native'

const Notification = ({message}) => {
    if (message === null) return null

    return (
        <View>
            <Text>{message}</Text>
        </View>
    )
}

export default Notification
