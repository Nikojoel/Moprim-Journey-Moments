import React, {useState, useEffect} from 'react'
import {View, Text, Button, ScrollView, SafeAreaView, StyleSheet, FlatList} from 'react-native'
import LoginService from "../services/LoginService"
import FootPrint from "../components/FootPrint"
import DatabaseService from "../services/DatabaseService"
import {ProgressBar} from '@react-native-community/progress-bar-android'

const Stats = () => {
    const [loading, setLoading] = useState(true)
    const [arr, setArr] = useState([])
    const userId = LoginService.getCurrentUser().uid

    useEffect(() => {
        console.log(userId)
        const getMoprimData = async (userId) => {
            const db = await DatabaseService.dbMoprimGET(userId)
            console.log(db)
            iterateData(db)
        }
        getMoprimData(userId)

    }, [])

    const iterateData = (obj) => {
        if (obj === undefined) return undefined
        if (obj === null)  return null
        const array = []
        const keys = Object.values(obj)[0].childKeys
        console.log("keys:", keys)
        keys.forEach(key => {
            const temp = []
            temp.push(Object.values(obj)[0].value[key])
            array.push(temp)
        })
        setArr(array)
        setLoading(false)
    }

    if (loading) {
        return <ProgressBar/>
    }

    return (
        <SafeAreaView>
            <Text>Stats</Text>
            <Button onPress={async () => {
                await getData(userId)
            }} title="Refresh"/>
            <ScrollView style={styles.scrollArea}>
                {arr
                    .map(it => <FootPrint data={it[0]} key={it[0].id}/>)
                }
            </ScrollView>
        </SafeAreaView>
    )

}
const styles = StyleSheet.create({
    scrollArea: {
        marginBottom: 40,
        marginTop: 40,
        backgroundColor: "orange"
    }
})
export default Stats
