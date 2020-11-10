import React, {useState, useEffect} from 'react'
import MapboxGL from "@react-native-mapbox-gl/maps";
import {View, StyleSheet, Button, Text} from "react-native"
import {ProgressBar} from "@react-native-community/progress-bar-android";
const Decoder = require('@mapbox/polyline')

MapboxGL.setAccessToken("pk.eyJ1Ijoibmlra2VsaSIsImEiOiJja2hhaWI5amsxNzlwMzNydG83cWR5MngxIn0.9XY913z2vHAUedKktXeWRg")
MapboxGL.setConnected(true)

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#F5FCFF"
    },
    container: {
        height: 300,
        width: 300,
        backgroundColor: "tomato"
    },
    map: {
        flex: 1
    }
})

const Map = () => {
    const [coords, setCoords] = useState([])
    const [initial ,setInitial] = useState([])
    const [loading, setLoading] = useState(true)
    const init = [60.17466, 24.80263]
    const initFin = [24.80263, 60.17466]

    useEffect(() => {
        const decode = async () => {
            setCoords(await Decoder.decode("szgnJmgkvCUOIb@]Pa@?m@AS@Ow@YcAEkAGg@KgAEgA@qAEgAUaA@w@_@Ja@Re@Pg@k@[UGs@Cy@Eu@Iw@Iq@Es@Gq@Im@Oq@a@AWTOf@Hp@ZIBf@DhABnAPxAR`A^SXYT^B~@CrARO^c@^EXQd@[d@GRh@Fh@Bp@D~@GjAOj@T[j@KXHZDZOa@GIu@SY"))
            setInitial(coords[0])
            console.log("Initial:", initial)
            console.log("Decoded:", coords)
            setLoading(false)
        }
        decode()
    }, [])

    if (loading) {
        return <ProgressBar/>
    }

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <MapboxGL.MapView style={styles.map}>
                    <MapboxGL.Camera
                        zoomLevel={6}
                        centerCoordinate={[init[1], init[0]]}
                    />
                    {coords
                        .map(it => <MapboxGL.PointAnnotation coordinate={[it[1], it[0]]} key={it}/>)
                    }
                </MapboxGL.MapView>
            </View>
        </View>
    )
}

export default Map