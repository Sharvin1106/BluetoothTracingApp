import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth';
import checkInReducer from './checkIn';

export const store = configureStore({
  reducer: {checkIn: checkInReducer, auth: authReducer},
});
