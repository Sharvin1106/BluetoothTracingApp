import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/core';
import {Card} from 'react-native-elements';
import {getData, removeData, storeData} from '../utils/storage';
import {startServices, stopService} from '../utils/initialService';

export default () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        alert('Signed out successfully!');
        navigation.replace('Auth');
      })
      .catch(error => alert(error.message));
  };
  const toggleSwitch = async () => {
    try {
      if (isEnabled) {
        await removeData('allow_tracing');
        stopService();
        setIsEnabled(false);
      } else {
        await storeData('allow_tracing', 'yes');
        startServices();
        setIsEnabled(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const isAllowed = await getData('allow_tracing');
        if (isAllowed) {
          setIsEnabled(true);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  });
  return (
    <View style={styles.container}>
      <Image
        style={styles.profilePic}
        source={require('../../assets/images/User.png')}
        resizeMode="contain"
      />

      <Text style={styles.Title}>Jeevittan Krishnan</Text>
      <Text style={styles.data}>016-65893321</Text>
      <TouchableOpacity style={styles.button2}>
        <Text style={styles.buttonText2}>Declare Positive</Text>
      </TouchableOpacity>

      <Text style={styles.Title}>Vaccination Status</Text>
      <Text style={styles.data}>Vaccinated</Text>
      <Text style={styles.Title}>Health Status</Text>
      <Text style={styles.data}>No Symptoms</Text>
      <View style={styles.container}>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    // backgroundColor: '#FF4744',
    backgroundColor: '#1AEBA4',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: '5%',
    marginTop: '5%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  button2: {
    backgroundColor: '#FF4744',
    // backgroundColor: '#1AEBA4',
    width: '60%',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: '10%',
  },
  buttonText2: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  profilePic: {
    width: '50%',
    height: '20%',
    marginBottom: '3%',
  },
  column: {},
  Title: {
    fontFamily: 'SF Pro Display',
    fontWeight: 'bold',
    fontSize: 28,
    color: '#3E4248',
    textAlign: 'center',
  },
  data: {
    fontFamily: 'SF Pro Display',
    fontSize: 22,
    color: '#3E4248',
    textAlign: 'center',
    marginBottom: '2%',
  },
});
