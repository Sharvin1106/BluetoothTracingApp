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
      // console.log(state.locations);
      // console.log(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const {checkInLocation, checkOutLocation} = checkInSlice.actions;

export default checkInSlice.reducer;
