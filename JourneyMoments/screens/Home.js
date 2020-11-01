import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'
import MoprimBridge from '../modules/Moprim'


const Home = () => {
  const [text, setText] = useState('')

  const getMoprim = async () => {

    try {
      const result = await MoprimBridge.getResults()
      const obj = JSON.parse(result)
      var tempString = ''
      console.log(result)

      obj.forEach((it) => {
        const time = millisToMinutesAndSeconds(
          it.timestampEnd - it.timestampStart,
        )
        tempString += `${it.originalActivity} ${time}\n`
      })
      setText(tempString)
    } catch (e) {
      console.log(e)
    }
  }

  const millisToMinutesAndSeconds = (millis) => {
    const minutes = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
  }
  return (
    <View>
      <Text>Home</Text>
      <Button onPress={() => MoprimBridge.uploadMoprim()} title='upload'/>
      <Button onPress={() => {
        getMoprim()
        console.log(text)}
      } title='get'/>
    </View>
  )
}

export default Home