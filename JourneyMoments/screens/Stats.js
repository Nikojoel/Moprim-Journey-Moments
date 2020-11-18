import React, {useState, useEffect} from 'react'
import {Text, Button, ScrollView, SafeAreaView, StyleSheet, BackHandler} from 'react-native'
import LoginService from "../services/LoginService"
import UserItem from "../components/UserItem"
import DatabaseService from "../services/DatabaseService"
import {ProgressBar} from '@react-native-community/progress-bar-android'
import MoprimBridge from '../modules/Moprim'
import Helper from "../helpers/Helper";

const Stats = () => {
    const [data, setData] = useState([])

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

    const getusers = async () => {
        const result = await DatabaseService.dbUserGET("/")
        const iterate = iterateData(result)
        setData(iterate)
    }
    useEffect(() => {
        getusers()
    }, [])

    return (
        <ScrollView style={{flex: 1}}>
            {data
                .sort((a,b) => a.rating < b.rating ? 1 : -1)
                .map(it => <UserItem data={it} key={it.id}/>)
            }
        </ScrollView>
    )

}
const styles = StyleSheet.create({
    scrollArea: {
        marginBottom: 40,
        marginTop: 40,
        backgroundColor: "orange"
    }
})
export default Stats
