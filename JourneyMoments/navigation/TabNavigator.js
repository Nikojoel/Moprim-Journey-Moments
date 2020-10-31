import React, {useState} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Placeholder from '../screens/placeholder';
import LoginScreen from '../screens/Login';

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Placeholder} />
      <Tab.Screen name="Messages" component={LoginScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
