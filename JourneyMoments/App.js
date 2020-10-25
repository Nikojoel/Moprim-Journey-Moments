/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Button, Text, NativeModules} from 'react-native';
import MoprimBridge from './modules/Moprim';

import {PERMISSIONS, requestMultiple} from 'react-native-permissions';

requestMultiple([
  PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
]).then((statuses) => {
  console.log(
    'Location',
    statuses[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION],
  );
  console.log('Activity', statuses[PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION]);
});

const startMoprim = () => {
  MoprimBridge.start();
};

const stopMoprim = () => {
  MoprimBridge.stop();
};

const App = () => (
  <View>
    <Button title="start moprim" onPress={() => startMoprim()} />
    <Button title="stop moprim" onPress={() => stopMoprim()} />
  </View>
);

export default App;
