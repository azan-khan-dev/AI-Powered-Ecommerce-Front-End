import { configureStore } from "@reduxjs/toolkit";

// APIs
import authApis from "./apis/authApis";
import userApis from "./apis/userApis";
import claimsApis from "./apis/claimsApis";
import chatApis from "./apis/chatApis";
import invoiceApis from "./apis/invoiceApis";
import notificationsApis from "./apis/notificationsApis";
import paymentApis from "./apis/paymentApis";
import memberApis from "./apis/membersApis";

// E-commerce APIs
import homeApis from "./apis/homeApis";
import dashboardApis from "./apis/dashboardApis";
import productApis from "./apis/productApis";
import categoryApis from "./apis/categoryApis";
import orderApis from "./apis/orderApis";
import wishlistApis from "./apis/wishlistApis";


// Slices
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import notificationsSlice from "./slices/notificationsSlice";

// 🛒 E-commerce slices
import cartReducer from "../Features/cart/cartSlice";
import productsReducer from "../Features/Products/productsSlice";
import wishlistReducer from "../Features/Wishlist/WishlistSlice";
import ordersReducer from "../Features/Orders/OrdersSlice";

export const store = configureStore({
  reducer: {
    // 🔌 APIs
    [authApis.reducerPath]: authApis.reducer,
    [userApis.reducerPath]: userApis.reducer,
    [claimsApis.reducerPath]: claimsApis.reducer,
    [chatApis.reducerPath]: chatApis.reducer,
    [notificationsApis.reducerPath]: notificationsApis.reducer,
    [memberApis.reducerPath]: memberApis.reducer,
    [invoiceApis.reducerPath]: invoiceApis.reducer,
    [paymentApis.reducerPath]: paymentApis.reducer,

    // 🛒 E-commerce APIs
    [homeApis.reducerPath]: homeApis.reducer,
    [dashboardApis.reducerPath]: dashboardApis.reducer,
    [productApis.reducerPath]: productApis.reducer,
    [categoryApis.reducerPath]: categoryApis.reducer,
    [orderApis.reducerPath]: orderApis.reducer,
    [wishlistApis.reducerPath]: wishlistApis.reducer,

    // 🧩 App slices
    [authSlice.name]: authSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [notificationsSlice.name]: notificationsSlice.reducer,

    // 🛍️ E-commerce
    cart: cartReducer,
    products: productsReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(authApis.middleware)
      .concat(userApis.middleware)
      .concat(claimsApis.middleware)
      .concat(chatApis.middleware)
      .concat(notificationsApis.middleware)
      .concat(memberApis.middleware)
      .concat(invoiceApis.middleware)
      .concat(paymentApis.middleware)
      .concat(homeApis.middleware)
      .concat(dashboardApis.middleware)
      .concat(productApis.middleware)
      .concat(categoryApis.middleware)
      .concat(orderApis.middleware)
      .concat(wishlistApis.middleware),
});


