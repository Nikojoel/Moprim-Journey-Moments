import React from 'react'
import MapboxGL from "@react-native-mapbox-gl/maps"
import {View, StyleSheet} from "react-native"
import API_KEY from '../Keys'
import Helper from "../helpers/Helper"
import {ProgressBar} from "@react-native-community/progress-bar-android"
import Colors from "../values/Colors"

MapboxGL.setAccessToken(API_KEY)
MapboxGL.setConnected(true)
MapboxGL.setTelemetryEnabled(false)

const ChainMap = ({ data, trips }) => {
    if (data == null) {
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

    const initial = data[0][0]
    const reversedCoords = []
    data.forEach(day => {
        const reverseDay = []
        day.forEach(it => {
            reverseDay.push([it[1], it[0]])
        })

        reversedCoords.push(reverseDay)
    })
    const coords = []
    reversedCoords.forEach(it => {
        const shapeSource = {
            "type": "LineString",
            "coordinates": it
        }
        coords.push(shapeSource)
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
                    {coords.map(
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

export default ChainMap