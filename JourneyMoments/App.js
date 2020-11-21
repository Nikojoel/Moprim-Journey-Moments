import 'react-native-gesture-handler'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {PERMISSIONS, requestMultiple} from 'react-native-permissions'
import TabNavigator from './navigation/TabNavigator'
import Login from './screens/Login'
import Profile from './screens/Profile'
import Single from "./screens/Single"
import MoprimBridge from './modules/Moprim'
import ChainList from "./components/ChainList"

requestMultiple([
  PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
]).then((statuses) => {
  console.log(
    'Location',
    statuses[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION],
  )
})

const Stack = createStackNavigator()

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
          name="Profile"
          component={Profile}
          options={{headerLeft: null, title: 'Profile'}}
        />
        <Stack.Screen
            name="Single"
            component={Single}
            options={{headerShown: true, title: 'Single'}}
        />
        <Stack.Screen
            name="ChainList"
            component={ChainList}
            options={{headerShown: true, title: 'Your trip'}}
        />
        <Stack.Screen
          name="tabs"
          component={TabNavigator}
          options={{headerLeft: null, title: 'Main'}}
        />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
