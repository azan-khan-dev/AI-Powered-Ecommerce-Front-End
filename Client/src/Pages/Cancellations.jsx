import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCancelledOrders } from "../Features/Orders/OrdersSlice";

const Cancellations = () => {
  const user = useSelector((state) => state.auth.user);
  const cancelledOrders = useSelector(selectCancelledOrders);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cancellations.</p>
          <Link
            to="/login"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Cancellations</h1>
          <p className="mt-2 text-gray-600">View and manage your cancelled orders</p>
        </div>

        {cancelledOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No cancelled orders</h3>
            <p className="text-gray-600 mb-6">You haven't cancelled any orders yet.</p>
            <Link
              to="/"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {cancelledOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Cancellation Banner */}
                <div className="bg-red-50 border-b border-red-200 px-6 py-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-red-800 font-medium">Order Cancelled</span>
                    <span className="text-red-600 text-sm">by {order.cancelledBy === 'client' ? 'You' : 'Admin'}</span>
                  </div>
                </div>

                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Cancelled on {new Date(order.updatedAt || order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                        Cancelled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg opacity-60"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 line-through">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 line-through">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Total: <span className="font-medium line-through text-gray-500">${order.totalAmount}</span>
                      </p>
                      {order.shippingAddress && (
                        <p className="text-sm text-gray-600">
                          Shipping to: {order.shippingAddress.street}, {order.shippingAddress.city}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Payment Method: {order.paymentMethod}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cancellations;