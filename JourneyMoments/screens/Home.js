import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'
import MoprimBridge from '../modules/Moprim'


const Home = () => {
  const [text, setText] = useState('')
  const [result, setResult] = useState([])

  const getMoprim = async (it) => {
    try {
      const result = await MoprimBridge.getFakeResults(it)
      const obj = JSON.parse(result)
      obj.forEach((it) => {
        setResult(arr => [...arr, it])
      })
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
        [...Array(7).keys()].forEach(it => {
          getMoprim(it)
        })
      }
      } title='get'/>
      <Button onPress={() => console.log(result.length)} title='size'/>

    </View>
  )
}

export default Home