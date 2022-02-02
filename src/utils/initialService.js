import BLEBackgroundService from '../services/BackgroundBleService';
import BackgroundTaskServices from '../services/BackgroundTaskService';

export const startServices = () => {
  BackgroundTaskServices.start();
  BLEBackgroundService.init();
};

export const stopService = () => {
  BackgroundTaskServices.stop();
  BLEBackgroundService.stop();
};
