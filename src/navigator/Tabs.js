import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Scan from '../screens/Scan';
import Bluetooth from '../screens/Bluetooth';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Scan" component={Scan} />
      <Tab.Screen name="Bluetooth" component={Bluetooth} />
    </Tab.Navigator>
  );
};

export default Tabs;
