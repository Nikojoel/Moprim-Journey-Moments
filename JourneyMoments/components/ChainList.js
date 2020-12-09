import DatabaseService from "../services/DatabaseService";
import React, {useEffect, useState} from 'react'
import {BackHandler} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import HomeFeed from "./HomeFeed";
import ChainMap from "./ChainMap"
import { View } from "native-base";

const Decoder = require('@mapbox/polyline')

const ChainList = ({route, navigation}) => {
    const [trips, setTrips] = useState([])
    const [polyline, setPolyline] = useState()

    const getTrips = async () => {
        try {
            const data = route.params.ids
            Promise.all([...data].map((id) => { return getSingleTrip(id)})).then((values) => {
                setTrips(values)
                makePolylinePie(values)
            })
        
        } catch (e) {
            console.log(e)
        }
    }

    const makePolylinePie = async (data) => {
        const pie = []
        data.forEach(it => {
           const coords = Decoder.decode(it.polyline)
           pie.push(coords)
        });
        
        setPolyline(pie)
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
            <View style={{width:'100%', height: '40%'}}>
                <ChainMap data={polyline} trips={trips} />
            </View>
            <View style={{flex: 1}}>
            <HomeFeed data={trips} extra={trips} navigation={navigation}/>
            </View>
        </SafeAreaView>
        
    )
}

export default ChainList
