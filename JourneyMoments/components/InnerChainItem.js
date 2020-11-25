import React, {useEffect, useState} from 'react'
import {Text, View, TouchableOpacity, StyleSheet} from "react-native"
import {H2, Body, Card, CardItem} from "native-base"

const InnerChainItem = ({data, navigation}) => {
    const date = data.key.split("_")
    const ids = data.moprim

    return (
        <View>
            <Body style={styles.container}>
            <Card style={styles.container2}>
            <TouchableOpacity  onPress={() => navigation.navigate("ChainList", {ids})}>
                <H2 style={styles.textCenter}>{`${date[2]}.${date[1]}.${date[3]}`}</H2>
                <H2 style={styles.textCenter}>Total distance: {(data.totalDistance / 1000).toFixed(1) + "km"}</H2>
                <H2 style={styles.textCenter}>{Math.round(data.totalCo2) + " grams of Co2"}</H2>
            </TouchableOpacity>
            </Card>
            </Body>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        height: '100%',
        justifyContent: 'center',
        marginTop: 10,
    },
    container2: {
        width: '95%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCenter: {
        textAlign: 'center'
    }
})

export default InnerChainItem
