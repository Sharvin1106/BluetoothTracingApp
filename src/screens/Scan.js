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
import {ActivityIndicator, Colors, Paragraph} from 'react-native-paper';
import {hotspotLocation, locationCheckIn, getData} from '../utils/storage';
import LinearGradient from 'react-native-linear-gradient';

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
    var time = moment().format('hh:mm:ss');
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

    // TRIGGERING STATE CHANGES TO MAIN DASHBAORD (CHECK-OUT CARD)
    locations.map((location, i) => {
      axios.post(
        'https://jom-trace-backend.herokuapp.com/checkOut',
        {
          location: location.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            //other header fields
          },
        },
      );
      dispatch(checkOutLocation(location.id));
      console.log('Lenght' + locations.length);
    });

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
      <LinearGradient
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 1}}
        colors={['#67D7CE', '#83F3AD']}
        style={styles.linearGradient}></LinearGradient>
      <Text style={styles.title}>Check In Page</Text>
      <Paragraph style={styles.paragraph}>
        Red highlighted locations are Hotspots.
      </Paragraph>
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
    width: '100%',
    height: '100%',
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#D5FFE3',
  },

  linearGradient: {
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    //borderRadius: 40,
    width: '100%',
    height: 160,
    backgroundColor: '#f6f6f6',
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
    color: '#706D6D',
  },

  title: {
    color: '#0D4930',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 38,
    borderRadius: 30,
    textAlign: 'center',
    marginTop: '10%',
  },
  paragraph: {
    fontSize: 16,
    color: '#0D4930',
    marginBottom: '15%',
    textAlign: 'center',
  },
});

export default Scan;
