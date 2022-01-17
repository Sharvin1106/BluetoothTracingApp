import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import {onGoogleButtonPress} from '../utils/Auth';

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
            if (auth.user) navigation.navigate('Home');
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
