import {PermissionsAndroid} from 'react-native';
import BLEBackgroundService from '../services/BackgroundBleService';
import BackgroundTaskServices from '../services/BackgroundTaskService';
import BLEAdvertiser from 'react-native-ble-advertiser';

export const startServices = () => {
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
  requestLocationPermission();
  BackgroundTaskServices.start();
  BLEBackgroundService.init();
};

export const stopService = () => {
  BackgroundTaskServices.stop();
  BLEBackgroundService.stop();
};
