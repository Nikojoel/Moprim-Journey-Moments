import React from 'react'
import MapboxGL from "@react-native-mapbox-gl/maps"
import {View, StyleSheet} from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome5'
import API_KEY from '../Keys'
import Helper from "../helpers/Helper";

const Decoder = require('@mapbox/polyline')
MapboxGL.setAccessToken(API_KEY)
MapboxGL.setConnected(true)

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#F5FCFF"
    },
    container: {
        height: "100%",
        width: "100%",
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

const Map = ({data}) => {
    const coords = Decoder.decode(data.polyline)
    const initial = coords[0]
    const last = coords[coords.length - 1]

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <MapboxGL.MapView style={styles.map}>
                    <MapboxGL.Camera
                        zoomLevel={8}
                        centerCoordinate={[initial[1], initial[0]]}
                    />
                    <MapboxGL.PointAnnotation coordinate={[last[1], last[0]]} id={Helper.generateUUID()}>
                            <Icon name={"flag-checkered"} size={30} color={"black"}/>
                    </MapboxGL.PointAnnotation>
                    <MapboxGL.PointAnnotation coordinate={[initial[1], initial[0]]} id={Helper.generateUUID()}/>
                    {coords
                        .map(it =>
                            <MapboxGL.PointAnnotation coordinate={[it[1], it[0]]} key={it} id={Helper.generateUUID()}>
                                <View style={styles.point}/>
                            </MapboxGL.PointAnnotation>)
                    }
                </MapboxGL.MapView>
            </View>
        </View>
    )
}

export default Map
