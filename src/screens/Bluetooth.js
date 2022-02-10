import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getData} from '../utils/storage';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';

const Bluetooth = ({navigation}) => {
  const {auth} = useSelector(state => state.auth);
  const [closeContacts, setCloseContacts] = useState([]);
  const isFocused = useIsFocused();
  const getListContacts = async () => {
    try {
      const contacts = await getData('close_contact');
      setCloseContacts(JSON.parse(contacts));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (isFocused) {
      getListContacts();
      console.log(closeContacts);
    }
  }, [isFocused]);
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 1}}
        colors={['#67D7CE', '#83F3AD']}
        style={styles.linearGradient}></LinearGradient>

      <Text style={styles.titleText}>Broadcasting ID</Text>
      <Text style={styles.data}>{auth.uuid}</Text>
      <Text style={styles.titleText2}>Current Close{'\n'}Contacts:</Text>
      <FlatList
        data={closeContacts}
        renderItem={({item}) => <Text style={styles.item}>{item._uuid}</Text>}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
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
  titleText: {
    fontFamily: 'Inter',
    fontSize: 38,
    fontWeight: 'bold',
    color: '#0D4930',
    marginTop: '10%',
    textAlign: 'center',
  },
  titleText2: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D4930',
    top: '5%',
    margin: '10%',
    marginBottom: '5%',
    textAlign: 'center',
  },
  data: {
    position: 'relative',
    fontFamily: 'SF Pro Display',
    fontSize: 16,
    color: '#3E4248',
    textAlign: 'center',
    marginBottom: '2%',
  },
  item: {
    flex: 1,
    margin: '5%',
    padding: 5,
    fontFamily: 'Inter',
    fontSize: 18,
    textAlign: 'center',
    color: '#3E4248',
  },
});
export default Bluetooth;
