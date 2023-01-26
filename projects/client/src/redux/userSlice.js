import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    id: null,
    email: "",
    name: "",
    is_verified: 0,
    role: 0,
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
      state.value.is_verified = action.payload.is_verified;
      state.value.role = action.payload.role;
    },
    logout: (state) => {
      state.value.id = null;
      state.value.email = null;
      state.value.name = null;
      state.value.is_verified = null;
      state.value.role = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
