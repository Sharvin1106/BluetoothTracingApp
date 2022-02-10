import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import UserForm from '../screens/UserForm';
const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};

const Form = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="UserForm"
        component={UserForm}
      />

      {/* <Stack.Screen
        options={{headerShown: false}}
        name="UserForm"
        component={UserForm}
      /> */}
    </Stack.Navigator>
  );
};

export default Form;
