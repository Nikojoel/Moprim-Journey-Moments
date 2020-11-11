import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../values/Colors'
import Home from '../screens/Home'
import Trips from '../screens/Trips'
import Stats from '../screens/Stats'
import {Text, Button} from 'react-native'

const Tab = createBottomTabNavigator()

const TabNavigator = ({navigation}) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
          <Ionicons onPress={() => navigation.navigate("Profile")} name={'person'} size={30} color={'#000000'} />
      ),
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline'
          } else if (route.name === 'Trips') {
            iconName = focused ? 'planet' : 'planet-outline'
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline'
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.primaryColor,
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Trips" component={Trips} />
      <Tab.Screen name="Stats" component={Stats} navigation={navigation}/>
    </Tab.Navigator>
  )
}

export default TabNavigator
