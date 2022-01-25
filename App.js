/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
// import 'react-native-gesture-handler';
import React, {useEffect} from 'react';

import {StyleSheet, Text, View, Image} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';
import AppContainer from './src/navigator/App';
import BLEBackgroundService from './src/services/BackgroundBleService';
import BackgroundTaskServices from './src/services/BackgroundTaskService';
import {createChannel} from './src/services/NotificationService';
import {initializeFirebaseRemoteConfig} from './src/utils/remoteConfig';

const App = () => {
  useEffect(() => {
    BackgroundTaskServices.start();
    BLEBackgroundService.init();
    createChannel();
    initializeFirebaseRemoteConfig();
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
