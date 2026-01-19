import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Dashboard from "./Components/Dashboard/Dashboard";
import Notfound from "./Pages/Not_Found";
import Signup from "./Pages/Auth/SignUp";
import About from "./Pages/About";
import Login from "./Pages/Auth/Login";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import Wishlist_page from "./Pages/Wishlist_page";
import Cart from "./Pages/Cart";
import CheckoutPage from "./Pages/Checkout";
import ProductPage from "./Pages/ProductDetails";
import ForgotPassword from "./Pages/Forgot_password";
import ResetPassword from "./Pages/ResetPassword";
import Product_list from "./Pages/Product_listing";
import Products from "./Pages/Products";
import Orders from "./Pages/Orders";
import Profile from "./Pages/Profile";
import Cancellations from "./Pages/Cancellations";
import SearchResults from "./Pages/SearchResults";
import Admin from "./Pages/admin/index"
import GlassesTryOnPage from "./Pages/GlassesTryOnPage";
import { setSiteSettings } from "./redux/slices/settingsSlice";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useGetMyProfileQuery } from "./redux/apis/authApis";
import { userExist, userNotExist } from "./redux/slices/authSlice";
import { useGetUserWishlistQuery } from "./redux/apis/wishlistApis";
import { setWishlistItems } from "./Features/Wishlist/WishlistSlice";
import { useGetMyOrdersQuery } from "./redux/apis/orderApis";
import { setOrders, setCancelledOrders } from "./Features/Orders/OrdersSlice";
import { useGetPublicConfigQuery } from "./redux/apis/settingsApis";

function App() {
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetMyProfileQuery();
  const { data: wishlistData } = useGetUserWishlistQuery(undefined, {
    skip: !data?.user && !data?.data // Only fetch if user is authenticated
  });
  const { data: ordersData } = useGetMyOrdersQuery({ page: 1, limit: 50 }, {
    skip: !data?.user && !data?.data // Only fetch if user is authenticated
  });

  useEffect(() => {
    if (data?.user || data?.data) {
      dispatch(userExist(data?.user || data?.data));
    }

    if (isError) {
      dispatch(userNotExist());
    }
  }, [data, isError, dispatch]);

  // Initialize wishlist and orders data when user is authenticated
  useEffect(() => {
    if (wishlistData?.data && (data?.user || data?.data)) {
      dispatch(setWishlistItems(wishlistData.data));
    }
  }, [wishlistData, data, dispatch]);

  // Fetch public config
  const { data: configData } = useGetPublicConfigQuery();
  console.log("configData", configData);

  useEffect(() => {
    if (configData?.data?.siteName) {
      document.title = configData.data.siteName;
      dispatch(setSiteSettings(configData.data));
    }
  }, [configData]);

  const isMaintenanceMode = configData?.data?.maintenanceMode && data?.data?.role !== "admin";

  useEffect(() => {
    if (ordersData?.data && (data?.user || data?.data)) {
      const allOrders = ordersData.data;
      const activeOrders = allOrders.filter(order => order.status !== 'cancelled');
      const cancelledOrders = allOrders.filter(order => order.status === 'cancelled');

      dispatch(setOrders(activeOrders));
      dispatch(setCancelledOrders(cancelledOrders));
    }
  }, [ordersData, data, dispatch]);

  const maintenanceModeBarForAdmin = configData?.data?.maintenanceMode && data?.data?.role === "admin";

  if (isMaintenanceMode) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Under Maintenance</h1>
        <p className="text-lg text-gray-600 text-center max-w-md">
          We are currently performing scheduled maintenance. We should be back online shortly. Thank you for your patience.
        </p>
        {configData?.data?.contactEmail && (
          <p className="mt-8 text-sm text-gray-500">Contact: {configData.data.contactEmail}</p>
        )}
      </div>
    );
  }


  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-medium">
        Loading...
      </div>
    );
  }

  return (
    <>
      {maintenanceModeBarForAdmin && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-3 text-center sticky top-0 z-50">
          <p className="text-sm font-medium text-yellow-800">
            ⚠️ Site is in maintenance mode. Only admins can access.
          </p>
        </div>
      )}
      <Header />

      <main className="flex-grow">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist_page />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cancellations" element={<Cancellations />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/products/:type" element={<Products />} />
          <Route path="/product_list" element={<Product_list />} />
          <Route path="/product_list/:category" element={<Product_list />} />
          <Route path="/*" element={<Notfound />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer />


      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
