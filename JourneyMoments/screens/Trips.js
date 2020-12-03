import React, {useEffect, useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context"
import {ProgressBar} from "@react-native-community/progress-bar-android"
import LoginService from "../services/LoginService"
import DatabaseService from "../services/DatabaseService"
import {BackHandler, Image, StyleSheet, View} from "react-native"
import TripsFeed from "../components/TripsFeed"
import Colors from "../values/Colors";

const Trips = ({navigation}) => {
    const [listLoading, setList] = useState(false)
    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = useState(false)

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

    useEffect(() => {
        loadMytrips()
        BackHandler.addEventListener('hardwareBackPress', () => {
            return true
        })
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => {
                return true
            })
    }, [])

    const loadMytrips = async () => {
        const month = selectDays(30)
                await getTravelChain(currentDateWithId, month)
    }

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        loadMytrips()
        setRefreshing(false) 
    }, [refreshing]);

    return (
        <View style={{flex: 1}}>
            {listLoading &&
            <ProgressBar style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                width: 100,
                height: 100,
                color: Colors.primaryColor,
            }}/>
            }
            {data.length === 0 && listLoading === false && <>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={require('../images/noTrips.png')}/>
                </View>
            </>}
            <SafeAreaView style={{flex: 1}}>
            <TripsFeed data={data} extra={data} navigation={navigation} refresh={refreshing} onRefresh={onRefresh} />
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '57%',
        height: '30%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '45%'
    },
    image: {
        width: '100%',
        height: '100%'
    }
})

export default Trips
