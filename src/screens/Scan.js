import React, {useState, useCallback, useEffect} from 'react';
import axios from 'axios';
import {
  Alert,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import {getAllLocations} from '../api';
import {useSelector, useDispatch} from 'react-redux';
import {checkInLocation} from '../redux/checkIn';

const Scan = ({navigation}) => {
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

  const checkInSuccessful = index => {
    var date = moment().format('DD/MM/YYYY');
    var time = moment().format('HH:mm:ss');
    var loc = users[index].locationName;
    var id = users[index]._id.$oid;
    const checkInObj = {
      date: date,
      time: time,
      loc: loc,
      id: id,
    };

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
    dispatch(checkInLocation({checkInObj, index}));
    getLocationDetails();
    console.log(loc);
    console.log(id);
    createCheckInAlert(date, time, loc);
  };

  const getLocationDetails = useCallback(async () => {
    const locations = await getAllLocations();
    console.log(locations);
    setUsers(locations);
  });

  useEffect(() => {
    getLocationDetails();
    setLoading(false);
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator />;
  }

  getVisitorRange = v => {
    //console.log(v);
    if (v > 50) return styles.Hrisk;
    else if (v >= 25 && v <= 50) return styles.Mrisk;
    else return styles.Lrisk;
  };

  return (
    <View style={styles.container}>
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
  Hrisk: {backgroundColor: '#FF4B2B'},
  Mrisk: {backgroundColor: '#FFF778'},
  Lrisk: {backgroundColor: '#76E6BE'},

  container: {
    flex: 1,
    paddingTop: 40,
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
});

export default Scan;
