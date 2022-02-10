import BLEAdvertiser from 'react-native-ble-advertiser';
import {NativeEventEmitter, NativeModules} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {addCloseContact, getData} from '../utils/storage';
//import UUIDGenerator from 'react-native-uuid-generator';

export default class BLEBackgroundService {
  static eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);
  static onDeviceFoundListener;
  static onBluetoothStatusListener;

  static listeners = []; 
  static uuid;
  static cachedLastSeen = {};
  static c1MIN = 1000 * 300;

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
    let lastSeenDevice = this.cachedLastSeen[_uuid];
    try {
      if (
        !lastSeenDevice ||
        _date.getTime() > lastSeenDevice + this.c1MIN
      ) {
        this.checkDistance(_rssi);
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

        await addCloseContact(contactData);
        this.cachedLastSeen[_uuid] = _date.getTime();
        this.emitNewDevice(device);
      }
    } catch (error) {
      console.log(error);
    }
  }

  static enableBT() {
    BLEAdvertiser.enableAdapter();
  }

  static disableBT() {
    BLEAdvertiser.disableAdapter();
  }

  // Called by Background function.
  static BLEServiceExec() {
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
    try {
      return await getData('my_bluetooth_uuid');
    } catch (err) {
      console.log(err);
    }
  }

  static async start() {
    console.log('[JTBluetooth] Starting BLE service');
    this.clearListener();

    this.emitBroadcastingStatus('Starting');
    this.emitScanningStatus('Starting');

    this.onDeviceFoundListener = this.eventEmitter.addListener(
      'onDeviceFound',
      event => {
        if (event.serviceUuids) {
          for (let i = 0; i < event.serviceUuids.length; i++) {
            if (event.serviceUuids[i]) {
              console.log('[JTBluetooth]', 'onDeviceFound', event);
              this.addDevice(
                event.serviceUuids[i],
                event.deviceName,
                event.rssi,
                new Date(),
              );
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
        '[JTBluetooth]',
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

      console.log('[JTBluetooth]', await this.getMyUUID(), 'Starting Scanner');
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
    console.log('[JTBluetooth] Stopping BLE service');
    this.clearListener();

    this.emitBroadcastingStatus('Stopping');
    this.emitScanningStatus('Stopping');
    try {
      console.log('[JTBluetooth]', await this.getMyUUID(), 'Stopping Broadcast');
      BLEAdvertiser.stopBroadcast()
        .then(sucess => this.emitBroadcastingStatus('Stopped'))
        .catch(error => this.emitBroadcastingStatus(error));

      console.log('[JTBluetooth]', await this.getMyUUID(), 'Stopping Scanning');
      BLEAdvertiser.stopScan()
        .then(sucess => this.emitScanningStatus('Stopped'))
        .catch(error => this.emitScanningStatus(error));
    } catch (err) {
      console.log(err);
    }
  }
}
