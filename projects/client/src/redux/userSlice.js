import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    id: null,
    email: "",
    name: "",
  },
};

export const userSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.id = action.payload.id;
      state.value.email = action.payload.email;
      state.value.name = action.payload.name;
    },
    logout: (state) => {
      state.value.id = null;
      state.value.email = null;
      state.value.name = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
