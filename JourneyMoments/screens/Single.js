import React, {useEffect, useState} from 'react'
import Helper from "../helpers/Helper"
import Map from "../components/Map"
import Upload from "../components/Upload"
import CommentField from "../components/CommentField";
import {Icon, Text, Right, Body, CardItem, Card} from "native-base"
import DatabaseService from "../services/DatabaseService"
import {ProgressBar} from "@react-native-community/progress-bar-android"
import {BackHandler, StyleSheet, View, ScrollView, SafeAreaView, Image, Keyboard} from "react-native"
import {H3} from "native-base"
import LoginService from "../services/LoginService"
import Stars from "../components/StarRating"
import CommentItem from "../components/CommentItem"
import MediaItem from "../components/MediaItem"
import {TouchableOpacity} from 'react-native-gesture-handler'
import Colors from "../values/Colors"

const Decoder = require('@mapbox/polyline')

const Single = ({route, navigation}) => {
    const id = LoginService.getCurrentUser().uid
    const [showMap, setShowMap] = useState(false)
    const [mapText, setMapText] = useState('SHOW MAP')
    const [user, setUser] = useState([])
    const [toggle, setToggle] = useState('SHOW MEDIA')
    const [mediaToggle, setMediaToggle] = useState(false)
    const [mediaLoading, setMediaLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("Type here...")
    const [errorClass, setErrorClass] = useState(styles.normal)
    const [rating, setRating] = useState({speed: 0, comfort: 0, cleanness: 0})
    const [comments, setComments] = useState([])
    const [media, setMedia] = useState([])
    const data = Object.values(route.params)[0]
    const digiTransit = Object.values(route.params)[1]
    const moprimId = data.timestampStart.toString() + data.id.toString()
    const userId = data.userId
    const {icon, color} = Helper.transportIcon(data.activity)
    const timeSpent = Helper.millisToMinutesAndSeconds(parseInt(data.timestampEnd) - parseInt(data.timestampStart))
    const startTime = Helper.unixToTime(parseInt(data.timestampStart))
    const endTime = Helper.unixToTime(parseInt(data.timestampEnd))
    const arr = Helper.unixToSimpleDate(data.timestampStart).split("/")
    const date = `${arr[1]}.${arr[0]}.${arr[2]}`
    const [userRating, setUserRating] = useState(Helper.ratingColor(0))

    const getUser = async (userId) => {
        const result = await DatabaseService.dbUserGET("/" + userId)
        setUser(Helper.parseJSON(result))
        setUserRating(Helper.ratingColor(user.rating))
        setLoading(false)
    }

    useEffect(() => {
        navigation.setOptions({title: date})
        getUser(userId)
        getRating(userId.toString() + moprimId.toString())
        getComments(userId.toString() + moprimId.toString())
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate("Home")
        })
    }, [])

    const handleSend = async (text) => {
        if (text.length === 0 || text === "") {
            setError("Comment can't be empty")
            setErrorClass(styles.error)
            setTimeout(() => {
                setError("Type here...")
                setErrorClass(styles.normal)
            }, 3000)
        } else {
            const json = {
                id: Helper.generateUUID(),
                moprimId: userId.toString() + moprimId.toString(),
                text: text,
                userId: id
            }
            try {
                Keyboard.dismiss()
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
        Promise.all(userArr.map((it) => {
            return getUserData(it.comment, "/" + it.userId)
        })).then((values) => {
            setComments(values)
        })
    }

    const getMedia = async (moprimId) => {
        setMediaLoading(true)
        const result = await DatabaseService.dbMediaMoprimGET(moprimId)
        const iterate = iterateData(result)
        const mediaArr = []
        iterate.forEach(it => {
            mediaArr.push({
                url: it.url,
                type: it.contentType,
            })
        })
        setMedia(mediaArr)
        setMediaLoading(false)
    }

    const getUserData = async (comment, id) => {
        const user = await DatabaseService.dbUserGET(id)
        return {
            user: user,
            comment: comment,
        }
    }

    if (loading) return <ProgressBar/>

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <ScrollView style={{marginBottom: 60, marginHorizontal: 10, marginTop: 20}}
                        showsVerticalScrollIndicator={false}>
                <View style={{paddingBottom: 20}}>
                    <Card style={{flexDirection: 'row'}}>
                        <Image source={{uri: user.photoURL}} style={{
                            width: 65,
                            height: 65,
                            borderRadius: 50,
                            margin: 10,
                            borderColor: userRating,
                            borderWidth: 2,
                        }}/>
                        <CardItem>
                            <H3>{user.username}</H3>
                        </CardItem>
                        <Right>
                            <Icon name={icon} style={{fontSize: 60, color: color, marginRight: 20}}/>
                        </Right>
                    </Card>
                </View>
                <Card>
                {userId === id && <>
                    <Upload moprimId={userId + moprimId} handleUpload={handleUpload}/>
                </>}
                <TouchableOpacity style={styles.btn} onPress={() => {
                    if (!showMap) {
                        setMapText('HIDE MAP')
                    } else {
                        setMapText('SHOW MAP')
                    }
                    setShowMap(!showMap)
                }}>
                    <Text style={styles.btnText}>{mapText}</Text>
                </TouchableOpacity>
                {showMap && <View style={styles.map}>
                    <Map data={Decoder.decode(data.polyline)}/>
                </View>}
                <TouchableOpacity style={styles.btn} onPress={async () => {
                    if (!mediaToggle) {
                        setToggle('HIDE MEDIA')
                        await getMedia(userId + moprimId)
                    } else {
                        setToggle('SHOW MEDIA')
                    }
                    setMediaToggle(!mediaToggle)
                }}>
                    <Text style={styles.btnText}>{toggle}</Text>
                </TouchableOpacity>
                {mediaLoading && <>
                    <ProgressBar style={styles.progBar}/>
                </>}
                {mediaToggle && <>
                    {media
                        .map((it) => <MediaItem data={it} key={Helper.generateUUID()}/>)
                    }
                    {media.length === 0 && !mediaLoading && <>
                        <Image source={require('../images/noImageAvailable.png')} style={styles.noImgStyle}/>
                    </>}
                </>}
                <Body style={{flexDirection: 'row', flex: 1, marginTop: 20}}>
                    <Stars handleStars={handleStars} rating={rating} owner={userId === id}/>
                    <Right style={{marginRight: 10}}>
                        <Text>Time: {startTime} - {endTime}</Text>
                        <Text>Total time: {timeSpent}</Text>
                        <Text>Avg speed: {Math.round(data.speed * 1000 * 3.6)} km/h</Text>
                        <Text>Distance: {data.distance}m</Text>
                        <Text>Emissions: {Math.round(data.co2)}g</Text>
                        {digiTransit && <>
                            <Text>From:</Text>
                            <Text>{digiTransit.from}</Text>
                            <Text>To:</Text>
                            <Text>{digiTransit.to}</Text>
                            <Text>Line: {digiTransit.transportId}</Text>
                        </>}
                    </Right>
                </Body>
                </Card>
                <View style={{flex: 1, paddingTop: 20,}}>
                    <View style={{height: 0, backgroundColor: 'gray', marginBottom: 10}}/>
                    {comments
                        .map((it) => <CommentItem data={it} key={Helper.generateUUID()}/>)
                    }
                </View>
            </ScrollView>
            <CommentField handleSend={handleSend} error={error} className={errorClass}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    normal: {
        height: 30,
        flex: 1,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
        marginHorizontal: 10
    },
    error: {
        height: 30,
        flex: 1,
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 5,
        padding: 5,
        marginHorizontal: 10,
        textDecorationColor: 'red'
    },
    map: {
        width: '100%',
        height: 300,
        marginBottom: 10,
        marginTop: 20,
    },
    btnFull: {
        width: '80%',
        backgroundColor: Colors.primaryColor,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    btn: {
        width: '80%',
        backgroundColor: Colors.primaryColor,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        alignSelf: 'center'
    },
    btnText: {
        fontSize: 14
    },
    noImgStyle: {
        width: 300,
        height: 250,
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
    },
    progBar: {
        marginTop: 20,
        marginBottom: 10
    }
})

export default Single
