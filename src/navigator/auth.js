import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import SignUp from '../screens/SignUp';
import UserForm from '../screens/UserForm';
import Tabs from './Tabs';
const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};

const Auth = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="SignUp"
        component={SignUp}
      />

      {/* <Stack.Screen
        options={{headerShown: false}}
        name="UserForm"
        component={UserForm}
      /> */}
    </Stack.Navigator>
  );
};

export default Auth;
