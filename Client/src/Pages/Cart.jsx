import React from "react";
import { Link } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import
{
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../Features/cart/cartSlice";
import { Router } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



function Cart()
{
  // ✅ Corrected state name (cartItems instead of items)
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();



  const calculateSubtotal = () =>
    cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);


  function handleOnClickProceedToCheckout()
  {
    if (user)
    {
      navigate("/checkout");
    } else
    {
      toast.error("Login first!");
      navigate("/login")
    }
  }


  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-35 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-10">
        <Link to="/" className="text-gray-400 hover:text-red-500">
          Home
        </Link>{" "}
        / <span className="text-black">Cart</span>
      </div>

      {/* Cart Header */}
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <IoCartOutline className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-6">Your cart is empty.</p>
          <Link
            to="/"
            className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition cursor-pointer"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-md shadow-sm p-4 sm:p-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Price: ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-md shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>${calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold mt-4">
                <span>Total</span>
                <span>${calculateSubtotal()}</span>
              </div>
              <button
                onClick={handleOnClickProceedToCheckout}
                className="w-full block bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition text-center mt-6"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Cart;
