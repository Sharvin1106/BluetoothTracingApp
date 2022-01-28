import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import Tabs from './Tabs';
import {getUser} from '../utils/Auth';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};

const App = () => {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {getUser() ? (
          <Stack.Screen name="Main" component={Tabs} />
        ) : (
          <Stack.Screen name="SignUp" component={SignUp} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
