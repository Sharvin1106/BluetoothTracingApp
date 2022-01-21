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
import { initializeFirebaseRemoteConfig } from './src/utils/remoteConfig';

const App = () => {
  useEffect(()=>{
    initializeFirebaseRemoteConfig();
  },[])
  return (
    <PaperProvider>
      <AppContainer />
    </PaperProvider>
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
