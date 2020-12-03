import React, {useState, useEffect} from 'react'
import {ScrollView} from 'react-native'
import UserItem from "../components/UserItem"
import DatabaseService from "../services/DatabaseService"
import {ProgressBar} from '@react-native-community/progress-bar-android'
import Colors from "../values/Colors";

const Stats = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

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

    const getusers = async () => {
        const result = await DatabaseService.dbUserTopTenGET()
        const iterate = iterateData(result)
        setData(iterate)
        setLoading(false)
    }

    useEffect(() => {
        getusers()
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
        <ScrollView style={{flex: 1}}>
            {data
                .sort((a, b) => a.rating < b.rating ? 1 : -1)
                .map((it,i)=> <UserItem data={it} i={i} key={it.id}/>)
            }
        </ScrollView>
    )
}

export default Stats
