import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../screens/Home'
import Trips from '../screens/Trips'
import Stats from '../screens/Stats'

const Tab = createBottomTabNavigator()
const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Trips" component={Trips} />
      <Tab.Screen name="Stats" component={Stats} />
    </Tab.Navigator>
  )
}

export default TabNavigator
