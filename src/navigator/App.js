import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import SignUp from '../screens/SignUp';
import UserForm from '../screens/UserForm';
import Auth from './auth';
import Tabs from './Tabs';
import {getUser} from '../utils/Auth';
import {useSelector, useDispatch} from 'react-redux';
import {authenticateUser} from '../redux/auth';
import auth from '@react-native-firebase/auth';

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
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="Auth"
          component={Auth}
        />
        {/* auth().currentUser? (
        <Stack.Screen
          options={{headerShown: false}}
          name="UserForm"
          component={UserForm}
        />
        ):( */}
        <Stack.Screen
          options={{headerShown: false}}
          name="Tabs"
          component={Tabs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
