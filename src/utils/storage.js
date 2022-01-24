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
