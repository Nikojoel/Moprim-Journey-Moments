import React, {useState, useEffect} from 'react'
import Helper from "../helpers/Helper"
import Map from "../components/Map"
import Upload from "../components/Upload"
import CommentField from "../components/CommentField";
import {Content, Icon, Text, H2} from "native-base"
import DatabaseService from "../services/DatabaseService"
import {ProgressBar} from "@react-native-community/progress-bar-android"
import {BackHandler, StyleSheet, View} from "react-native"
import Notification from "../components/Notification";
import Login from "./Login";
import LoginService from "../services/LoginService";

const Single = ({route, navigation}) => {
    const id = LoginService.getCurrentUser().uid
    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const data = Helper.parseJSON(route.params.item)
    const moprimId = data.id
    console.log("asdasd", data)

    const {icon, color} = Helper.transportIcon(data.originalActivity)
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
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate("Home")
        })
    }, [])

    const handleSend = async (text) => {
        console.log("send comment with text:", text)
        console.log("data", data)
        if (text === "") setError("Can't be empty")
        else {
            const json = {
                id: Helper.generateUUID(),
                moprimId: data.id,
                text: text,
                userId: id
            }
            try {
                await DatabaseService.dbCommentINSERT(json)
                await DatabaseService.dbUserUPDATE(id)
            } catch (e) {
                console.log(e)
                setError("Error in database, try again")
            }
        }
    }

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
            <Upload moprimId={moprimId}/>
            <Notification message={error}/>
            <CommentField handleSend={handleSend}/>
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
