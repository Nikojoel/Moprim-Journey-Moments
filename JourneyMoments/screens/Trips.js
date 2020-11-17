import React, {useEffect, useState} from 'react'
import HomeFeed from "../components/HomeFeed"
import {SafeAreaView} from "react-native-safe-area-context"
import {ProgressBar} from "@react-native-community/progress-bar-android"
import LoginService from "../services/LoginService"
import DatabaseService from "../services/DatabaseService"
import Helper from "../helpers/Helper"
import Home from "./Home";
import {BackHandler, Button} from "react-native"
import {H2} from "native-base"
import InnerChainItem from "../components/InnerChainItem";

const Trips = ({navigation}) => {
    const [listLoading, setList] = useState(false)
    const [data, setData] = useState([])
    const [func, setFunc] = useState(null)

    const id = LoginService.getCurrentUser().uid
    const dd = new Date()
    const currentDateWithId = `${id}_${dd.getMonth() + 1}_${dd.getDate()}_${dd.getFullYear()}`

    const iterateData = (obj) => {
        if (obj === undefined) return undefined
        if (obj === null)  return null
        const array = []
        const keys = Object.values(obj)[0].childKeys
        keys.forEach(key => {
            array.push({
                key: key,
                value: Object.values(obj)[0].value[key]
            })
        })
        return array
    }

    const selectDays = (days) => {
        setList(true)
        const date = new Date()
        if (days === 7) {
            date.setDate(date.getDate() - 7)
        } else if (days === 30) {
            date.setDate(date.getDate() - 30)
        } else if (days === 365) {
            date.setDate(date.getDate() - 365)
        }
        let m = date.getMonth() + 1
        let d = date.getDate()
        const y = date.getFullYear()

        if (d.toString().length === 1) {
            d = `0${date.getDate()}`
        }
        return `${id}_${m}_${d}_${y}`
    }

    const getTravelChain = async (start, end) => {
        setList(true)
        const result = await DatabaseService.dbTravelChainDateGET(start, end)
        const parse = iterateData(result)
        const arr = []
        parse.forEach(it => {
            arr.push({
                key: it.key,
                moprim: it.value.id,
                totalCo2: it.value.totalCo2,
                totalDistance: it.value.totalDistance
            })
        })
        setData(arr)
        setList(false)
    }

    const getAllTravelChains = async (id) => {
        setList(true)
        const result = await DatabaseService.dbUserTravelChainGET(id)
        const parse = iterateData(result)
        const arr = []
        parse.forEach(it => {
            arr.push({
                key: it.key,
                moprim: it.value.id,
                totalCo2: it.value.totalCo2,
                totalDistance: it.value.totalDistance
            })
        })
        setData(arr)
        setList(false)
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            return true
        })
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => {
                return true
            })
    }, [])

    return (
        <SafeAreaView style={{flex: 1}}>
            <Button title="Today" onPress={async () => {
                await getTravelChain(currentDateWithId, currentDateWithId)
                setFunc("Today")
            }}/>
            <Button title="Week" onPress={async () => {
                const week = selectDays(7)
                await getTravelChain(currentDateWithId, week)
                setFunc("Week")
            } }/>
            <Button title="Month" onPress={async () => {
                const month = selectDays(30)
                await getTravelChain(currentDateWithId, month)
                setFunc("Month")
            }}/>
            <Button title="All" onPress={async () => {
                await getAllTravelChains(id)
                setFunc("All time")
            }}/>
            <H2>{func}</H2>
            {listLoading &&
            <ProgressBar/>
            }
            {data
                .map(it => <InnerChainItem data={it} key={Helper.generateUUID()} navigation={navigation}/>)
            }
        </SafeAreaView>
    )
}

export default Trips
