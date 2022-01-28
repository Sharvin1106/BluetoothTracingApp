import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
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
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="SignUp"
          component={SignUp}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Home"
          component={Tabs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
