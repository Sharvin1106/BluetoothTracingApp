import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import {onGoogleButtonPress} from '../utils/Auth';
import {createUser} from '../api';
import {ASYNC_STORAGE_KEY, storeData} from '../utils/storage';

const SignUp = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 25, marginTop: 20}}>Welcome! </Text>
      <Text style={{fontSize: 16, color: 'gray', marginTop: 20}}>
        Sign in to continue
      </Text>
      <Image
        style={{width: '100%', height: 300}}
        source={require('../../assets/images/signup.png')}
        resizeMode="contain"
      />
      <View style={styles.messageContainer}>
        <Text>Get Yourself Protected</Text>
        <Text>Please sign in using Google</Text>
        <GoogleSigninButton
          onPress={async () => {
            const auth = await onGoogleButtonPress();
            if (auth?.additionalUserInfo.isNewUser) {
              const createUser = await createUser(auth.user.uid);
              storeData(ASYNC_STORAGE_KEY.USER_UUID, createUser);
            } else {
              const user = storeData(ASYNC_STORAGE_KEY.USER_UUID, createUser);
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  messageContainer: {
    alignItems: 'center',
  },
});
export default SignUp;
