import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import SignUp from '../screens/SignUp';
import Tabs from './Tabs';
import {getUser} from '../utils/Auth';
import {useSelector, useDispatch} from 'react-redux';
import {authenticateUser} from '../redux/auth';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};

const App = () => {
  const {auth} = useSelector(state => state.auth);
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {auth ? (
          <Stack.Screen name="Home" component={Tabs} />
        ) : (
          <Stack.Screen name="SignUp" component={SignUp} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
