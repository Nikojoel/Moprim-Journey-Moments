/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Text} from 'react-native';

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
const App = () => (
  <View>
    <Text>MOROO</Text>
  </View>
);

export default App;
