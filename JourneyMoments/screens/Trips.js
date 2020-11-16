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

const Trips = ({navigation}) => {
    const [loading, setLoading] = useState(true)
    const [listLoading, setList] = useState(false)
    const [data, setData] = useState(null)
    const [func, setFunc] = useState(null)

    const id = LoginService.getCurrentUser().uid
    const dd = new Date()
    const currentDate = `${dd.getMonth() + 1}_${dd.getDate()}_${dd.getFullYear()}`

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

    const selectDays = (days) => {
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
        return `${m}_${d}_${y}`
    }

    const getTravelChain = async (start, end) => {
        setList(true)
        const result = await DatabaseService.dbTravelChainDateGET(start, end)
        console.log("result", result)
        const parse = iterateData(result)
        const ids = []
        parse.forEach(it => {
            ids.push(...it.id)
        })
        Promise.all([...ids].map((id) => { return getMorprimData(id)})).then((values) => {
            setData(values)
            console.log("data after set:", data)
            setList(false)
        })

    }

    const getAllTravelChains = async (id) => {
        const result = await DatabaseService.dbUserTravelChainGET(id)
        console.log("getAllTravelChains:", result)
        const parse = iterateData(result)
        const ids = []
        parse.forEach(it => {
            ids.push(...it.id)
        })
        Promise.all([...ids].map((id) => { return getMorprimData(id)})).then((values) => {
            setData(values)
            console.log("data after set:", data)
            setList(false)
        })
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
                await getTravelChain(currentDate, currentDate)
                setFunc("Today")
            }}/>
            <Button title="Week" onPress={async () => {
                const week = selectDays(7)
                await getTravelChain(currentDate, week)
                setFunc(`${week} - ${currentDate}`)
            } }/>
            <Button title="Month" onPress={async () => {
                const month = selectDays(30)
                await getTravelChain(currentDate, month)
                setFunc(`${month} - ${currentDate}`)
            }}/>
            <Button title="All" onPress={async () => {
                await getAllTravelChains(id)
                setFunc("All time")
            }}/>
            {listLoading &&
            <ProgressBar/>
            }
            {!listLoading &&
            <H2>{func}</H2>
            }
            <HomeFeed data={data} extra={data} navigation={navigation}/>
        </SafeAreaView>
    )
}

export default Trips
