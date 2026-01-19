import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [], // ✅ rename items -> cartItems
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((p) => p.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          id: item.id,
          name: item.name || item.title, // ✅ title bhi support
          price: item.price,
          image: item.image,
          quantity: 1,
        });
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.cartItems = [];
    },

    increaseQuantity: (state, action) => {
      const item = state.cartItems.find((p) => p.id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find((p) => p.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
