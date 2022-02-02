import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {getData} from '../utils/storage';
import {useSelector, useDispatch} from 'react-redux';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
  },
];

const Bluetooth = () => {
  const {auth} = useSelector(state => state.auth);
  const [closeContacts, setCloseContacts] = useState([]);

  const getListContacts = async () => {
    try {
      const contacts = await getData('close_contact');
      setCloseContacts(contacts);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getListContacts();
  });
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Broadcasting : </Text>
      <Text style={styles.data}>{auth.uuid}</Text>
      <Text style={styles.titleText}>Current Close{'\n'}Contacts:</Text>
      <FlatList
        data={closeContacts}
        renderItem={({item}) => <Text style={styles.item}>{item._uuid}</Text>}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'Inter',
    fontSize: 38,
    fontWeight: 'bold',
    color: '#0D4930',
    top: '3%',
    margin: '10%',
    marginBottom: '5%',
    textAlign: 'center',
  },
  data: {
    fontFamily: 'SF Pro Display',
    fontSize: 18,
    color: '#3E4248',
    textAlign: 'center',
    marginBottom: '2%',
  },
  item: {
    flex: 1,
    margin: '5%',
    marginHorizontal: 10,
    padding: 5,
    fontFamily: 'Inter',
    fontSize: 18,
    textAlign: 'center',
  },
});
export default Bluetooth;
