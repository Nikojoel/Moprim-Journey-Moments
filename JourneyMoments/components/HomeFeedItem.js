import React, {useEffect, useState} from "react"
import {StyleSheet, Image} from "react-native"
import {View, Text, Icon} from 'native-base'
import Helper from "../helpers/Helper"
import Colors from "../values/Colors"
import {TouchableOpacity} from "react-native-gesture-handler"
import DatabaseService from "../services/DatabaseService"

const HomeFeedItem = ({ item, navigation }) => {
    const transitId = item.userId.toString() + item.timestampStart.toString() + item.id.toString()
    const { icon, color, fetch} = Helper.transportIcon(item.activity)
    const time = Helper.unixToTime(parseInt(item.timestampStart))
    const endTime = Helper.unixToTime(parseInt(item.timestampEnd))
    const arr = Helper.unixToSimpleDate(item.timestampStart).split("/")
    const date = `${arr[1]}.${arr[0]}.${arr[2]}`
    const co2 = Math.round(parseInt(item.co2))
    const rating = Helper.ratingColor(item.user.rating)
    const [digiTransit, setDigiTransit] = useState(null)
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    const iterateData = (obj) => {
        if (obj === undefined) return undefined
        if (obj === null) return null
        const array = []
        const keys = Object.values(obj)[0].childKeys
        keys.forEach(key => {
            array.push(Object.values(obj)[0].value[key])
        })
        return array[0]
    }

    const getTransportNumber = async (id) => {
        try {
            const result = await DatabaseService.dbDigiTransitGET(id)
            const iterate = iterateData(result)
            setDigiTransit(iterate)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        setMounted(true)
        if (fetch && mounted) {
           getTransportNumber(transitId)
        }
        setMounted(false)
    }, [digiTransit])

    

    return (
        <View noBorder style={container(color)}>
            <TouchableOpacity onPress={() => navigation.navigate("Single", {item, digiTransit})}>
                <View style={{ flexDirection: 'row' }}>
                    {digiTransit && <>
                        <Text style={{marginTop: 15}}>{digiTransit.transportId}</Text>
                    </>}
                    <Icon name={icon} style={styles.mainIcon} />
                    <View style={{ flexDirection: 'column', marginRight: 10, justifyContent: 'center'}}>
                        <Image source={{ uri: item.user.photoURL }} style={{
                            width: 50,
                            height: 50,
                            alignSelf: 'flex-end',
                            borderRadius: 25,
                            borderWidth: 2,
                            borderColor: rating
                        }} />
                    <Text style={{fontSize: 12, alignSelf: 'center', marginTop: 5}}>{item.user.username}</Text>
                    </View>
                </View>
                <Text>{date}</Text>
                <Text>{time} - {endTime}</Text>
                {digiTransit && <>
                    <Text>{digiTransit.from} - {digiTransit.to}</Text>
                </>}
                <Text style={styles.noteText}>{item.distance}m</Text>
                {co2 !== 0 && <>
                    <Text style={styles.noteText}>{co2} grams of CO2</Text>
                </>}
                {item.co2 === 0 && <>
                    <Text style={styles.noteText}>-</Text>
                </>}
            </TouchableOpacity>
        </View>
    )
}

const container = (color) => {
    return {
        backgroundColor: color,
        flexDirection: 'column',
        padding: 10,
        flex: 1,
        margin: 2
    }
}

const styles = StyleSheet.create({
    noteText: {
        fontSize: 14,
        color: Colors.note
    },
    container: {
        backgroundColor: Colors.plane,
        flexDirection: 'column',
        flex: 1,
        margin: 2
    },
    mainIcon: {
        fontSize: 50,
        paddingHorizontal: 10,
        flex: 1
    },
    ratingIcon: {
        fontSize: 24,
        textAlign: 'center',
        flex: 1
    },
    ratingText: {
        flex: 1,
        textAlign: 'left'
    },
    profile: {   
        width: 50,
        height: 50,
        alignSelf: 'flex-end',
        borderRadius: 25
    }

})

export default HomeFeedItem
