import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const SignUp = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  const navigation = useNavigation();

  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(
        'jane.doe@example.com',
        'SuperSecretPassword!',
      )
      .then(() => {
        console.log('User account created & signed in!');
        navigation.replace('Home');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // const handleSignUp = () => {
  //   auth
  //     .createUserWithEmailAndPassword(email, password)
  //     .then(userCredentials => {
  //       const user = userCredentials.user;
  //       console.log('Registered with:', user.email);
  //     })
  //     .catch(error => alert(error.message));
  // };

  // const handleLogin = () => {
  //   auth
  //     .signInWithEmailAndPassword(email, password)
  //     .then(userCredentials => {
  //       const user = userCredentials.user;
  //       console.log('Logged in with:', user.email);
  //     })
  //     .catch(error => alert(error.message));
  // };

  //return (
  //     <KeyboardAvoidingView style={styles.container} behavior="padding">
  //       <View style={styles.inputContainer}>
  //         <TextInput
  //           placeholder="Email"
  //           value={email}
  //           onChangeText={text => setEmail(text)}
  //           style={styles.input}
  //         />
  //         <TextInput
  //           placeholder="Password"
  //           value={password}
  //           onChangeText={text => setPassword(text)}
  //           style={styles.input}
  //           secureTextEntry
  //         />
  //       </View>

  //       <View style={styles.buttonContainer}>
  //         <TouchableOpacity onPress={handleLogin} style={styles.button}>
  //           <Text style={styles.buttonText}>Login</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           onPress={handleSignUp}
  //           style={[styles.button, styles.buttonOutline]}>
  //           <Text style={styles.buttonOutlineText}>Register</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </KeyboardAvoidingView>

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text>Sign-Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
  //RETURN LOADING COMPONENT
  navigation.replace('Home');
  return null;
  // return (
  //   <View>
  //     <Text>Welcome {user.email}</Text>
  //   </View>
  // );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
