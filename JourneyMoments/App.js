/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import Placeholder from './screens/placeholder';
import TabNavigator from './navigation/TabNavigator';
import Login from './screens/Login';

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

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="test"
          component={Placeholder}
          options={{headerLeft: null}}
        />
        <Stack.Screen
          name="tabs"
          component={TabNavigator}
          options={{headerLeft: null, title: 'moroporo'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
