import React, { useState, useEffect } from 'react';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation
} from '../../../redux/apis/orderApis';
import OrderCard from '../components/OrderCard';
import OrderDetails from '../components/OrderDetails';
import { toast } from 'react-toastify';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // 🔹 Pagination states
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6; // grid ke hisaab se

  // API hooks
  const { data: ordersData, isLoading, refetch } =
    useGetAllOrdersQuery({
      status: filterStatus === 'all' ? undefined : filterStatus,
    });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const allOrders = ordersData?.data || [];

  // 🔹 Search filter (frontend)
  const filteredOrders = allOrders.filter(order => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      order._id?.toLowerCase().includes(term) ||
      order.customer?.name?.toLowerCase().includes(term)
    );
  });

  // 🔹 Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const orders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // 🔹 Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [filterStatus, searchTerm]);

  const handleStatusChange = async (
    orderId,
    newStatus,
    trackingNumber = ''
  ) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus({
        id: orderId,
        status: newStatus,
        trackingNumber,
      }).unwrap();
      toast.success('Order status updated successfully');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const statusOptions = [
    'all',
    'pending',
    'processing',
    'shipped',
    'delivered',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Orders Management
        </h1>
      </div>

      {/* Search + Status Buttons */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 mb-6 items-center">
        {/* Search */}
        <div className="w-full lg:w-auto lg:mr-3">
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full lg:w-80
              px-4 py-2 text-base
              border border-gray-300 rounded-lg
              transition-all duration-200
              hover:border-red-500
              focus:outline-none
              focus:border-red-500
              focus:ring-1 focus:ring-red-500
            "
          />
        </div>

        {/* Status Buttons */}
        <div className="flex items-center gap-2 flex-wrap lg:ml-0">
          {statusOptions.map(status => {
            const isActive = status === filterStatus;

            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-6 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  whitespace-nowrap
                  ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-black hover:ring-2 hover:ring-red-500 hover:bg-transparent'
                  }
                `}
              >
                {status === 'all'
                  ? 'All Status'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats (UNCHANGED) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat title="Total Orders" value={allOrders.length} />
        <Stat
          title="Pending Orders"
          value={allOrders.filter(o => o.status === 'pending').length}
        />
        <Stat
          title="Processing"
          value={allOrders.filter(o => o.status === 'processing').length}
        />
        <Stat
          title="Shipped"
          value={allOrders.filter(o => o.status === 'shipped').length}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Orders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map(order => (
              <OrderCard
                key={order._id}
                order={{
                  ...order,
                  id: order._id,
                  customerId: order.customer?._id,
                }}
                customerName={order.customer?.name || 'Unknown Customer'}
                onStatusChange={handleStatusChange}
                onViewDetails={() => setSelectedOrder(order)}
                isUpdating={updatingOrderId === order._id}
              />
            ))}
          </div>

          {/* Pagination (SAME DESIGN STYLE) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isActive = page === pageNumber;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-black hover:ring-2 hover:ring-red-500 hover:bg-transparent'
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
          )}

          {/* Order Details Modal */}
          {selectedOrder && (
            <OrderDetails
              order={{
                ...selectedOrder,
                id: selectedOrder._id,
              }}
              customer={selectedOrder.customer}
              onClose={() => setSelectedOrder(null)}
              onStatusChange={handleStatusChange}
            />
          )}
        </>
      )}
    </div>
  );
};

const Stat = ({ title, value }) => (
  <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-200">
    <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase mb-2">
      {title}
    </h3>
    <p className="text-2xl sm:text-3xl font-bold text-gray-900 m-0">
      {value}
    </p>
  </div>
);

export default Orders;
