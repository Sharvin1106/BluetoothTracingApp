import BackgroundFetch from 'react-native-background-fetch';
// import {sync, isOnline} from '../helpers/SyncDB';
import BLEBackgroundService from './BackgroundBleService';

const INTERVAL = 15; // the value is received in minutes
const TASK_ID = 'com.transistorsoft.childrenshospital.contacttracer.pulse';

export function executeTask() {
  console.log('[BackgroundService] ExecuteTask Sync');
  BLEBackgroundService.pulse();
}

export const scheduleTask = async () => {
  try {
    await BackgroundFetch.scheduleTask({
      taskId: TASK_ID,
      stopOnTerminate: false,
      enableHeadless: true,
      delay: 60 * 1000, // milliseconds (5s)
      forceAlarmManager: false, // more precise timing with AlarmManager vs default JobScheduler
      periodic: false, // Fire once only.
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Default
      requiresCharging: false, // Default
      requiresDeviceIdle: false, // Default
      requiresBatteryNotLow: false, // Default
      requiresStorageNotLow: false, // Default
      startOnBoot: true,
    });
    console.log('[BackgroundService] Task scheduled');
  } catch (e) {
    console.warn('[BackgroundService] ScheduleTask fail', e);
  }
};

export default class BackgroundTaskServices {
  static start() {
    // Configure it.
    console.log('[BackgroundService] Configuring Background Task object');
    BackgroundFetch.configure(
      {
        minimumFetchInterval: INTERVAL,
        // Android options
        forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
        enableHeadless: true,
      },
      async taskId => {
        console.log('[BackgroundService] Inner task start: ', taskId);
        executeTask();

        // If it comes from the Scheduler, start it again.
        if (
          taskId === 'com.transistorsoft.childrenshospital.contacttracer.pulse'
        ) {
          // Test initiating a #scheduleTask when the periodic fetch event is received.
          try {
            console.log(
              '[BackgroundFetch ForegroundTask] scheduling task again: ',
            );
            await scheduleTask();
          } catch (e) {
            console.warn('[BackgroundFetch] scheduleTask falied', e);
          }
        }

        console.log('[BackgroundService] Inner task end: ', taskId);
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.warn('[BackgroundService] Failed to start', error);
      },
    );

    // Optional: Query the authorization status.
    BackgroundFetch.status(status => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.warn('[BackgroundService] BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.warn('[BackgroundService] BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('[BackgroundService] BackgroundFetch is enabled');
          executeTask();
          //scheduleTask();
          break;
      }
    });

    BackgroundFetch.start();
  }

  static stop() {
    //BackgroundFetch.stop();
  }
}
