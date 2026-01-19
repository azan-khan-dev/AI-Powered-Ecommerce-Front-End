import React from 'react';
import { FaUser } from 'react-icons/fa';
const UserCard = ({ user }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start mb-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full mr-4"
          />
        ) : (
          <div className="w-16 h-16 rounded-full mr-4 bg-gray-200 flex items-center justify-center">
            <FaUser className="text-gray-400 text-2xl" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 m-0 mb-1">{user.name}</h3>
          <p className="text-gray-600 m-0 mb-2">{user.email}</p>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {user.status}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Phone:</span>
          <span className="text-gray-900">{user.phone || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Address:</span>
          <span className="text-gray-900 text-right max-w-xs truncate">{user.address || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Joined:</span>
          <span className="text-gray-900">{user.createdAt.split('T')[0] || "N/A"}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-center">
          <span className="text-xl font-bold text-gray-800 block">{user.totalOrders}</span>
          <span className="text-xs text-gray-500 uppercase font-medium">Orders</span>
        </div>
        <div className="text-center">
          <span className="text-xl font-bold text-gray-800 block">${user.totalSpent.toFixed(2)}</span>
          <span className="text-xs text-gray-500 uppercase font-medium">Total Spent</span>
        </div>
        <div className="text-center">
          <span className="text-xl font-bold text-gray-800 block">
            ${user.totalOrders > 0 ? (user.totalSpent / user.totalOrders).toFixed(2) : '0.00'}
          </span>
          <span className="text-xs text-gray-500 uppercase font-medium">Avg Order</span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
