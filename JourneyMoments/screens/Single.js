import React, {useState, useEffect} from 'react'
import Helper from "../helpers/Helper"
import Map from "../components/Map"
import {Content, Icon, Text, H2} from "native-base"
import DatabaseService from "../services/DatabaseService"
import {ProgressBar} from "@react-native-community/progress-bar-android"
import {StyleSheet, View} from "react-native"

const Single = ({route}) => {
    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(true)

    const data = route.params.item
    console.log("asdasd",data)

    const { icon, color } = Helper.transportIcon(data.originalActivity)
    const timeSpent = Helper.millisToMinutesAndSeconds(parseInt(data.timestampEnd) - parseInt(data.timestampStart))
    const startTime = Helper.unixToTime(parseInt(data.timestampStart))

    const getUser = async (userId) => {
        const result = await DatabaseService.dbUserGET("/" + userId)
        setUser(result)
        console.log(user)
        //setLoading(false)
    }

    //if (loading) return <ProgressBar/>

    useEffect(() => {
        //getUser(data.userId)
    }, [])

    return (
        <Content>
            <Text>Date: {data.date}</Text>
            <Text>Total time: {timeSpent}</Text>
            <Text>Starting time: {startTime}</Text>
            <Text>Emissions: {data.co2}</Text>
            <Text>Speed: {data.speed}</Text>
            <Icon name={icon} size={30} color={color}/>
            <H2>Current Rating</H2>
            <Text>Speed: {data.rating.speed}</Text>
            <Text>Cleanness: {data.rating.cleanness}</Text>
            <Text>Comfort: {data.rating.comfort}</Text>
            <H2>User</H2>
            <Text>Name: {user.username}</Text>
            <View style={styles.map}>
                <Map data={data}/>
            </View>

        </Content>

    )
}
const styles = StyleSheet.create({
    map: {
        width: 250,
        height: 250,
    }
})
export default Single
