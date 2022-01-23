import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, ActivityIndicator, FlatList, Text, View, TouchableOpacity } from 'react-native';
import { REMOTE_CONFIG_KEY,readRemoteConfigValue } from '../utils/remoteConfig';

const Scan = ({navigation}) => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users

  const createCheckInAlert = () =>
    Alert.alert(
      "Successfully Checked-In",
      "Location : \r\nDate : \r\nTime : ",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );


  useEffect(() => {
    const location = JSON.parse(readRemoteConfigValue(REMOTE_CONFIG_KEY.SCAN_LOCATION));
    setUsers(location);
    setLoading(false);
  
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
    <FlatList onPress= {createCheckInAlert}
      data={users}
      renderItem={({ item }) => (
        <TouchableOpacity onPress= {createCheckInAlert}>
          <Text style={styles.item}>{item.loc_name}</Text>
          {/* <Text>User Name: {item.name}</Text> */}
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
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden'
  },
  item: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 24,
    padding: 15,
    backgroundColor: '#D7E9F7',
    fontSize: 24,
    textAlign: 'center'
  },
});


export default Scan;