import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const dashboardApis = createApi({
  reducerPath: "dashboardApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/dashboard`,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    // Get dashboard stats
    getDashboardStats: builder.query({
      query: () => ({
        url: "/stats",
        method: "GET",
      }),
    }),

    // Get sales analytics
    getSalesAnalytics: builder.query({
      query: (params) => ({
        url: "/sales",
        method: "GET",
        params,
      }),
    }),

    // Get product analytics
    getProductAnalytics: builder.query({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params,
      }),
    }),

    // Get customer analytics
    getCustomerAnalytics: builder.query({
      query: () => ({
        url: "/customers",
        method: "GET",
      }),
    }),

    // Get all users
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSalesAnalyticsQuery,
  useGetProductAnalyticsQuery,
  useGetCustomerAnalyticsQuery,
  useGetAllUsersQuery,
} = dashboardApis;

export default dashboardApis;
