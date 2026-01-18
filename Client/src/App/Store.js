import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../Features/cart/cartSlice";
import productsReducer from "../Features/Products/productsSlice";
import wishlistReducer from "../Features/Wishlist/WishlistSlice";
import ordersReducer from "../Features/Orders/OrdersSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
  },
});
