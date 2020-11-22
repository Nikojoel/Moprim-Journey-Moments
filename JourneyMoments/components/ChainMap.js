import React from 'react'
import MapboxGL from "@react-native-mapbox-gl/maps"
import { View, StyleSheet, Dimensions } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome5'
import API_KEY from '../Keys'
import Helper from "../helpers/Helper";

MapboxGL.setAccessToken(API_KEY)
MapboxGL.setConnected(true)
MapboxGL.setTelemetryEnabled(false);


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "#F5FCFF"
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: "tomato"
    },
    map: {
        flex: 1,
        color: '#466266',
    },
    point: {
        height: 20,
        width: 20,
        backgroundColor: '#00cccc',
        borderRadius: 50,
        borderColor: '#ffffff',
        borderWidth: 2
    },
})

const ChainMap = ({ data, trips }) => {
    if (data == null) return (<></>)

    const initial = data[0][0]
    const last = data[0][data.length - 1]
    const reversedCoords = []
    data.forEach(day => {
        const reverseDay = []
        day.forEach(it => {
            reverseDay.push([it[1], it[0]])
        })

        reversedCoords.push(reverseDay)
    })
    const hyvatSetit = []
    reversedCoords.forEach(it => {
        const shapeSource = {
            "type": "LineString",
            "coordinates": it
        }
        hyvatSetit.push(shapeSource)
    })

    const tripStyles = []
    trips.forEach(it => {
        tripStyles.push(Helper.transportIcon(it.activity))
    })

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <MapboxGL.MapView 
                    style={styles.map} 
                    logoEnabled={false}
                    attributionEnabled={false}
                    center={[initial[1], initial[0]]}
                    styleURL={'mapbox://styles/enarm/ckhnrwos315eq19mc0k1wynfj'}>
                    <MapboxGL.Camera
                        zoomLevel={9}
                        centerCoordinate={[initial[1], initial[0]]}
                    />
                    {hyvatSetit.map(
                        (it, index) => {
                            const key = initial[1] + (index + 3)
                            const key2 = initial[1] - (index + 2)
                            return (
                        <MapboxGL.ShapeSource id={String(key)} shape={it}>
                                <MapboxGL.LineLayer id={String(key2)} style={{ lineColor: tripStyles[index].color, lineWidth: 2 }} />   
                    </MapboxGL.ShapeSource>)})}

                </MapboxGL.MapView>
            </View>
        </View>
    )
}

export default ChainMap