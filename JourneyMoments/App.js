import 'react-native-gesture-handler'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {PERMISSIONS, requestMultiple} from 'react-native-permissions'
import TabNavigator from './navigation/TabNavigator'
import Login from './screens/Login'
import Profile from './screens/Profile'
import Single from "./screens/Single"
import ChainList from "./components/ChainList"
import Colors from "./values/Colors"
import {StatusBar, Image, View, Text} from "react-native"

requestMultiple([
  PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.RECORD_AUDIO,
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
      <StatusBar backgroundColor={Colors.primaryColor}/>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
              headerShown: true, title: 'Profile',
              headerTintColor: 'black',
              headerStyle: {
                  backgroundColor: Colors.primaryColor}}}
        />
        <Stack.Screen
            name="Single"
            component={Single}
            options={{
                headerShown: true, title: 'Single',
                headerTintColor: 'black',
                headerStyle: {
                    backgroundColor: Colors.primaryColor}}}
        />
        <Stack.Screen
            name="ChainList"
            component={ChainList}
            options={{
                headerShown: true, title: 'Your trip',
                headerTintColor: 'black',
                headerStyle: {
                    backgroundColor: Colors.primaryColor
                }}}
        />
        <Stack.Screen
          name="tabs"
          component={TabNavigator}
          options={{
            headerLeft: null,
            headerTitleAlign: 'center',
            title:
                <View style={{alignItems: 'center'}}>
                  <Image style={{width: 100, height: 18}} source={require('./images/Moprim-Logo.png')}/>
                  <Text>Journey Moments</Text>
                </View>,
            defaultNavigationOptions: {
              headerTitleAlign: 'center'
            },
            headerTintColor: Colors.note,
            headerStyle: {
              backgroundColor: Colors.primaryColor
            }
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
