import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {getData} from '../utils/storage';

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
  const getMyUUID = async () => {
    try {
      return await getData('my_bluetooth_uuid');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Broadcasting : </Text>
      <Text style={styles.data}>{getMyUUID()}</Text>
      <Text style={styles.titleText}>Current Close{'\n'}Contacts:</Text>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Text style={styles.item}>{item.id}</Text>}
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
    margin: '5%',
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
    marginHorizontal: 10,
    padding: 5,
    fontFamily: 'Inter',
    fontSize: 18,
    textAlign: 'center',
  },
});
export default Bluetooth;
