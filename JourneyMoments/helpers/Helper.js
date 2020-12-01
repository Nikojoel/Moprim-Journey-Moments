import Colors from "../values/Colors"

const dummy = "https://firebasestorage.googleapis.com/v0/b/journey-moments.appspot.com/o/Media%2Fdummy.png?alt=media&token=ae1dd9a5-db68-47df-b571-102ab8ce5f68"

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
    
    return data[random]
}

const transportIcon = (type) => {
    switch (type) {
        case 'null': return {icon: 'alert', color: Colors.motor, fetch: false}
        case 'unknown': return {icon:'help', color:Colors.motor, fetch: false}
        case 'stationary': return {icon:'bed', color:Colors.nonMotor, fetch: false}
        case 'non-motorized': return {icon:'walk',color:Colors.nonMotor, fetch: false}
        case 'non-motorized/bicycle': return {icon:'bicycle', color:Colors.nonMotor, fetch: false}
        case 'non-motorized/pedestrian/walk': return {icon:'walk', color:Colors.nonMotor, fetch: false}
        case 'non-motorized/pedestrian/run': return {icon:'walk', color:Colors.nonMotor, fetch: false}
        case 'motorized': return {icon:'car', color:Colors.motor, fetch: false}
        case 'motorized/road': return {icon:'car', color:Colors.motor, fetch: false}
        case 'motorized/road/car': return {icon:'car', color:Colors.motor, fetch: false}
        case 'motorized/road/bus': return {icon:'bus', color:Colors.motor, fetch: true}
        case 'motorized/rail': return {icon:'train', color:Colors.rail, fetch: false}
        case 'motorized/rail/tram': return {icon:'train', color:Colors.rail,fetch: true}
        case 'motorized/rail/train': return {icon:'train', color:Colors.rail, fetch: false}
        case 'motorized/rail/metro': return {icon:'train', color:Colors.rail, fetch: true}
        case 'motorized/air/plane': return {icon:'plane', color:Colors.plane, fetch: false}
    }
}

const transportMethod = (type) => {
    switch (type) {
        case 'null': return {method: 'null', rateable: false}
        case 'unknown': return {method: 'null', rateable: false}
        case 'stationary': return {method: 'Stationary', rateable: false}
        case 'non-motorized': return {method: 'Non motorized', rateable: false}
        case 'non-motorized/bicycle': return {method: 'Bicycle', rateable: false}
        case 'non-motorized/pedestrian/walk': return {method: 'Walk', rateable: false}
        case 'non-motorized/pedestrian/run': return {method: 'Run', rateable: false}
        case 'motorized': return {method: 'Motorized', rateable: false}
        case 'motorized/road': return {method: 'Motorized', rateable: false}
        case 'motorized/road/car': return {method: 'Car', rateable: false}
        case 'motorized/road/bus': return {method: 'Bus', rateable: true}
        case 'motorized/rail': return {method: 'Rail', rateable: true}
        case 'motorized/rail/tram': return {method: 'Tram', rateable: true}
        case 'motorized/rail/train': return {method: 'Train', rateable: true}
        case 'motorized/rail/metro': return {method: 'Metro', rateable: true}
        case 'motorized/air/plane': return {method: 'Plane', rateable: true}
    }
}

const ratingColor = (rating) => {
    let rate
    if (rating <= 15) {
        rate = 1
    } else if (rating > 15 && rating < 50) {
        rate = 2
    } else if (rating > 50) {
        rate = 3
    }
    switch(rate) {
        case 1: return Colors.greenRating
        case 2: return Colors.yellowRating
        case 3: return Colors.redRating
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
    iterateData,
    dummy,
    ratingColor,
    transportMethod,
}

