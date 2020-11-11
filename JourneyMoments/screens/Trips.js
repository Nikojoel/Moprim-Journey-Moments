import React, {useEffect, useState} from 'react'
import HomeFeed from "../components/HomeFeed"
import {SafeAreaView} from "react-native-safe-area-context"
import {ProgressBar} from "@react-native-community/progress-bar-android"
import LoginService from "../services/LoginService"
import DatabaseService from "../services/DatabaseService"
import Helper from "../helpers/Helper"
import Home from "./Home";

const Trips = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const id = LoginService.getCurrentUser().uid

    const getMorprimData = async (id) => {
        const data = await DatabaseService.dbAllMoprimGET('/' + id)
        const json = JSON.parse(JSON.stringify(data))
        setData(arr => [...arr, json])
    }

    const getTrips = async (userId) => {
        const result = await DatabaseService.dbMoprimGET(userId)
        const json = Helper.parseJSON(result)
        const keys = Object.keys(json)
        keys.forEach(it => {
            getMorprimData(it)
        })
        setLoading(false)
    }

    useEffect(() => {
        getTrips(id)
    }, [])

    if (loading) return (<ProgressBar/>)

    return (
        <SafeAreaView style={{flex: 1}}>
            <HomeFeed data={data} extra={data}/>
        </SafeAreaView>
    )
}

export default Trips
