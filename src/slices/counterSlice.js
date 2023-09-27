// src/slices/counterSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orders from "../data.json";

export const getOrderDetails = createAsyncThunk(
  "orders/id",
  async (payload) => {
    try {
      const orderData = orders.orders.filter((item) => item.id == payload);
      return orderData[0];
    } catch (e) {
      console.log(e, "error");
    }
  }
);

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    count: 0,
    orderId: 0,
    orderData: {},
  },
  reducers: {
    updateProductStatus(state, action) {
      const { productId, newStatus } = action.payload;
      const product = state.orderData.products.find(product => product.id === productId);
      if(product){
        product.status = newStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.orderData = action.payload;
    });
  },
});

export const { increment, decrement, updateProductStatus } = counterSlice.actions;
export default counterSlice.reducer;
