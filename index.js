/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '843906366317-730qd5bblgoioak6d92ctjhmf58cpth4.apps.googleusercontent.com',
});

AppRegistry.registerComponent(appName, () => App);
