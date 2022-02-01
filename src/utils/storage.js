import AsyncStorage from '@react-native-async-storage/async-storage';

export const ASYNC_STORAGE_KEY = {
  USER_UUID: '@my_uuid',
};

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.log(err);
  }
};

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log(e);
  }
};

export const addCloseContact = async contact => {
  try {
    const value = await AsyncStorage.getItem('close_contact');
    if (value !== null) {
      const contacts = JSON.parse(value);
      console.log(value);
      contacts.push(contact)
      await AsyncStorage.setItem(
        'close_contact',
        JSON.stringify(contacts),
      );
      return true;
    } else {
      const newContact = [contact];
      await AsyncStorage.setItem('close_contact', JSON.stringify(newContact));
    }
  } catch (err) {
    console.log(err);
  }
};

export const locationCheckIn = async location => {
  try {
    const value = await AsyncStorage.getItem('location_visited');
    if (value !== null) {
      const locations = JSON.parse(value);
      await AsyncStorage.setItem(
        'locations_visited',
        JSON.stringify(locations.push(contact)),
      );
      return true;
    } else {
      const newLocation = [location];
      await AsyncStorage.setItem(
        'location_visited',
        JSON.stringify(newLocation),
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};
