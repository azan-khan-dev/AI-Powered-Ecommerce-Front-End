import React from 'react';

const RecentOrders = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-orange-500';
      case 'pending':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 m-0 mb-5">Recent Orders</h3>

      <div className="mb-4">
        {orders.map(order => (
          <div key={order.id} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-gray-800 text-sm">{order.orderNumber || order.id}</span>
                <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold uppercase ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="flex gap-4">
                <p className="text-sm text-gray-600 m-0">{order.customer?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-400 m-0">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-semibold text-gray-800">${order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default RecentOrders;
