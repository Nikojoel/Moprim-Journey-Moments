import React, {useState, useEffect} from 'react'
import {BackHandler} from 'react-native'
import MoprimBridge from '../modules/Moprim'
import DatabaseService from "../services/DatabaseService"
import Helper from "../helpers/Helper";
import LoginService from "../services/LoginService";
import Upload from "../components/Upload";
import Trip from "../components/Trip";
import HomeFeed from "../components/HomeFeed";
import {SafeAreaView} from "react-native-safe-area-context";
import Map from "../components/Map";
import {ProgressBar} from "@react-native-community/progress-bar-android";
import Stars from "../components/StarRating";

const data = {
    co2: "20.3",
    correctedActivity: "null",
    distance: "1160.0",
    id: "a84ef16f-6171-4d06-b450-17f1d012eeea",
    metadata: "null",
    originalActivity: "motorized/road/bus",
    polyline:
        "szgnJmgkvCUOIb@]Pa@?m@AS@Ow@YcAEkAGg@KgAEgA@qAEgAUaA@w@_@Ja@Re@Pg@k@[UGs@Cy@Eu@Iw@Iq@Es@Gq@Im@Oq@a@AWTOf@Hp@ZIBf@DhABnAPxAR`A^SXYT^B~@CrARO^c@^EXQd@[d@GRh@Fh@Bp@D~@GjAOj@T[j@KXHZDZOa@GIu@SY",
    speed: "0.0012497252759091752",
    syncedWithCloud: "true",
    timestampDownload: "1603387823109",
    timestampEnd: "1603385367839",
    timestampStart: "1603384439635",
    userId: "XmQUTrAnu4ZPTSTN6vCnOs5nTqh2"
}

const Home = ({navigation}) => {
    const [text, setText] = useState('')
    const [result, setResult] = useState([])
    const [commentedTrips, setCommentedTrips] = useState([])
    const userId = LoginService.getCurrentUser().uid
    const [loading, setLoading] = useState(true)

    const getMoprim = async (it) => {
        try {
            const result = await MoprimBridge.getFakeResults(it)
            const obj = JSON.parse(result)
            
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
            
                DatabaseService.dbMoprimINSERT(it)
            })
        } catch (e) {
            console.log(e)
        }
    }

    const getCommentedTrips = async () => {
        try {
            const comments = await DatabaseService.dbAllCommentGET('/')
            const commentsArray = iterateData(comments)
            const morpimID = new Set()
            commentsArray.forEach(it => {
                morpimID.add(it.moprimId)
            })
            Promise.all([...morpimID].map((id) => { return getMorprimData(id)})).then((values) => {
                setCommentedTrips(values)
            })
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    const getMorprimData = async (id) => {
        const data = await DatabaseService.dbAllMoprimGET('/' + id)
        const json = JSON.parse(JSON.stringify(data))
        if (json != null && json.userId != null) {
            const user = await DatabaseService.dbUserGET('/' + json.userId)
            const userjson = JSON.parse(JSON.stringify(user))
            json.user = userjson
        }
        return json
    }

    const iterateData = (obj) => {
        if (obj === undefined) return undefined
        if (obj === null)  return null
        const array = []
        const keys = Object.values(obj)[0].childKeys
        keys.forEach(key => {
            array.push(Object.values(obj)[0].value[key])
        })
        return array
    }


    useEffect(() => {
        getCommentedTrips()
        BackHandler.addEventListener('hardwareBackPress', () => {
            return true
        })
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => {
                return true
            })
    }, [])

    if (loading) return <ProgressBar/>

    return (
        <SafeAreaView style={{flex: 1}}>
                <HomeFeed data={commentedTrips} extra={commentedTrips} navigation={navigation} />
        </SafeAreaView>
    )
}

export default Home

/*
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

*/
