import React, { useState } from 'react';
import { useGetDashboardStatsQuery, useGetSalesAnalyticsQuery } from '../../../redux/apis/dashboardApis';
import StatCard from '../components/StatCard';
import Chart from '../components/Chart';
import RecentOrders from '../components/RecentOrders';
import LowStockAlert from '../components/LowStockAlert';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('monthly');

  // API calls
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useGetDashboardStatsQuery();
  const { data: salesAnalytics, isLoading: analyticsLoading } = useGetSalesAnalyticsQuery({
    period: timeFilter
  });

  const getFilteredData = () => {
    if (!salesAnalytics || !salesAnalytics.data) return [];
    return salesAnalytics.data.map(item => ({
      date: item._id.month ? `${item._id.year}-${item._id.month}` : item.date,
      revenue: item.revenue,
      orders: item.orders,
      averageOrderValue: item.averageOrderValue,
    }));
  };

  if (statsLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center text-red-500">
          Failed to load dashboard data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 m-0">Dashboard Overview</h1>
        <div className="flex items-center">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Sales"
          value={dashboardStats?.data?.totalSales || 0}
          icon="💰"
          change="+12.5%"
          changeType="positive"
        />
        <StatCard
          title="Total Revenue"
          value={`$${dashboardStats?.data?.totalRevenue?.toLocaleString() || 0}`}
          icon="📈"
          change="+8.2%"
          changeType="positive"
        />
        <StatCard
          title="Total Orders"
          value={dashboardStats?.data?.totalOrders || 0}
          icon="🛒"
          change="+15.3%"
          changeType="positive"
        />
        <StatCard
          title="Average Order Value"
          value={`$${dashboardStats?.data?.averageOrderValue?.toFixed(2) || 0}`}
          icon="📊"
          change="+5.1%"
          changeType="positive"
        />
      </div>

     

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={dashboardStats?.data?.recentOrders || []} />
        </div>

        <div className="lg:col-span-1">
          <LowStockAlert />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
