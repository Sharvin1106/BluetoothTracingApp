/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
// import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

import {StyleSheet, Text, View, Image} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {store} from './src/redux/store';
import {Provider, useDispatch} from 'react-redux';
import AppContainer from './src/navigator/App';
import BLEBackgroundService from './src/services/BackgroundBleService';
import BackgroundTaskServices from './src/services/BackgroundTaskService';
import {createChannel} from './src/services/NotificationService';
import {initializeFirebaseRemoteConfig} from './src/utils/remoteConfig';
import {getData, storeData} from './src/utils/storage';
import {LogBox} from 'react-native';
import auth from '@react-native-firebase/auth';
import {getUser} from './src/api';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
  const getCurrentUser = async () => {
    try {
      console.log(auth().currentUser.uid);
      const user = await getUser(auth().currentUser.uid);
      //console.log(user);
      storeData('my_bluetooth_uuid', user.uuid);
    } catch (error) {
      console.log(error);
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();
      console.log('Authorization status:', authStatus);
    }
  };

  const getMyUUID = async () => {
    return await getData('my_bluetooth_uuid');
  };

  useEffect(() => {
    //getCurrentUser();
    BackgroundTaskServices.start();
    console.log(getData('my_bluetooth_uuid'));
    BLEBackgroundService.init();
    createChannel();
    initializeFirebaseRemoteConfig();
    requestUserPermission();
  });
  return (
    <Provider store={store}>
      <PaperProvider>
        <AppContainer />
      </PaperProvider>
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default App;
