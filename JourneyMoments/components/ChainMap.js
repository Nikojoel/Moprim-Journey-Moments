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
        backgroundColor: "#F5FCFF"
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: "tomato"
    },
    map: {
        flex: 1
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

const ChainMap = ({ data }) => {
   
        const initial = data[0]
        const last = data[data.length - 1]
        
        const reversedCoords = []
        data.forEach(it => {
            reversedCoords.push([it[1],it[0]])
        })
        const shapeSource = {
            "type": "LineString",
            "coordinates": reversedCoords
        }
    
    if (data == null) return (<></>)
    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <MapboxGL.MapView style={styles.map}>
                    <MapboxGL.Camera
                        zoomLevel={9}
                        centerCoordinate={reversedCoords[0]}
                    />
                    
                    <MapboxGL.ShapeSource id={Helper.generateUUID()} shape={shapeSource}>
                        <MapboxGL.LineLayer id={Helper.generateUUID()} style={{ lineColor: 'red', lineWidth: 2 }} />
                    </MapboxGL.ShapeSource>
                </MapboxGL.MapView>
            </View>
        </View>
    )
}

export default ChainMap