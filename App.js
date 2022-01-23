/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
// import 'react-native-gesture-handler';
import React,{useEffect} from 'react';

import {StyleSheet, Text, View, Image} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import AppContainer from './src/navigator/App';
import BLEBackgroundService from './src/services/BackgroundBleService';
import BackgroundTaskServices from './src/services/BackgroundTaskService';
import {createChannel} from './src/services/NotificationService';

const App = () => {
  useEffect(() => {
    BackgroundTaskServices.start();
    BLEBackgroundService.init();
    createChannel();
    initializeFirebaseRemoteConfig();
  });
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default App;
