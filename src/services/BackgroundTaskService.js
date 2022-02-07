import BackgroundFetch from 'react-native-background-fetch';
import BLEBackgroundService from './BackgroundBleService';

const INTERVAL = 15; // the value is received in minutes
const TASK_ID = 'com.bluetoothtracingapp';

export function executeBGTask() {
  console.log('[BackgroundFetch] ExecuteTask Sync');
  BLEBackgroundService.BLEServiceExec();
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
    console.log('[BackgroundFetch] Task scheduled');
  } catch (e) {
    console.warn('[BackgroundFetch] ScheduleTask fail', e);
  }
};

export default class BackgroundTaskServices {
  static start() {
    // Configure it.
    console.log('[BackgroundFetch] Configuring Background Task object');
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
        console.log('[BackgroundFetch] Inner task start: ', taskId);
        executeBGTask();

        // If it comes from the Scheduler, start it again.
        if (
          taskId === 'com.bluetoothtracingapp'
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

        console.log('[BackgroundFetch] Inner task end: ', taskId);
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.warn('[BackgroundFetch] Failed to start', error);
      },
    );

    BackgroundFetch.status(status => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.warn('[BackgroundFetch] BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.warn('[BackgroundFetch] BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('[BackgroundFetch] BackgroundFetch is enabled');
          executeBGTask();
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
