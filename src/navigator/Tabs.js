import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home';
import Scan from '../screens/Scan';
import Profile from '../screens/Profile';
import Bluetooth from '../screens/Bluetooth';
const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#1AEBA4',
        
        style: {
          height: '8%',
          alignItems: 'center',
          borderTopLeftRadius: 41,
          borderTopRightRadius: 41,
        },
      }}
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#1AEBA4',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home-sharp" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          tabBarLabel: 'Check-In',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="scan-sharp" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Bluetooth"
        component={Bluetooth}
        options={{
          tabBarLabel: 'Bluetooth',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="bluetooth" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="person-sharp"
              color={color}
              size={30}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
