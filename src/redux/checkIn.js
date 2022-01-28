<<<<<<< HEAD
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  locations: [],
};

export const checkInSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    checkInLocation: (state, action) => {
      state.locations.push(action.payload);
    },
    checkOutLocation: (state, action) => {
      state.locations = state.locations.filter(
        item => item.id !== action.payload,
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {checkInLocation, checkOutLocation} = checkInSlice.actions;

export default checkInSlice.reducer;
=======
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  locations: [],
};

export const checkInSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    checkInLocation: (state, action) => {
      state.locations.push(action.payload);
    },
    checkOutLocation: (state, action) => {
      state.locations = state.locations.filter(item => item.id !== action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const {checkInLocation, checkOutLocation} = checkInSlice.actions;

export default checkInSlice.reducer;
>>>>>>> b279897a8eefa51fe97e7718c4ffc5828d0deed9
