import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { cartUser } = cartSlice.actions;
export default cartSlice.reducer;
