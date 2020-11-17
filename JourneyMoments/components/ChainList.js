import DatabaseService from "../services/DatabaseService";
import React, {useEffect, useState} from 'react'
import {BackHandler} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import HomeFeed from "./HomeFeed";

const ChainList = ({route, navigation}) => {
    const [trips, setTrips] = useState([])

    const getTrips = async () => {
        try {
            const data = route.params.ids
            Promise.all([...data].map((id) => { return getSingleTrip(id)})).then((values) => {
                setTrips(values)
            })
            console.log(trips)
        } catch (e) {
            console.log(e)
        }
    }

    const getSingleTrip = async (id) => {
        try {
            const result = await DatabaseService.dbAllMoprimGET('/' + id)
            const json = JSON.parse(JSON.stringify(result))
            if (json != null && json.userId != null) {
                const user = await DatabaseService.dbUserGET('/' + json.userId)
                json.user = JSON.parse(JSON.stringify(user))
            }
            return json
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getTrips()
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate("Trips")
        })
    }, [])

    return (
        <SafeAreaView style={{flex: 1}}>
            <HomeFeed data={trips} extra={trips} navigation={navigation}/>
        </SafeAreaView>
    )
}

export default ChainList
