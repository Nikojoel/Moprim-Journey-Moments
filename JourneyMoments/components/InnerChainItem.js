import React, {useEffect, useState} from 'react'
import {Text, View, TouchableOpacity} from "react-native"
import {H2} from "native-base"

const InnerChainItem = ({data, navigation}) => {
    const date = data.key.split("_")
    const ids = data.moprim

    return (
        <View>
            <TouchableOpacity  onPress={() => navigation.navigate("ChainList", {ids})}>
                <H2>{`${date[2]}.${date[1]}.${date[3]}`}</H2>
                <H2>totalco2: {data.totalCo2}</H2>
                <H2>totaldistance: {data.totalDistance}</H2>
                <H2>---------------------------------</H2>
            </TouchableOpacity>
        </View>
    )
}

export default InnerChainItem
