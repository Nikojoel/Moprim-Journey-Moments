import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Helper from "../helpers/Helper";

const FootPrint = ({data}) => {
    const date = data.date
    const co2 = data.co2
    const type = data.originalActivity

    return (
        <View style={styles.text}>
            <Text>Date: {date}</Text>
            <Text>Emissions: {co2}</Text>
            <Text>Type: {type}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    text: {
        marginBottom: 20,
        marginTop: 20
    },
})
export default FootPrint
