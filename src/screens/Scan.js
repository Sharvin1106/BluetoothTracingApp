import React, {useState, useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';
import axios from 'axios';
import {
  Alert,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/core';
import moment from 'moment';
import {getAllLocations} from '../api';
import {useSelector, useDispatch} from 'react-redux';
import {checkInLocation, checkOutLocation} from '../redux/checkIn';
import {ActivityIndicator, Colors} from 'react-native-paper';
import {hotspotLocation, locationCheckIn} from '../utils/storage';

const Scan = ({navigation}) => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users
  const {locations} = useSelector(state => state.checkIn);
  //const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const createCheckInAlert = (date, time, loc) =>
    Alert.alert(
      'Successfully Checked-In at ' + loc,
      'Date : ' + date + '\r\nTime : ' + time,
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('ok');
          },
        },
      ],
    );

  // CHECK-IN BY CREATING CHECK-IN OBJECT AND CALL POST METHOD TO API
  const checkInSuccessful = index => {
    var date = moment().format('DD/MM/YYYY');
    var time = moment().format('HH:mm:ss');
    var loc = users[index].locationName;
    var id = users[index]._id.$oid;
    var capac = users[index].capacity;
    var visitorsCount = users[index].visitorsCount;
    var hotspot = false;
    if (visitorsCount >= capac) hotspot = true;
    // CREATE CHECK-IN OBJECT
    const checkInObj = {
      date: date,
      time: time,
      loc: loc,
      id: id,
      hotspot: hotspot,
    };
    // CALLING POST METHOD API
    axios.post(
      'https://jom-trace-backend.herokuapp.com/checkIn',
      {
        location: id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          //other header fields
        },
      },
    );
    // TRIGGERING STATE CHANGES TO MAIN DASHBAORD (CHECK-OUT CARD)
    var size = locations.length;
    while (size != 0) {
      dispatch(checkOutLocation(locations.id));
      size--;
    }

    if (hotspot) {
      hotspotLocation(checkInObj);
    }
    locationCheckIn(checkInObj);
    dispatch(checkInLocation(checkInObj));

    console.log(checkInObj);
    getLocationDetails();
    console.log(loc);
    console.log(id);
    // CREATING CHECK-IN ALERT
    createCheckInAlert(date, time, loc);
  };

  const getLocationDetails = useCallback(async () => {
    setLoading(true);
    const locations = await getAllLocations();
    console.log(locations);
    setUsers(locations);
    setLoading(false);
  });

  const getLocationList = async () => {
    try {
      const locations = await getData('location_visited');
      console.log(locations);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isFocused) {
      console.log(isFocused);
      getLocationDetails();
      getLocationList();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator
          style={styles.loading}
          animating={true}
          color={'#1AEBA4'}
          size={'large'}
        />
        <Text style={styles.loadingText}>
          Locations are loading,{'\n'}please wait.
        </Text>
      </View>

      //<ActivityIndicator style={styles.loading} size="large" color="#1AEBA4" />
    );
  }

  getVisitorRange = (v, c) => {
    //console.log(v);
    var m = c / 2;
    if (v > c) return styles.Hrisk;
    else if (v >= m && v <= c) return styles.Mrisk;
    else return styles.Lrisk;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check In Page</Text>
      <FlatList
        data={users}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={index}
            onPress={() => checkInSuccessful(index)}>
            <Text
              style={[
                styles.item,
                getVisitorRange(item.visitorsCount, item.capacity),
              ]}>
              {item.locationName + ' (' + item.visitorsCount + ')'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Hrisk: {backgroundColor: '#FF6B6B'},
  Mrisk: {backgroundColor: '#FFF96B'},
  Lrisk: {backgroundColor: '#76E6BE'},

  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F2F4F7',
  },
  item: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 24,
    padding: 15,
    backgroundColor: '#76E6BE',
    color: '#0D4930',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 24,
    borderRadius: 30,
    textAlign: 'center',
  },

  list: {
    borderRadius: 25,
  },

  loading: {
    alignItems: 'center',
    margin: '50%',
    marginTop: '80%',
    marginBottom: 33,
  },

  loadingText: {
    fontSize: 20,
    fontFamily: 'SF Pro Text',
    textAlign: 'center',
  },

  title: {
    color: '#0D4930',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 48,
    borderRadius: 30,
    textAlign: 'center',
    marginTop: '8%',
    marginBottom: '5%',
  },
});

export default Scan;
