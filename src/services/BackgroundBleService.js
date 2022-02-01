import BLEAdvertiser from 'react-native-ble-advertiser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeEventEmitter, NativeModules} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {addCloseContact, getData, storeData} from '../utils/storage';
//import UUIDGenerator from 'react-native-uuid-generator';

export default class BLEBackgroundService {
  static eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);
  static onDeviceFoundListener;
  static onBluetoothStatusListener;

  static listeners = []; // Objects that implement event onDevice(data), onScanSatus, onBroadcastStatus
  static uuid;
  static cachedLastSeen = {};
  static c1MIN = 1000 * 60;

  //CHECK DISTANCE
  static checkDistance(_rssi) {
    if (Math.pow(10, (-69 - _rssi) / (10 * 13)) < 1.5) {
      PushNotification.localNotification({
        channelId: 'test-channel',
        title: 'Distance Alert',
        message: 'Please Maintain Your Distance',
      });
    }
  }

  /**
   * If the app needs to update the screen at every new device.
   */
  static addNewDeviceListener(callback) {
    var index = this.listeners.indexOf(callback);
    if (index < 0) this.listeners.push(callback);
  }
  static removeNewDeviceListener(callback) {
    var index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }
  static emitNewDevice(data) {
    this.listeners.forEach(callback => {
      callback.onDevice(data);
    });
  }
  static emitBroadcastingStatus(data) {
    this.listeners.forEach(callback => {
      callback.onBroadcastStatus(data);
    });
  }
  static emitScanningStatus(data) {
    this.listeners.forEach(callback => {
      callback.onScanStatus(data);
    });
  }
  static emitBluetoothStatus(data) {
    this.listeners.forEach(callback => {
      callback.onBluetoothStatus(data);
    });
  }

  static init() {
    BLEAdvertiser.setCompanyId(0x4c);
    this.cachedLastSeen = {};
    cached_my_uuid = null;
    this.emitBroadcastingStatus('Initialized');
    this.emitScanningStatus('Initialized');
  }

  static requestBluetoothStatus() {
    BLEAdvertiser.getAdapterState()
      .then(result => {
        this.emitBluetoothStatus(result === 'STATE_ON' ? 'On' : 'Off');
      })
      .catch(error => {
        this.emitBluetoothStatus(error);
      });
  }

  static async addDevice(_uuid, _name, _rssi, _date) {
    let lastSeenInMilliseconds = this.cachedLastSeen[_uuid];
    if (
      !lastSeenInMilliseconds ||
      _date.getTime() > lastSeenInMilliseconds + this.c1MIN
    ) {
    }
    try {
      let device = {
        serial: _uuid,
        name: _name,
        rssi: _rssi,
        date: _date,
      };

      let contactData = {
        uploader: await this.getMyUUID(),
        _uuid,
        _rssi,
        date: _date.toISOString(),
      };

      AsyncStorage.setItem(
        'CONTACT' + _uuid + _date.toISOString(),
        JSON.stringify(contactData),
      );
      console.log(getData('CONTACT' + _uuid + _date.toISOString()));

      await addCloseContact(contactData);
      this.cachedLastSeen[_uuid] = _date.getTime();
      this.emitNewDevice(device);
    } catch (error) {
      console.log(error);
    }
  }

  static checkDistance(_rssi) {
    if (Math.pow(10, (-69 - _rssi) / (10 * 2))) {
      PushNotification.localNotification({
        channelId: 'test-channel',
        title: 'Distance Alert',
        message: 'Please Maintain Your Distance',
      });
    }
  }

  static enableBT() {
    BLEAdvertiser.enableAdapter();
  }

  static disableBT() {
    BLEAdvertiser.disableAdapter();
  }

  // Called by Background function.
  static pulse() {
    this.enableBT();
    this.init();
    this.start();
  }

  static clearListener() {
    if (this.onDeviceFoundListener) {
      this.onDeviceFoundListener.remove();
      this.onDeviceFoundListener = null;
    }

    if (this.onBluetoothStatusListener) {
      this.onBluetoothStatusListener.remove();
      this.onBluetoothStatusListener = null;
    }
  }

  static async getMyUUID() {
    return await getData('my_bluetooth_uuid');
  }

  static async start() {
    console.log('[BLEService] Starting BLE service');
    PushNotification.localNotification({
      channelId: 'test-channel',
      title: 'JomTrace',
      message: 'You are being secured bro',
    });
    //cached_my_uuid = null;
    this.clearListener();

    this.emitBroadcastingStatus('Starting');
    this.emitScanningStatus('Starting');

    this.onDeviceFoundListener = this.eventEmitter.addListener(
      'onDeviceFound',
      event => {
        if (event.serviceUuids) {
          for (let i = 0; i < event.serviceUuids.length; i++) {
            if (event.serviceUuids[i]) {
              console.log('[BLEService]', 'onDeviceFound', event);
              this.addDevice(
                event.serviceUuids[i],
                event.deviceName,
                event.rssi,
                new Date(),
              );
              this.checkDistance(event.rssi);
            }
          }
        }
      },
    );

    this.onBluetoothStatusListener = this.eventEmitter.addListener(
      'onBTStatusChange',
      bluetooth => {
        this.emitBluetoothStatus(bluetooth.enabled ? 'On' : 'Off');

        if (!bluetooth.enabled) {
          this.emitBroadcastingStatus('Bluetooth Off');
          this.emitScanningStatus('Bluetooth Off');
        }
      },
    );

    try {
      console.log(
        '[BLEService]',
        await this.getMyUUID(),
        'Starting Advertising',
      );

      BLEAdvertiser.broadcast(await this.getMyUUID(), [1, 0, 0, 0], {
        advertiseMode: BLEAdvertiser.ADVERTISE_MODE_LOW_POWER,
        txPowerLevel: BLEAdvertiser.ADVERTISE_TX_POWER_LOW,
        connectable: false,
        includeDeviceName: false,
        includeTxPowerLevel: false,
      })
        .then(sucess => this.emitBroadcastingStatus('Started'))
        .catch(error => this.emitBroadcastingStatus(error));

      console.log('[BLEService]', await this.getMyUUID(), 'Starting Scanner');
      BLEAdvertiser.scan([1, 0, 0, 0], {
        scanMode: BLEAdvertiser.SCAN_MODE_BALANCED,
      })
        .then(sucess => this.emitScanningStatus('Started'))
        .catch(error => this.emitScanningStatus(error));
    } catch (error) {
      console.log(error);
    }
  }

  static async stop() {
    console.log('[BLEService] Stopping BLE service');
    this.clearListener();

    this.emitBroadcastingStatus('Stopping');
    this.emitScanningStatus('Stopping');
    try {
      console.log('[BLEService]', await this.getMyUUID(), 'Stopping Broadcast');
      BLEAdvertiser.stopBroadcast()
        .then(sucess => this.emitBroadcastingStatus('Stopped'))
        .catch(error => this.emitBroadcastingStatus(error));

      console.log('[BLEService]', await this.getMyUUID(), 'Stopping Scanning');
      BLEAdvertiser.stopScan()
        .then(sucess => this.emitScanningStatus('Stopped'))
        .catch(error => this.emitScanningStatus(error));
    } catch (err) {
      console.log(err);
    }
  }
}
