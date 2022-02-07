import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useIsFocused} from '@react-navigation/core';
import {
  getData,
  removeData,
  storeData,
} from '../utils/storage';
import {startServices, stopService} from '../utils/initialService';
import {getUser, uploadDetails} from '../api';
import {useDispatch} from 'react-redux';
import {authenticateUser} from '../redux/auth';

export default () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const getCurrentUser = useCallback(async () => {
    try {
      const userDetails = await getUser(auth().currentUser.uid);
      setUser(userDetails[0]);
      dispatch(authenticateUser(userDetails[0]));
    } catch (error) {
      console.log(error);
    }
  });

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        alert('Signed out successfully!');
        storeData('my_bluetooth_uuid', '');
        removeData('close_contact');
        removeData('location_visited');
        removeData('hotspot_visited');
        removeData('allow_tracing');
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

  const checkVaccinated = V => {
    if (V == 'Y') return 'Vaccinated';
    else if (V == 'N') return 'Not Vaccinated';
  };

  const checkHealth = H => {
    if (H == 'negative') return 'Negative';
    else if (H == 'Positive') return 'Positive';
    else return 'Suspected';
  };

  const declarePositive = async () => {
    try {
      const locationVisited = await getData('location_visited');
      const my_uuid = await getData('my_bluetooth_uuid');
      // const dummyContact = addCloseContact({
      //   uploader: my_uuid,
      //   _uuid: "8e92ab7d-6879-4a36-a5c7-1d460e7e708d",
      //   _rssi: 32,
      //   date: new Date().toISOString(),
      // });
      //TODO: REMOVE CONSOLE LOGS AND COMMENTED OUT LINES
      const closeContact = await getData('close_contact');
      console.log({
        uuid: my_uuid,
        closeContact: JSON.parse(closeContact),
        locationVisited: JSON.parse(locationVisited),
      });
      console.log(typeof JSON.parse(locationVisited));
      console.log(locationVisited);
      const sendData = await uploadDetails({
        uuid: my_uuid,
        closeContact: closeContact,
        locationVisited: locationVisited,
      });
    } catch (err) {
      console.log(err);
    }
  };

  checkEnabled = E => {
    if (E) return 'Contact Tracing is enabled.';
    else return 'Contact Tracing is disabled.';
  };

  useEffect(() => {
    if (isFocused) {
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
      getCurrentUser();
      console.log('I got rerendered');
    }
  }, [navigation, isFocused]);
  return (
    <View style={styles.container}>
      <Image
        style={styles.profilePic}
        source={require('../../assets/images/User.png')}
        resizeMode="contain"
      />

      <Text style={styles.Title}>{user?.username}</Text>
      <Text style={styles.data}>{user?.mobile}</Text>
      <TouchableOpacity onPress={declarePositive} style={styles.button2}>
        <Text style={styles.buttonText2}>Declare Positive </Text>
      </TouchableOpacity>

      <Text style={styles.Title}>Vaccination Status</Text>
      <Text style={styles.data}>{checkVaccinated(user?.vaccinated)}</Text>
      <Text style={styles.Title}>Health Status</Text>
      <Text style={styles.data}>{checkHealth(user?.status)}</Text>
      <Switch
        style={styles.switch}
        trackColor={{false: '#767577', true: '#0D4930'}}
        thumbColor={isEnabled ? '#1AEBA4' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Text style={styles.text}>{checkEnabled(isEnabled)}</Text>

      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D5FFE3',
  },
  text: {
    color: '#706D6D',
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
    textAlign: 'center',
  },
  button2: {
    backgroundColor: '#FF4744',
    // backgroundColor: '#1AEBA4',
    width: '60%',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: '5%',
  },
  buttonText2: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  profilePic: {
    width: '50%',
    height: '20%',
    marginVertical: '3%',
    marginTop: '5%',
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
  switch: {
    marginTop: '5%',
  },
});
