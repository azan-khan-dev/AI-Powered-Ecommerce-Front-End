import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const paymentApis = createApi({
  reducerPath: "paymentApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/payments`,
    credentials: "include",
  }),
  tagTypes: ["payments", "Payments", "PaymentAnalytics"],

  endpoints: (builder) => ({
    // create payment intent
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: "/create-payment-intent",
        method: "POST",
        body: data,
      }),
    }),
    // Admin: Get all payments with filters
    getAllPayments: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "", startDate = "", endDate = "", sortBy = "createdAt", sortOrder = "desc" }) => ({
        url: "/",
        params: { page, limit, search, status, startDate, endDate, sortBy, sortOrder },
      }),
      providesTags: ["Payments"],
    }),
    // Admin: Get payment analytics
    getPaymentAnalytics: builder.query({
      query: ({ period = "monthly" } = {}) => ({
        url: "/analytics",
        params: { period },
      }),
      providesTags: ["PaymentAnalytics"],
    }),
    // Admin: Update payment status
    updatePaymentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Payments", "PaymentAnalytics"],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useGetAllPaymentsQuery,
  useGetPaymentAnalyticsQuery,
  useUpdatePaymentStatusMutation,
} = paymentApis;

export default paymentApis;
