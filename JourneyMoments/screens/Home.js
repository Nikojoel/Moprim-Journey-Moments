import React, {useState, useEffect} from 'react'
import {View, Text, Button, ScrollView} from 'react-native'
import MoprimBridge from '../modules/Moprim'
import DatabaseService from "../services/DatabaseService"
import Helper from "../helpers/Helper";
import LoginService from "../services/LoginService";
import Upload from "../components/Upload";
import Trip from "../components/Trip";
import HomeFeed from "../components/HomeFeed";
import {SafeAreaView} from "react-native-safe-area-context";

const data = {
    co2: "20.3",
    correctedActivity: "null",
    distance: "1160.0",
    id: "a84ef16f-6171-4d06-b450-17f1d012eeea",
    metadata: "null",
    originalActivity: "motorized/road/bus",
    polyline: "szgnJmgkvCUOIb@]Pa@?m@AS@Ow@YcAEkAGg@KgAEgA@qAE...",
    speed: "0.0012497252759091752",
    syncedWithCloud: "true",
    timestampDownload: "1603387823109",
    timestampEnd: "1603385367839",
    timestampStart: "1603384439635",
    userId: "XmQUTrAnu4ZPTSTN6vCnOs5nTqh2"
}

const Home = () => {
    const [text, setText] = useState('')
    const [result, setResult] = useState([])
    const [commentedTrips, setCommentedTrips] = useState([])
    const userId = LoginService.getCurrentUser().uid

    const getMoprim = async (it) => {
        try {
            const result = await MoprimBridge.getFakeResults(it)
            const obj = JSON.parse(result)
            console.log(obj)
            obj.forEach((it) => {
                setResult(arr => [...arr, it])
                it.id = Helper.generateUUID()
                it.originalActivity = Helper.generateRandom()
                it.userId = userId
                it.rating = {
                    "speed": 0,
                    "cleanness": 0,
                    "comfort": 0
                }
                it.date = Helper.unixToSimpleDate(parseInt(it.timestampStart))
                //console.log(it)
                //DatabaseService.dbMoprimINSERT(it)
            })
        } catch (e) {
            console.log(e)
        }
    }

    const getCommentedTrips = async () => {
        try {
            const comments = await DatabaseService.dbAllCommentGET('/')
            const commentsArray = iterateData(comments)
            const morpimID = []
            commentsArray.forEach(it => {
                morpimID.push(it[0].moprimId)
            })
            morpimID.forEach(it => {
                getMorprimData(it)
            })
        } catch (e) {
            console.log(e)
        }
    }

    const getMorprimData = async (id) => {
        const data = await DatabaseService.dbAllMoprimGET('/' + id)
        const json = JSON.parse(JSON.stringify(data))
        setCommentedTrips(arr => [...arr, json])
    }

    const iterateData = (obj) => {
        if (obj === undefined) return undefined
        if (obj === null)  return null
        const array = []
        const keys = Object.values(obj)[0].childKeys
        keys.forEach(key => {
            const temp = []
            temp.push(Object.values(obj)[0].value[key])
            array.push(temp)
        })
        return array
    }

    useEffect(() => {
        getCommentedTrips()
    }, [])

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView>
                <Text>Home</Text>
                <Button onPress={() => MoprimBridge.uploadMoprim()} title='upload'/>
                <Trip data={data}/>
                <Button onPress={() => {
                    [...Array(1).keys()].forEach(it => {
                        getMoprim(it)
                    })
                }
                } title='get data'/>
                <Button onPress={() => console.log(result.length)} title='size'/>
                <Upload/>
                <Button onPress={() => {
                    console.log(Helper.unixToSimpleDate(1603384439635))
                }} title="testset"/>
                <Button onPress={async () => {
                    console.log(await DatabaseService.dbMoprimGET(userId))
                }} title="dbGET"/>
                <HomeFeed data={commentedTrips} extra={commentedTrips} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home
