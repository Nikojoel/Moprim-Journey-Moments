import React from 'react'
import MapboxGL from "@react-native-mapbox-gl/maps"
import { View, StyleSheet, Dimensions } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome5'
import API_KEY from '../Keys'
import Helper from "../helpers/Helper";
import Colors from '../values/Colors'

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

const Map = ({ data }) => {
    
    const coords = data
    const initial = coords[0]
    const last = coords[coords.length - 1]
    
    const reversedCoords = []
    coords.forEach(it => {
        reversedCoords.push([it[1],it[0]])
    })
    const shapeSource = {
        "type": "LineString",
        "coordinates": reversedCoords
    }

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <MapboxGL.MapView 
                    style={styles.map}
                    logoEnabled={false}
                    attributionEnabled={false}
                    styleURL={'mapbox://styles/enarm/ckhnrwos315eq19mc0k1wynfj'}
                >
                    <MapboxGL.Camera
                        zoomLevel={10}
                        centerCoordinate={reversedCoords[0]}
                    />
                    <MapboxGL.PointAnnotation coordinate={[last[1], last[0]]} id={Helper.generateUUID()}>
                            <Icon name={"flag-checkered"} size={30} color={"black"}/>
                    </MapboxGL.PointAnnotation>
                    <MapboxGL.PointAnnotation coordinate={[initial[1], initial[0]]} id={Helper.generateUUID()}/>
                    <MapboxGL.ShapeSource id={Helper.generateUUID()} shape={shapeSource}>
                        <MapboxGL.LineLayer id={Helper.generateUUID()} style={{ lineColor: 'red', lineWidth: 2 }} />
                    </MapboxGL.ShapeSource>
                </MapboxGL.MapView>
            </View>
        </View>
    )
}

export default Map
