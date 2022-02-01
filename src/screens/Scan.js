import React, {useState, useCallback, useEffect} from 'react';
import axios from 'axios';
import {
  Alert,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import {getAllLocations} from '../api';
import {useSelector, useDispatch} from 'react-redux';
import {checkInLocation} from '../redux/checkIn';
import {ActivityIndicator, Colors} from 'react-native-paper';

const Scan = () => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users
  const {locations} = useSelector(state => state.checkIn);
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
    // CREATE CHECK-IN OBJECT
    const checkInObj = {
      date: date,
      time: time,
      loc: loc,
      id: id,
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
    dispatch(checkInLocation(checkInObj));
    console.log(checkInObj);
    getLocationDetails();
    console.log(loc);
    console.log(id);
    // CREATING CHECK-IN ALERT
    createCheckInAlert(date, time, loc);
  };

  const getLocationDetails = useCallback(async () => {
    const locations = await getAllLocations();
    console.log(locations);
    setUsers(locations);
    setLoading(false);
  });

  useEffect(() => {
    getLocationDetails();
  }, [navigation]);

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

  getVisitorRange = v => {
    //console.log(v);
    if (v > 50) return styles.Hrisk;
    else if (v >= 25 && v <= 50) return styles.Mrisk;
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
            <Text style={[styles.item, getVisitorRange(item.visitorsCount)]}>
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
