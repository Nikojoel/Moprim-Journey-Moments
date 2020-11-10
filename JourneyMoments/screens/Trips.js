import React from 'react'
import { View, Text } from 'react-native'
import Map from "../components/Map";

const data123 = {
    co2: "20.3",
    correctedActivity: "null",
    distance: "1160.0",
    id: "a84ef16f-6171-4d06-b450-17f1d012eeea",
    metadata: "null",
    originalActivity: "motorized/road/bus",
    polyline:
        "szgnJmgkvCUOIb@]Pa@?m@AS@Ow@YcAEkAGg@KgAEgA@qAEgAUaA@w@_@Ja@Re@Pg@k@[UGs@Cy@Eu@Iw@Iq@Es@Gq@Im@Oq@a@AWTOf@Hp@ZIBf@DhABnAPxAR`A^SXYT^B~@CrARO^c@^EXQd@[d@GRh@Fh@Bp@D~@GjAOj@T[j@KXHZDZOa@GIu@SY",
    speed: "0.0012497252759091752",
    syncedWithCloud: "true",
    timestampDownload: "1603387823109",
    timestampEnd: "1603385367839",
    timestampStart: "1603384439635",
    userId: "XmQUTrAnu4ZPTSTN6vCnOs5nTqh2"
}

const Trips = () => {
  return (
    <View>
        <Map data={data123}/>
    </View>
  )
}

export default Trips
