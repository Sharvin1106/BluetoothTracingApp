import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';

export async function onGoogleButtonPress() {
  // Get the users ID token

  const {idToken} = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

export const getUserId = () => {
  return auth().currentUser.uid;
};

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = getFcmToken();
    console.log('Authorization status:', authStatus);
    return token;
  }
};

const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log(fcmToken);
    console.log('Your Firebase Token is:', fcmToken);
    return fcmToken;
  } else {
    console.log('Failed', 'No token received');
  }
};
