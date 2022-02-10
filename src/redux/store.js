import {configureStore} from '@reduxjs/toolkit';
import auth from './auth';
import checkInReducer from './checkIn';


export const store = configureStore({
  reducer: {checkIn: checkInReducer, auth: auth},
});


