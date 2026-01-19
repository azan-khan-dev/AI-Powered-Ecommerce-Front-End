import React, { useState, useEffect } from 'react';
import { useGetDashboardStatsQuery, useGetAllUsersQuery } from '../../../redux/apis/dashboardApis';
import UserCard from '../components/UserCard';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12; // Adjust as needed

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: dashboardStats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: usersData, isLoading: usersLoading, isFetching } = useGetAllUsersQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const users = usersData?.data?.users || [];
  const pagination = usersData?.data?.pagination || {};

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < pagination.pages) setPage(page + 1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 m-0">Users Management</h1>
      </div>

      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" w-full lg:w-80
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

      {/* Top Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900 m-0">
            {statsLoading ? "..." : dashboardStats?.data?.users?.length || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900 m-0">
            {statsLoading ? "..." : dashboardStats?.data?.totalOrders || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900 m-0">
            ${statsLoading ? "..." : dashboardStats?.data?.totalRevenue?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Avg Order Value</h3>
          <p className="text-3xl font-bold text-gray-900 m-0">
            ${statsLoading ? "..." : dashboardStats?.data?.averageOrderValue?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div> */}

      {/* Users Grid */}
      {usersLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading users...</p>
        </div>
      ) : (
        <>
          {users.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No users found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 opacity-100 transition-opacity duration-300" style={{ opacity: isFetching ? 0.6 : 1 }}>
              {users.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={`px-4 py-2 border rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === pagination.pages}
                className={`px-4 py-2 border rounded-md ${page === pagination.pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Users;
