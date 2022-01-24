import BLEAdvertiser from 'react-native-ble-advertiser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeEventEmitter, NativeModules} from 'react-native';
import PushNotification from 'react-native-push-notification';
//import UUIDGenerator from 'react-native-uuid-generator';

export default class BLEBackgroundService {
  static eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);
  static onDeviceFoundListener;
  static onBluetoothStatusListener;

  static listeners = []; // Objects that implement event onDevice(data), onScanSatus, onBroadcastStatus
  static uuid;
  static cachedLastSeen = {};
  static c1MIN = 1000 * 60;

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

  static isValidUUID(uuid) {
    if (!uuid) return false;
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{10}00$/.test(
      uuid,
    );
  }

  static addDevice(_uuid, _name, _rssi, _date) {
    let lastSeenInMilliseconds = this.cashedLastSeen[_uuid];
    if (
      !lastSeenInMilliseconds ||
      _date.getTime() > lastSeenInMilliseconds + this.c1MIN
    ) {
    }
    let device = {
      serial: _uuid,
      name: _name,
      rssi: _rssi,
      date: _date,
    };

    let contactData = {
      uploader: '6ed2fa25-b412-4ad3-98df-d181487586c8',
      _uuid,
      _rssi,
      date: _date.toISOString(),
    };

    AsyncStorage.setItem(
      'CONTACT' + _uuid + _date.toISOString(),
      JSON.stringify(contactData),
    );
    cashedLastSeen[_uuid] = _date.getTime();
    this.emitNewDevice(device);
  }

  //   static setServicesUUID(deviceSerial) {
  //     let myUUID = toUUID(a2hex(deviceSerial));
  //     AsyncStorage.setItem(MY_UUID, myUUID);
  //   }

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

  static start() {
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
            if (this.isValidUUID(event.serviceUuids[i])) {
              // console.log("[BLEService]", "onDeviceFound", event);
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

    // UUIDGenerator.getRandomUUID((newUid) => {
    //   this.uuid = newUid.slice(0, -4) + 'ECAE';
    // });
    // console.log(this.uuid);
    console.log(
      '[BLEService]',
      '6ed2fa25-b412-4ad3-98df-d181487586c8',
      'Starting Advertising',
    );
    BLEAdvertiser.broadcast(
      '6ed2fa25-b412-4ad3-98df-d181487586c8',
      [1, 0, 0, 0],
      {
        advertiseMode: BLEAdvertiser.ADVERTISE_MODE_LOW_POWER,
        txPowerLevel: BLEAdvertiser.ADVERTISE_TX_POWER_LOW,
        connectable: false,
        includeDeviceName: false,
        includeTxPowerLevel: false,
      },
    )
      .then(sucess => this.emitBroadcastingStatus('Started'))
      .catch(error => this.emitBroadcastingStatus(error));

    console.log(
      '[BLEService]',
      '6ed2fa25-b412-4ad3-98df-d181487586c8',
      'Starting Scanner',
    );
    BLEAdvertiser.scan([1, 0, 0, 0], {
      scanMode: BLEAdvertiser.SCAN_MODE_BALANCED,
    })
      .then(sucess => this.emitScanningStatus('Started'))
      .catch(error => this.emitScanningStatus(error));
  }

  static stop() {
    console.log('[BLEService] Stopping BLE service');
    this.clearListener();

    this.emitBroadcastingStatus('Stopping');
    this.emitScanningStatus('Stopping');

    console.log('[BLEService]', this.uuid, 'Stopping Broadcast');
    BLEAdvertiser.stopBroadcast()
      .then(sucess => this.emitBroadcastingStatus('Stopped'))
      .catch(error => this.emitBroadcastingStatus(error));

    console.log('[BLEService]', this.uuid, 'Stopping Scanning');
    BLEAdvertiser.stopScan()
      .then(sucess => this.emitScanningStatus('Stopped'))
      .catch(error => this.emitScanningStatus(error));
  }
}
