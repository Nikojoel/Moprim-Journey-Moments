import Colors from "../values/Colors"

const generateRandom = () => {
    const data = [
        "null",
        "unknown",
        "stationary",
        "non-motorized",
        "non-motorized/bicycle",
        "non-motorized/pedestrian",
        "non-motorized/pedestrian/walk",
        "non-motorized/pedestrian/run",
        "motorized",
        "motorized/road",
        "motorized/road/car",
        "motorized/road/bus",
        "motorized/rail",
        "motorized/rail/tram",
        "motorized/rail/train",
        "motorized/rail/metro",
        "motorized/air/plane"
    ]
    const random = Math.floor(Math.random() * 16) + 1
    console.log(data[random])
    return data[random]
}

const transportIcon = (type) => {
    switch (type) {
        case 'null': return {icon: 'alert', color: Colors.motor}
        case 'unknown': return {icon:'help', color:Colors.motor}
        case 'stationary': return {icon:'bed', color:Colors.nonMotor}
        case 'non-motorized': return {icon:'walk',color:Colors.nonMotor}
        case 'non-motorized/bicycle': return {icon:'bicycle', color:Colors.nonMotor}
        case 'non-motorized/pedestrian/walk': return {icon:'walk', color:Colors.nonMotor}
        case 'non-motorized/pedestrian/run': return {icon:'walk', color:Colors.nonMotor}
        case 'motorized': return {icon:'car', color:Colors.motor}
        case 'motorized/road': return {icon:'car', color:Colors.motor}
        case 'motorized/road/car': return {icon:'car', color:Colors.motor}
        case 'motorized/road/bus': return {icon:'bus', color:Colors.motor}
        case 'motorized/rail': return {icon:'train', color:Colors.rail}
        case 'motorized/rail/tram': return {icon:'train', color:Colors.rail}
        case 'motorized/rail/train': return {icon:'train', color:Colors.rail}
        case 'motorized/rail/metro': return {icon:'train', color:Colors.rail}
        case 'motorized/air/plane': return {icon:'plane', color:Colors.plane}
    }
}

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    });
}

const millisToMinutesAndSeconds = (millis) => {
    const minutes = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + 'm' + (seconds < 10 ? '0' : '') + seconds + 's'
}

const unixToTime = (millis) => {
    const date = new Date(millis).toLocaleTimeString().split(":")
    console.log(date)
    return date[0] + ":" + date[1]
}

const unixToDate = (unix) => {
    return new Date(unix).toLocaleString()
}

const unixToSimpleDate = (unix) => {
    return new Date(unix).toLocaleDateString()
}

const parseJSON = (data) => {
    return JSON.parse(JSON.stringify(data))
}

const iterateData = (obj) => {
    if (obj === undefined) return undefined
    if (obj === null)  return null
    const array = []
    const keys = Object.values(obj)[0].childKeys
    keys.forEach(key => {
        const temp = []
        temp.push(Object.values(obj)[0].value[key])
        array.push(temp)
    })
    return array
}

export default {
    generateUUID,
    generateRandom,
    millisToMinutesAndSeconds,
    unixToTime,
    unixToDate,
    unixToSimpleDate,
    parseJSON,
    transportIcon,
    iterateData
}

