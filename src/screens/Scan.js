import React, { useState,useCallback, useEffect } from 'react';
import { Alert, StyleSheet, ActivityIndicator, FlatList, Text, View, TouchableOpacity } from 'react-native';
import { REMOTE_CONFIG_KEY,readRemoteConfigValue } from '../utils/remoteConfig';
import moment from 'moment'; 
import {getAllLocations} from '../api';

const Scan = ({navigation}) => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users

  const createCheckInAlert = (date, time, loc) =>
    Alert.alert(
      "Successfully Checked-In at " + loc,
      "Date : " + date + "\r\nTime : " + time ,
      [
        { text: "OK", onPress: () => console.log("ok") }
      ]
    );

    const checkInSuccessful = (index) => {
      var date = moment().format("DD/MM/YYYY");
      var time = moment().format("HH:mm:ss");
      var loc = users[index].locationName;
      console.log(loc);
      createCheckInAlert(date,time,loc);
    }

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

  return (
    <View style={styles.container}>
    <FlatList 
      data={users}
      renderItem={({ item,index }) => (
        <TouchableOpacity onPress= {() => checkInSuccessful(index)}>
          <Text style={styles.item}>{item.locationname}</Text>
        </TouchableOpacity>
      )}
    />
    </View>
  );
}

const styles = StyleSheet.create({
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
    textAlign: 'center'
  },

  list: {
    borderRadius: 25
  }
});


export default Scan;