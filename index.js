/**
 * @format
 */
import React from 'react';
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import {executeTask} from './src/services/BackgroundTaskService';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import PushNotification from 'react-native-push-notification';

let MyHeadlessTask = async ({taskId}) => {
  console.log('[BackgroundService] Headless Task start: ', taskId);
  executeTask();
  console.log('[BackgroundService] Headless Task finish: ', taskId);

  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(taskId);
};

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  requestPermissions: Platform.OS === 'ios',
});

GoogleSignin.configure({
  webClientId:
    '843906366317-730qd5bblgoioak6d92ctjhmf58cpth4.apps.googleusercontent.com',
});

AppRegistry.registerComponent(appName, () => App);
