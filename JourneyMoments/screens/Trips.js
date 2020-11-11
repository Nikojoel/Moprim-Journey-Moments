import React, {useEffect, useState} from 'react'
import HomeFeed from "../components/HomeFeed"
import {SafeAreaView} from "react-native-safe-area-context"
import {ProgressBar} from "@react-native-community/progress-bar-android"
import LoginService from "../services/LoginService"
import DatabaseService from "../services/DatabaseService"
import Helper from "../helpers/Helper"
import Home from "./Home";

const Trips = ({navigation}) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const id = LoginService.getCurrentUser().uid

    const getTrips = async (userId) => {
        const result = await DatabaseService.dbMoprimGET(userId)
        const response = iterateData(result)
        setData(response)
        console.log(data)
        setLoading(false)
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
        getTrips(id)
    }, [])

    if (loading) return <ProgressBar/>

    return (
        <SafeAreaView style={{flex: 1}}>
            <HomeFeed data={data} extra={data} navigation={navigation}/>
        </SafeAreaView>
    )
}

export default Trips
