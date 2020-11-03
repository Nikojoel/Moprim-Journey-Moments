import React from "react"
import {View, Text} from 'react-native'
import Helper from "../helpers/Helper";

const Trip = ({data}) => {

    const timeSpent = Helper.millisToMinutesAndSeconds(1603385367839 - 1603384439635)
    const startTime = Helper.unixToTime(1603384439635)

    return (
        <View>
            <Text>{data.originalActivity}</Text>
            <Text>{data.distance + "m"}</Text>
            <Text>{data.co2 + "g"}</Text>
            <Text>{timeSpent}</Text>
            <Text>{startTime}</Text>
        </View>
    )
}

export default Trip