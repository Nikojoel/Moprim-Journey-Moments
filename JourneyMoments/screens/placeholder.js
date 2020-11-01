import React, {useState, useEffect} from 'react';
import MoprimBridge from '../modules/Moprim';
import {NavigationContainer} from '@react-navigation/native';
import {BackHandler, Button, Image, Text, View} from 'react-native';
import Login from './Login';
import Upload from '../components/Upload';
import DownloadService from '../services/DownloadService';
import Colors from '../values/Colors';

const Placeholder = () => {
  const [text, setText] = useState();
  const [download, setDownload] = useState();

  const startMoprim = () => {
    MoprimBridge.start();
  };

  const stopMoprim = () => {
    MoprimBridge.stop();
  };

  const millisToMinutesAndSeconds = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  };

  const getMoprim = async () => {
    try {
      const result = await MoprimBridge.getResults();
      const obj = JSON.parse(result);
      var text = '';

      obj.forEach((it) => {
        const time = millisToMinutesAndSeconds(
          it.timestampEnd - it.timestampStart,
        );
        text += `${it.originalActivity} ${time}\n`;
      });
      setText(text);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => {
        return true;
      });
  }, []);

  return (
    <View>
      <Button
        title="start moprim"
        onPress={() => {
          setText('start');
          startMoprim();
        }}
      />
      <Button
        title="stop moprim"
        onPress={() => {
          setText('stop');
          stopMoprim();
        }}
      />
      <Button title="get results" onPress={() => getMoprim()} />
      <Text>{text}</Text>
      <Login />
      <Upload />
      <Image source={{uri: download}} style={{width: 250, height: 250}} />
    </View>
  );
};

export default Placeholder;
