import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlistItems: [],
  count: 0,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      const existingItem = state.wishlistItems.find(
        (wishlistItem) => wishlistItem.product._id === item.product._id
      );

      if (!existingItem) {
        state.wishlistItems.push(item);
        state.count += 1;
      }
    },

    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      const itemExists = state.wishlistItems.some(
        (item) => item.product._id === productId
      );

      if (itemExists) {
        state.wishlistItems = state.wishlistItems.filter(
          (item) => item.product._id !== productId
        );
        state.count -= 1;
      }
    },

    setWishlistItems: (state, action) => {
      state.wishlistItems = action.payload;
      state.count = action.payload.length;
    },

    clearWishlist: (state) => {
      state.wishlistItems = [];
      state.count = 0;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  setWishlistItems,
  clearWishlist,
  setLoading,
  setError,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.wishlistItems;
export const selectWishlistCount = (state) => state.wishlist.count;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;