import React, {useState, useEffect} from 'react'
import Helper from "../helpers/Helper"
import Map from "../components/Map"
import Upload from "../components/Upload"
import CommentField from "../components/CommentField";
import {Content, Icon, Text, H2} from "native-base"
import DatabaseService from "../services/DatabaseService"
import {ProgressBar} from "@react-native-community/progress-bar-android"
import {BackHandler, StyleSheet, View, Button} from "react-native"
import Notification from "../components/Notification";
import Login from "./Login";
import LoginService from "../services/LoginService";
import Stars from "../components/StarRating";

const Single = ({route, navigation}) => {
    const id = LoginService.getCurrentUser().uid
    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [toggle, setToggle] = useState(true)
    const [btn, setBtn] = useState("Rate")

    const data = Helper.parseJSON(route.params.item)
    const moprimId = data.id
    const userId = data.userId

    const {icon, color} = Helper.transportIcon(data.originalActivity)
    const timeSpent = Helper.millisToMinutesAndSeconds(parseInt(data.timestampEnd) - parseInt(data.timestampStart))
    const startTime = Helper.unixToTime(parseInt(data.timestampStart))

    const getUser = async (userId) => {
        const result = await DatabaseService.dbUserGET("/" + userId)
        setUser(Helper.parseJSON(result))
        console.log(user)
        setLoading(false)
    }

    useEffect(() => {
        getUser(userId)
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
                moprimId: moprimId,
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

    const handleStars = async (data) => {
        console.log("data", data)
        const rating = {
            speed: data.speed,
            cleanness: data.cleanness,
            comfort: data.comfort
        }
        try {
            await DatabaseService.dbMoprimUPDATE(moprimId, rating)
        } catch (e) {
            console.log(e)
            setError("Error in database, try again")
        }
    }

    if (loading) return <ProgressBar/>

    return (
        <Content>
            <Text>Date: {data.date}</Text>
            <Text>Total time: {timeSpent}</Text>
            <Text>Starting time: {startTime}</Text>
            <Text>Emissions: {data.co2}</Text>
            <Text>Speed: {data.speed}</Text>
            <Icon name={icon} size={30} color={color}/>
            <H2>Current Rating</H2>
            <Text>Speed: {data.rating.speed}/5</Text>
            <Text>Cleanness: {data.rating.cleanness}/5</Text>
            <Text>Comfort: {data.rating.comfort}/5</Text>
            <H2>User</H2>
            <Text>Name: {user.username}</Text>
            <Text>Rating: {user.rating}</Text>
            <Text>Member since: {Helper.unixToSimpleDate(user.metadata.creationTime)}</Text>
            <View style={styles.map}>
                <Map data={data}/>
            </View>
            <Button title={btn} onPress={() => {
                if (toggle) {
                    setToggle(false)
                    setBtn("Hide")
                } else {
                    setToggle(true)
                    setBtn("Rate")
                }
            }}/>
            {!toggle && <>
                <Upload moprimId={moprimId}/>
                <Notification message={error}/>
                <CommentField handleSend={handleSend}/>
                <Stars handleStars={handleStars}/>
            </>}
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
