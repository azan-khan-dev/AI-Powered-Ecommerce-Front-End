import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const productApis = createApi({
  reducerPath: "productApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/products`,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    // Get all products
    getAllProducts: builder.query({
      query: (params) => ({
        url: "/",
        method: "GET",
        params,
      }),
    }),

    // Get single product
    getProduct: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),

    // Get my products (for sellers)
    getMyProducts: builder.query({
      query: () => ({
        url: "/my-products",
        method: "GET",
      }),
    }),

    // Get products by category
    getProductsByCategory: builder.query({
      query: ({ categoryName, ...params }) => ({
        url: `/category/${categoryName}`,
        method: "GET",
        params,
      }),
    }),

    // Create product
    createProduct: builder.mutation({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let browser set it for FormData
        prepareHeaders: (headers) => {
          delete headers['content-type'];
          return headers;
        },
      }),
    }),

    // Update product
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
        prepareHeaders: (headers) => {
          delete headers['content-type'];
          return headers;
        },
      }),
    }),

    // Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductQuery,
  useGetMyProductsQuery,
  useGetProductsByCategoryQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApis;

export default productApis;
