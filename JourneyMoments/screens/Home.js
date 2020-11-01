import React, {useState} from 'react'
import {View, Text, Button} from 'react-native'
import MoprimBridge from '../modules/Moprim'
import DatabaseService from "../services/DatabaseService"
import Helper from "../helpers/Helper";
import LoginService from "../services/LoginService";
import Upload from "../components/Upload";

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
                DatabaseService.dbMoprimINSERT(it)
            })
        } catch (e) {
            console.log(e)
        }
    }

    const millisToMinutesAndSeconds = (millis) => {
        const minutes = Math.floor(millis / 60000)
        const seconds = ((millis % 60000) / 1000).toFixed(0)
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    }

    return (
        <View>
            <Text>Home</Text>
            <Button onPress={() => MoprimBridge.uploadMoprim()} title='upload'/>
            <Button onPress={() => {
                [...Array(1).keys()].forEach(it => {
                    getMoprim(it)
                })
            }
            } title='get data'/>
            <Button onPress={() => console.log(result.length)} title='size'/>
            <Button title="Get user moprim" onPress={async () => {
                const r = await DatabaseService.dbMoprimGET(userId)
                console.log(r)
            }}/>
            <Upload/>
        </View>
    )
}

export default Home
