import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const homeApis = createApi({
  reducerPath: "homeApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/home`,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    // Search products
    searchProducts: builder.query({
      query: (params) => ({
        url: "/search",
        method: "GET",
        params,
      }),
    }),

    // Get top categories
    getTopCategories: builder.query({
      query: () => ({
        url: "/categories/top",
        method: "GET",
      }),
    }),

    // Get flash sale products
    getFlashSaleProducts: builder.query({
      query: () => ({
        url: "/flash-sale",
        method: "GET",
      }),
    }),

    // Get all flash sale products
    getAllFlashSaleProducts: builder.query({
      query: (params) => ({
        url: "/flash-sale/all",
        method: "GET",
        params,
      }),
    }),

    // Get best selling products
    getBestSellingProducts: builder.query({
      query: () => ({
        url: "/best-selling",
        method: "GET",
      }),
    }),

    // Get all best selling products
    getAllBestSellingProducts: builder.query({
      query: (params) => ({
        url: "/best-selling/all",
        method: "GET",
        params,
      }),
    }),

    // Get featured products
    getFeaturedProducts: builder.query({
      query: () => ({
        url: "/featured",
        method: "GET",
      }),
    }),

    // Get all products
    getAllProducts: builder.query({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params,
      }),
    }),

    // Get products by category
    getProductsByCategory: builder.query({
      query: (params) => ({
        url: "/category/products",
        method: "GET",
        params,
      }),
    }),

    // our-products
    getOurProducts: builder.query({
      query: () => ({
        url: "/our-products",
        method: "GET",
      }),
    }),

  }),
});

export const {
  useSearchProductsQuery,
  useGetTopCategoriesQuery,
  useGetFlashSaleProductsQuery,
  useGetAllFlashSaleProductsQuery,
  useGetBestSellingProductsQuery,
  useGetAllBestSellingProductsQuery,
  useGetFeaturedProductsQuery,
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
  useGetOurProductsQuery
} = homeApis;

export default homeApis;
