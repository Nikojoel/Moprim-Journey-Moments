import React, {useState, useEffect} from 'react'
import {BackHandler} from 'react-native'
import DatabaseService from "../services/DatabaseService"
import HomeFeed from "../components/HomeFeed"
import {SafeAreaView} from "react-native-safe-area-context"
import {ProgressBar} from "@react-native-community/progress-bar-android"


const Home = ({navigation}) => {
    const [commentedTrips, setCommentedTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

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


    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        getCommentedTrips() 
        setRefreshing(false) 
    }, [refreshing]);


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
                <HomeFeed data={commentedTrips} extra={commentedTrips} navigation={navigation} refresh={refreshing} onRefresh={onRefresh} />
        </SafeAreaView>
    )
}

export default Home

