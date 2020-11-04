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

export default {
    generateUUID,
    generateRandom,
    millisToMinutesAndSeconds,
    unixToTime,
    unixToDate,
    unixToSimpleDate
}

