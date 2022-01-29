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

// import {authenticateUser} from './src/redux/auth';
import {PermissionsAndroid} from 'react-native';
import BLEAdvertiser from 'react-native-ble-advertiser';
import {getUser} from './src/utils/Auth';

const App = () => {
  // const dispatch = useDispatch();

import {getUser} from './src/utils/Auth';

const App = () => {

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

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'BLE Avertiser Example App',
            message: 'Example App access to your location ',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the location');
        } else {
          console.log('location permission denied');
        }
      }

      const blueoothActive = await BLEAdvertiser.getAdapterState()
        .then(result => {
          console.log('[Bluetooth]', 'isBTActive', result);
          return result === 'STATE_ON';
        })
        .catch(error => {
          console.log('[Bluetooth]', 'BT Not Enabled');
          return false;
        });

      if (!blueoothActive) {
        await Alert.alert(
          'Private Kit requires bluetooth to be enabled',
          'Would you like to enable Bluetooth?',
          [
            {
              text: 'Yes',
              onPress: () => BLEAdvertiser.enableAdapter(),
            },
            {
              text: 'No',
              onPress: () => console.log('No Pressed'),
              style: 'cancel',
            },
          ],
        );
      }

      console.log('BT Active?', blueoothActive);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestLocationPermission();
    BackgroundTaskServices.start();

    storeData('my_bluetooth_uuid', '87fbbbef-f4e0-4b71-af78-106cc5d078f9');
    //console.log(await getData('my_bluetooth_uuid'));

    BLEBackgroundService.init();
    BLEBackgroundService.start();
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
