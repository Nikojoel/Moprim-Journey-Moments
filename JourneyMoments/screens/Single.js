import React, { useEffect, useState } from 'react'
import Helper from "../helpers/Helper"
import Map from "../components/Map"
import Upload from "../components/Upload"
import CommentField from "../components/CommentField";
import { Content, H2, Icon, Text, Left, Right, Body } from "native-base"
import DatabaseService from "../services/DatabaseService"
import { ProgressBar } from "@react-native-community/progress-bar-android"

import { BackHandler, Button, StyleSheet, View, ScrollView, SafeAreaView } from "react-native"

import LoginService from "../services/LoginService"
import Stars from "../components/StarRating"
import CommentItem from "../components/CommentItem"
import MediaItem from "../components/MediaItem"
import { TouchableOpacity } from 'react-native-gesture-handler';

const Decoder = require('@mapbox/polyline')

const Single = ({ route, navigation }) => {
    const id = LoginService.getCurrentUser().uid
    const [showMap, setShowMap] = useState(false)
    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [toggle, setToggle] = useState(true)
    const [btn, setBtn] = useState("Rate")
    const [rating, setRating] = useState({speed: 0, comfort: 0, cleanness: 0})
    const [comments, setComments] = useState([])
    const [media, setMedia] = useState([])
    const data = Object.values(route.params)[0]
    const moprimId = data.timestampStart.toString() + data.id.toString()
    const userId = data.userId
    const { icon, color } = Helper.transportIcon(data.activity)
    const timeSpent = Helper.millisToMinutesAndSeconds(parseInt(data.timestampEnd) - parseInt(data.timestampStart))
    const startTime = Helper.unixToTime(parseInt(data.timestampStart))
    const endTime = Helper.unixToTime(parseInt(data.timestampEnd))
    const arr = Helper.unixToSimpleDate(data.timestampStart).split("/")
    const date = `${arr[1]}.${arr[0]}.${arr[2]}`

    const getUser = async (userId) => {
        const result = await DatabaseService.dbUserGET("/" + userId)
        setUser(Helper.parseJSON(result))
        setLoading(false)
    }

    useEffect(() => {
        navigation.setOptions({ title: date })
        getUser(userId)
        getRating(userId + moprimId)
        getComments(userId + moprimId)
        getMedia(userId + moprimId)
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate("Home")
        })
    }, [])

    const handleSend = async (text) => {
        console.log("send comment with text:", text)
        console.log(moprimId)
        if (text === "") setError("Can't be empty")
        else {
            const json = {
                id: Helper.generateUUID(),
                moprimId: userId + moprimId,
                text: text,
                userId: id
            }
            try {
                await DatabaseService.dbCommentINSERT(json)
                await DatabaseService.dbUserUPDATE(id)
                await getComments(userId + moprimId)
                await getUser(userId)
            } catch (e) {
                console.log(e)
                setError("Error in database, try again")
            }
        }
    }

    const handleStars = async (data) => {

        const rating = {
            speed: data.speed,
            cleanness: data.cleanness,
            comfort: data.comfort
        }
        try {
            await DatabaseService.dbMoprimUPDATE(userId + moprimId, rating)
            await DatabaseService.dbUserUPDATE(id)
            await getRating(userId + moprimId)
            await getUser(userId)
        } catch (e) {
            console.log(e)
            setError("Error in database, try again")
        }
    }

    const handleUpload = async () => {
        await getMedia(userId + moprimId)
    }

    const getRating = async (id) => {
        try {
            const result = await DatabaseService.dbMoprimRatingGET(id)
            if (result !== null && result !== undefined) {
                const parse = Helper.parseJSON(result)
                console.log
                setRating(parse.rating)
            } else {
                setRating({speed: 0, comfort: 0, cleanness: 0})
            }

        } catch (e) {
            setRating({speed: 0, comfort: 0, cleanness: 0})
        }
    }

    const iterateData = (obj) => {
        if (obj === undefined) return undefined
        if (obj === null) return null
        const array = []
        const keys = Object.values(obj)[0].childKeys
        keys.forEach(key => {
            array.push(Object.values(obj)[0].value[key])
        })
        return array
    }

    const getComments = async (moprimId) => {
        const result = await DatabaseService.dbCommentMoprimGET(moprimId)
        const iterate = iterateData(result)
        const userArr = []
        iterate.forEach(it => {
            userArr.push({
                userId: it.userId,
                comment: it.text,
            })
        })
        Promise.all(userArr.map((it) => { return getUserData(it.comment, "/" + it.userId) })).then((values) => {
            setComments(values)
        })
    }

    const getMedia = async (moprimId) => {
        const result = await DatabaseService.dbMediaMoprimGET(moprimId)
        const iterate = iterateData(result)
        const mediaArr = []
        iterate.forEach(it => {
            mediaArr.push({
                userId: it.userId,
                url: it.url
            })
        })
        Promise.all(mediaArr.map((it) => { return getTravelMedia(it.url, "/" + it.userId) })).then((values) => {
            setMedia(values)
        })
    }

    const getUserData = async (comment, id) => {
        const user = await DatabaseService.dbUserGET(id)
        return {
            user: user,
            comment: comment,
        }
    }

    const getTravelMedia = async (url, id) => {
        const user = await DatabaseService.dbUserGET(id)
        return {
            user: user,
            url: url,
        }
    }
    
    if (loading) return <ProgressBar />

    return (
        
        <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
            <ScrollView style={{marginBottom:60, marginHorizontal: 10, marginTop: 20}} showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                    <Text>{user.username}</Text>
                    <Right >
                        <View style={{ borderColor: 'red', borderWidth: 2, borderRadius: 10 }}>
                            <Text style={{ textAlign: 'center', margin: 2 }}>{user.rating}</Text>
                        </View>
                    </Right>
                </View>
                {userId === id && <>
                        <Upload moprimId={userId + moprimId} handleUpload={handleUpload} />  
                    </>}
                {media
                    .map((it) => <MediaItem data={it} key={Helper.generateUUID()} />)
                }
                {showMap && <View style={styles.map}>
                    <Map data={Decoder.decode(data.polyline)} />
                </View>}
                <Body style={{ flexDirection: 'row' , flex:1, marginTop: 20}}> 
                        <Stars handleStars={handleStars} rating={rating} owner={userId === id} />
                    <Right>
                        <View style={{flexDirection: 'row'}}>
                            <Icon name={icon} style={{ marginLeft: 20, fontSize: 40 }} />
                            <TouchableOpacity onPress={()=> setShowMap(!showMap)}>
                                <Icon name='map-outline' style={{ marginLeft: 20, fontSize: 40 }} />
                        </TouchableOpacity>
                        </View>
                       <Text>Time: {startTime} - {endTime}</Text>
                        <Text>Total time: {timeSpent}</Text>
                        <Text>Speed: {Math.round(data.speed * 1000 * 3.6)} km/h</Text>
                        <Text>Distance: {data.distance}</Text>
                        <Text>Emissions: {Math.round(data.co2)}g</Text>
                    </Right>
                </Body>
               
                <View style={{flex: 1, paddingTop: 20,}}>
                    <View style={{height: 1, backgroundColor: 'gray', marginBottom: 10}}/>
                    {comments
                        .map((it) => <CommentItem data={it} key={Helper.generateUUID()} />)
                    }
                </View>
               
                    
                </ScrollView>
               <CommentField handleSend={handleSend} />         
        </SafeAreaView>   


    )
}
const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 300,
    }
})
export default Single
