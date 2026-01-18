import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetMyOrdersQuery, useCancelOrderMutation } from "../redux/apis/orderApis";
import { cancelOrder } from "../Features/Orders/OrdersSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Orders = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const { data: ordersData, isLoading, error, refetch } = useGetMyOrdersQuery({
    page: 1,
    limit: 20,
  });

  const [cancelOrderApi, { isLoading: cancelling }] = useCancelOrderMutation();

  const orders = ordersData?.data || [];

  const handleCancelOrder = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      await cancelOrderApi(orderToCancel).unwrap();
      dispatch(cancelOrder(orderToCancel));
      refetch(); // Refetch orders to get updated data
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
      setOrderToCancel(null);
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error(error?.data?.message || "Failed to cancel order");
    }
  };

  const cancelCancelOrder = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusProgress = (status) => {
    const statuses = ["pending", "confirmed", "processing", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(status);
    return currentIndex >= 0 ? (currentIndex / (statuses.length - 1)) * 100 : 0;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orders</h2>
          <p className="text-gray-600">Failed to load your orders. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">When you place an order, it will appear here.</p>
            <Link
              to="/"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Progress */}
                {order.status !== "cancelled" && (
                  <div className="px-6 py-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Order Progress</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(getStatusProgress(order.status))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getStatusProgress(order.status)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>Ordered</span>
                      <span>Confirmed</span>
                      <span>Processing</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">${item.price}</p>
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
                        Total: <span className="font-medium text-gray-900">${order.totalAmount}</span>
                      </p>
                      {order.shippingAddress && (
                        <p className="text-sm text-gray-600">
                          Shipping to: {order.shippingAddress.street}, {order.shippingAddress.city}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancelling}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancelling ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        {selectedOrder === order._id ? "Hide Details" : "View Details"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {selectedOrder === order._id && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Shipping Address */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingAddress?.street}</p>
                          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                          <p>{order.shippingAddress?.country}</p>
                          <p>Phone: {order.shippingAddress?.phoneNumber}</p>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Order Information</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Order ID: {order._id}</p>
                          <p>Order Number: {order.orderNumber}</p>
                          <p>Payment Method: {order.paymentMethod}</p>
                          <p>Payment Status: {order.paymentStatus}</p>
                          {order.trackingNumber && (
                            <p>Tracking Number: {order.trackingNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700">
                    Are you sure you want to cancel this order? This will restore the product stock and cannot be reversed.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelCancelOrder}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    disabled={cancelling}
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={confirmCancelOrder}
                    disabled={cancelling}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {cancelling && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {cancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;