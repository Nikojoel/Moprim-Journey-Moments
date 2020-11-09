import React, {useEffect, useState} from "react"
import {View, Text} from 'react-native'
import Helper from "../helpers/Helper";
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Trip = ({data}) => {

    const [icon, setIcon] = useState('')
    const timeSpent = Helper.millisToMinutesAndSeconds(data.timestampEnd - data.timestampStart)
    const startTime = Helper.unixToTime(parseInt(data.timestampStart))

    useEffect(() => {
        const transport = data.originalActivity

        if(transport.includes('walk')) {
            setIcon('walk')
        } else if(transport.includes('run')) {
            setIcon('run')
        }else if(transport.includes('bicycle')) {
            setIcon('bicycle')
        }else if(transport.includes('car')) {
            setIcon('car')
        }else if(transport.includes('bus')) {
            setIcon('bus')
        }else if(transport.includes('tram')) {
            setIcon('tram')
        }else if(transport.includes('train')) {
            setIcon('train')
        }else if(transport.includes('metro')) {
            setIcon('train-variant')
        }else if(transport.includes('plane')) {
            setIcon('airplane-takeoff')
        }else {
            setIcon('file-question-outline')
        }
    },[])

    return (
        <View>
            <Text>transport method {data.originalActivity}</Text>
            <Text>distance {data.distance + "m"}</Text>
            <Text>co2 {data.co2 + "g"}</Text>
            <Text>time spent {timeSpent}</Text>
            <Text>start time {startTime}</Text>
            <Icon name={icon} size={25} color='#000000'/>
        </View>
    )
}

export default Trip