import React, {useState, useEffect, useCallback} from 'react';
import {
  Alert,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {getAllLocations} from '../api';
import {useSelector, useDispatch} from 'react-redux';
import {checkInLocation} from '../redux/checkIn';

const Scan = ({navigation}) => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users
  const {locations} = useSelector(state => state.checkIn);
  const dispatch = useDispatch();
  const createCheckInAlert = () =>
    Alert.alert(
      'Successfully Checked-In',
      'Location : \r\nDate : \r\nTime : ',
      [
        {
          text: 'OK',
          onPress: () => {
            dispatch(checkInLocation({locationName: 'Tekun'}));
            console.log('OK Pressed');
          },
        },
      ],
    );
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
        onPress={createCheckInAlert}
        data={users}
        renderItem={({item}) => (
          <TouchableOpacity onPress={createCheckInAlert}>
            <Text style={styles.item}>{item.locationName}</Text>
            {/* <Text>User Name: {item.name}</Text> */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 24,
    padding: 15,
    backgroundColor: '#D7E9F7',
    fontSize: 24,
    textAlign: 'center',
  },
});

export default Scan;
