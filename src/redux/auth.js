import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  auth: null,
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state, action) => {
      state.auth = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {authenticateUser} = AuthSlice.actions;

export default AuthSlice.reducer;
