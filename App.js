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
import PushNotification from 'react-native-push-notification';

import {StyleSheet, Text, View, Image} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {store} from './src/redux/store';
import {Provider, useDispatch} from 'react-redux';
import AppContainer from './src/navigator/App';

import {createChannel} from './src/services/NotificationService';
import {initializeFirebaseRemoteConfig} from './src/utils/remoteConfig';
import {getData, storeData} from './src/utils/storage';
import {LogBox} from 'react-native';
import {startServices} from './src/utils/initialService';
import {requestUserPermission} from './src/utils/Auth';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
  useEffect(() => {
    (async () => {
      try {
        const allowTracing = await getData('allow_tracing');
        if (allowTracing) {
          startServices();
        }
      } catch (error) {
        console.log(error);
      }
    })();
    createChannel();
    initializeFirebaseRemoteConfig();
    requestUserPermission();
    const messageListener = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        channelId: 'test-channel',
      });
    });
    return messageListener;
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
