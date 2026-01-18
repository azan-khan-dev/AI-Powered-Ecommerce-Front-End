import React, { useState, useEffect } from 'react';

const OrderDetails = ({ order, customer, onClose, onStatusChange }) => {
  // Local state for immediate status update
  const [currentStatus, setCurrentStatus] = useState(order?.status || 'pending');

  // Sync local state if parent order status changes
  useEffect(() => {
    setCurrentStatus(order?.status || 'pending');
  }, [order?.status]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'confirmed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus); // Frontend pe foran update
    onStatusChange(order?._id || order?.id, newStatus); // Backend update
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Order Details</h2>
              <p className="text-sm text-gray-600 m-0">Order #{order?.orderNumber}</p>
            </div>
          </div>
          <button
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Status Update Banner */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentStatus === 'delivered'
                      ? 'bg-green-500'
                      : currentStatus === 'cancelled'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                ></div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Order Status</h3>
                  <p className="text-sm text-gray-600">Update the current order status</p>
                </div>
              </div>
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 hover:shadow-md ${getStatusColor(currentStatus)}`}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Order & Customer Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Order Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Order Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Order Number</span>
                  <span className="text-sm font-semibold text-gray-900">{order?.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Order Date</span>
                  <span className="text-sm font-semibold text-gray-900">{formatDate(order?.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Last Updated</span>
                  <span className="text-sm font-semibold text-gray-900">{formatDate(order?.updatedAt)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Payment Status</span>
                  <span className="text-sm font-semibold text-gray-900 capitalize">{order?.paymentStatus}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Payment Method</span>
                  <span className="text-sm font-semibold text-gray-900 capitalize">{order?.paymentMethod?.replace('_', ' ')}</span>
                </div>
                {order?.shippingAddress && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Shipping Address</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {customer?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{customer?.name}</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{customer?.email}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Phone</span>
                    <span className="text-sm font-semibold text-gray-900">{order.shippingAddress.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                <p className="text-sm text-gray-600">{order?.items?.length} item{order?.items?.length !== 1 ? 's' : ''} in this order</p>
              </div>
            </div>

            <div className="space-y-4">
              {order?.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <img src={item?.image} alt={item?.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">{item?.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Qty: {item?.quantity}</span>
                      <span>${item?.price?.toFixed(2)} each</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${(item?.price * item?.quantity)?.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ${order?.subtotal?.toFixed(2) || (order?.totalAmount * 0.9)?.toFixed(2) || '0.00'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">${order?.shipping?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-red-50 -mx-2 px-2 rounded-lg">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-red-600">
                  ${order?.totalAmount?.toFixed(2) || order?.total?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
