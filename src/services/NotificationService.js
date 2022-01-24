import PushNotification from 'react-native-push-notification';

const createChannel = () => {
  PushNotification.createChannel({
    channelId: 'test-channel',
    channelName: 'Test Channel',
  });
};

export {createChannel};
