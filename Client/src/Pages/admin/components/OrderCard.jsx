import React from 'react';

const OrderCard = ({ order, customerName, onStatusChange, onViewDetails, isUpdating = false }) =>
{
  const getStatusColor = (status) =>
  {
    switch (status)
    {
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

  const handleStatusChange = (e) =>
  {
    onStatusChange(order.id, e.target.value);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">#{order.id}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order?.status)}`}>
              {order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1)}
            </div>
            {order?.cancelledBy === 'client' && order?.status === 'cancelled' && (
              <div className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full border border-orange-200">
                Cancelled by Client
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{customerName}</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 ml-4 absolute right-6 mt-2 "><br />
          <select
            value={order?.status}
            onChange={handleStatusChange}
            disabled={isUpdating || (order?.cancelledBy === 'client' && order?.status === 'cancelled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 hover:shadow-md min-w-[120px] ${
              isUpdating || (order?.cancelledBy === 'client' && order?.status === 'cancelled')
                ? 'cursor-not-allowed opacity-60 bg-gray-100'
                : 'cursor-pointer'
            } ${getStatusColor(order?.status)}`}
          >
            {isUpdating ? (
              <option value={order?.status}>Updating...</option>
            ) : (
              <>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </>
            )}
          </select>
          {isUpdating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
            <p className="text-sm font-medium text-gray-900">{order?.orderDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Items</p>
            <p className="text-sm font-medium text-gray-900">{order?.items?.length} item{order?.items?.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Items</h4>
        <div className="space-y-2">
          {order?.items?.slice(0, 2).map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900 truncate flex-1">{item?.productName || item?.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Qty: {item?.quantity}</span>
                <span className="text-sm font-semibold text-red-600">${item?.price}</span>
              </div>
            </div>
          ))}
          {order?.items?.length > 2 && (
            <div className="text-center py-2">
              <span className="text-sm text-gray-500 italic bg-gray-100 px-3 py-1 rounded-full">
                +{order?.items?.length - 2} more item{order?.items?.length - 2 !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Total and Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="text-xl font-bold text-red-600">
            ${order?.total?.toFixed(2) || order?.totalAmount?.toFixed(2)}
          </span>
        </div>

        <button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => onViewDetails(order)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </div>
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
