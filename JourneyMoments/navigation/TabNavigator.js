import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-ionicons'
import Home from '../screens/Home'
import Trips from '../screens/Trips'
import Stats from '../screens/Stats'

const Tab = createBottomTabNavigator()
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home'
          } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-list-box' : 'ios-list'
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Trips" component={Trips} />
      <Tab.Screen name="Stats" component={Stats} />
    </Tab.Navigator>
  )
}

export default TabNavigator
