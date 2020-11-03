import React, {useState} from 'react'
import {View, Text, Button} from 'react-native'
import MoprimBridge from '../modules/Moprim'
import DatabaseService from "../services/DatabaseService"
import Helper from "../helpers/Helper";
import LoginService from "../services/LoginService";
import Upload from "../components/Upload";
import Trip from "../components/Trip";

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
    const userId = LoginService.getCurrentUser().uid

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
                console.log(it)
                DatabaseService.dbMoprimINSERT(it)
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View>
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
        </View>
    )
}

export default Home
