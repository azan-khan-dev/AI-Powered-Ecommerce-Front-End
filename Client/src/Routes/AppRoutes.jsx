import { Routes, Route } from "react-router-dom";
import Dashboard from "../Components/Dashboard/Dashboard";
import Notfound from "../Pages/Not_Found";
import Signup from "../Pages/Auth/SignUp";
import About from "../Pages/About";
import Login from "../Pages/Auth/Login";
import Contact from "../Pages/Contact";
import Home from "../Pages/Home";
import Wishlist_page from "../Pages/Wishlist_page";
import Cart from "../Pages/cart";
import CheckoutPage from "../Pages/Checkout";
import ProductPage from "../Pages/ProductDetails";
import ForgotPassword from "../Pages/Forgot_password";
import Product_list from "../Pages/Product_listing";
import Products from "../Pages/Products";
import SearchResults from "../Pages/SearchResults";

export default function AppRoutes()
{
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/wishlist" element={<Wishlist_page />} />
      <Route path="/about" element={<About />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/search" element={<SearchResults />} />

      
      <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/products/:type" element={<Products />} />
      {/* Product listing: both default and category based */}
      <Route path="/product_list" element={<Product_list />} />
      <Route path="/product_list/:category" element={<Product_list />} />
      {/* Catch-all for 404 */}
      <Route path="/*" element={<Notfound />} />
    </Routes>

  );
}
