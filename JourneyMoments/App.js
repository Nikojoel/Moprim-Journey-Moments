/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react'
import {View, Button, Text, NativeModules} from 'react-native'
import MoprimBridge from './modules/Moprim'
import Login from "./components/Login"
import {PERMISSIONS, requestMultiple} from 'react-native-permissions'
import Upload from "./components/Upload";

requestMultiple([
  PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
]).then((statuses) => {
  console.log(
    'Location',
    statuses[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION],
  );
  console.log('Activity', statuses[PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION])
});

const App = () => {
  const [text, setText] = useState('')

  const startMoprim = () => {
    MoprimBridge.start()
  };

  const stopMoprim = () => {
    MoprimBridge.stop()
  };

  const millisToMinutesAndSeconds = (millis) => {
    const minutes = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
  };

  const getMoprim = async () => {
    try {
      const result = await MoprimBridge.getResults()
      const obj = JSON.parse(result)
      var text = ''

      obj.forEach((it) => {
        const time = millisToMinutesAndSeconds(
          it.timestampEnd - it.timestampStart,
        );
        text += `${it.originalActivity} ${time}\n`
      });
      setText(text)
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <View>
      <Button
        title="start moprim"
        onPress={() => {
          setText('start')
          startMoprim()
        }}
      />
      <Button
        title="stop moprim"
        onPress={() => {
          setText('stop')
          stopMoprim()
        }}
      />
      <Button title="get results" onPress={() => getMoprim()} />
      <Text>{text}</Text>
        <Login/>
        <Upload/>
    </View>
  );
};

export default App;
