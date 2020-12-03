import React, { useState, useEffect } from 'react'
import { BackHandler } from 'react-native'
import DatabaseService from "../services/DatabaseService"
import HomeFeed from "../components/HomeFeed"
import { SafeAreaView } from "react-native-safe-area-context"
import { ProgressBar } from "@react-native-community/progress-bar-android"
import LoginService from '../services/LoginService'
import { View, Text, H2 } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Helper from "../helpers/Helper";
import Colors from "../values/Colors";


const Home = ({ navigation }) => {
    const [commentedTrips, setCommentedTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [latest, setLatest] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [method, setMethod] = useState(null)

    const userId = LoginService.getCurrentUser().uid

    const getCommentedTrips = async () => {
        try {
            const comments = await DatabaseService.dbAllCommentGET('/')
            const commentsArray = iterateData(comments)
            const morpimID = new Set()
            commentsArray.forEach(it => {
                morpimID.add(it.moprimId)
            })
            Promise.all([...morpimID].map((id) => { return getMorprimData(id) })).then((values) => {
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
        if (obj === null) return null
        const array = []
        const keys = Object.values(obj)[0].childKeys
        keys.forEach(key => {
            array.push(Object.values(obj)[0].value[key])
        })
        return array
    }

    const getUserLastrip = async (userId) => {
        try {
            const data = await DatabaseService.dbGetLatestTrip(userId)
            const it = iterateData(data)
            setLatest(it[0])
            const transport = Helper.transportMethod(it[0].activity)
            setMethod(transport)
        } catch (e) {
            console.log(e)
        }
    }

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        getUserLastrip(userId)
        getCommentedTrips()
        setRefreshing(false)
    }, [refreshing]);


    useEffect(() => {
        getCommentedTrips()
        getUserLastrip(userId)
        BackHandler.addEventListener('hardwareBackPress', () => {
            return true
        })
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => {
                return true
            })
    }, [])

    if (loading) {
        return <ProgressBar style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            width: 100,
            height: 100,
            color: Colors.primaryColor,
        }}/>
    }

    return (
        <View style={{ flex: 1 }}>
            {method && <>
                {method.rateable && <>
                    <TouchableOpacity style={{ padding: 20, backgroundColor: 'black', margin: 5 }} onPress={() => navigation.navigate("Single", { latest })}>
                        <H2 style={{ color: 'white' }}>Rate your latest trip</H2>
                        <Text style={{ color: 'white' }}>{method.method}</Text>
                    </TouchableOpacity>
                    </>}
            </>}
            <SafeAreaView style={{ flex: 1 }}>
                <HomeFeed data={commentedTrips} extra={commentedTrips} navigation={navigation} refresh={refreshing} onRefresh={onRefresh} />
            </SafeAreaView>
        </View>
    )
}

export default Home

