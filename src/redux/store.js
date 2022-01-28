import {configureStore} from '@reduxjs/toolkit';
import checkInReducer from './checkIn';

export const store = configureStore({
  reducer: {checkIn: checkInReducer},
});
