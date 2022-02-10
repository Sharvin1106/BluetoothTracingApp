import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {createUser, getUser} from '../api';
import {storeData} from '../utils/storage';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }
  const navigation = useNavigation();

  // SIGN IN AUTHENTICATION METHOD
  const handleSignin = async () => {
    try {
      const user = await auth().signInWithEmailAndPassword(email, password);
      console.log(user.user.uid);
      const userDetails = await getUser(user.user.uid);
      console.log(userDetails);
      storeData('my_bluetooth_uuid', userDetails[0].uuid);
      //  setIsSignIn(true);
    } catch (error) {
      alert('Invalid credentials, Please try again.');
      console.log(error);
    }
  };

  // SIGN UP AUTHENTICATION METHOD
  const handleSignUp = async () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        setIsSignUp(true);
        navigation.replace('Form');
        return null;
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
          console.log('That email address is invalid!');
        }

        else
          alert('Weak Password!');

        console.error(error);
      });
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  if (!isSignUp && auth().currentUser?.uid) {
    console.log('I dont know why I get executed');
    navigation.replace('Tabs');
    return null;
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.titleText}>JomTrace</Text>
      <Image
        style={{width: '100%', height: 300}}
        source={require('../../assets/images/Sign-Up.png')}
        resizeMode="contain"
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignin} style={styles.button}>
          <Text style={styles.buttonText}>Log-In </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Register </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    width: '80%',
  },

  titleText: {
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0D4930',
    top: '3%',
    margin: 0,
  },

  input: {
    backgroundColor: '#D5FFE3',
    paddingHorizontal: 15,
    paddingVertical: '4%',
    borderRadius: 10,
    marginTop: '5%',
    color: '#000',
  },
  buttonContainer: {
    width: '65%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: '6%',
  },
  button: {
    backgroundColor: '#1AEBA4',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: '8%',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#1AEBA4',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#1AEBA4',
    fontWeight: '700',
    fontSize: 16,
  },
});
