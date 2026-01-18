import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard/Product_card";
import { setProducts } from "../Features/Products/productsSlice";
import {
  useGetAllFlashSaleProductsQuery,
  useGetAllBestSellingProductsQuery,
  useGetFeaturedProductsQuery,
  useGetAllProductsQuery
} from "../redux/apis/homeApis";

const Products = () => {
  const { type } = useParams();
  const dispatch = useDispatch();

  // Always call all hooks at the top level (Rules of Hooks)

  // Determine which query result to use based on type
  let queryResult;
  switch (type) {
    case 'flash-sales':
      const flashSaleQuery = useGetAllFlashSaleProductsQuery();
      queryResult = flashSaleQuery;
      break;
    case 'best-selling':
      const bestSellingQuery = useGetAllBestSellingProductsQuery();
      queryResult = bestSellingQuery;
      break;
    case 'featured':
      const featuredQuery = useGetFeaturedProductsQuery();
      queryResult = featuredQuery;
      break;
    default:
      const allProductsQuery = useGetAllProductsQuery({ page: 1, limit: 20 });
      queryResult = allProductsQuery;
  }

  const products = queryResult.data?.data || [];
  const isLoading = queryResult.isLoading;

  // Transform data to match ProductCard format if needed
  const transformedProducts = products.map(product => ({
    id: product._id,
    image: product.images?.[0]?.url,
    title: product.name,
    price: product.is_flash_sale ? product.flash_sale_price : product.price,
    originalPrice: product.is_flash_sale ? product.price : undefined,
    rating: product.rating || 4.5,
    category: product.category,
    description: product.description,
    isFlashSale: product.is_flash_sale,
    stock: product.stock,
    reviews: product.reviews || 0
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Update Redux state for backward compatibility
  // useEffect(() => {
  //   if (transformedProducts.length > 0) {
  //     dispatch(setProducts(transformedProducts));
  //     localStorage.setItem("products", JSON.stringify(transformedProducts));
  //   }
  // }, [transformedProducts, dispatch]);

  return (
    <div className="p-12">
      <h2 className="text-3xl font-semibold mb-16 text-center capitalize">
        {type?.replace("-", " ") || "Products"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {transformedProducts?.length > 0 ? (
          transformedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
