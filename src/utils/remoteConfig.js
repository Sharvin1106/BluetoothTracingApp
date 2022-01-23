import remoteConfig from '@react-native-firebase/remote-config';
import LOCATION from '../constants/location';

export const REMOTE_CONFIG_KEY = {
  SCAN_LOCATION: 'scan_location'
  
};

const DEFAULT_CONFIG = {
  [REMOTE_CONFIG_KEY.SCAN_LOCATION]: LOCATION
};

export const initializeFirebaseRemoteConfig = async () => {
  await remoteConfig().setDefaults(DEFAULT_CONFIG);

  // We will cache the config for 5 mins.
  // Firebase will reject the requests, if we requested too frequently
  await remoteConfig().fetch(300);
  await remoteConfig().activate();
};

export const readRemoteConfigValue = key => {
  return remoteConfig().getValue(key).asString();
};