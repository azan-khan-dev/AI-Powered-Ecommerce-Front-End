import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard/Product_card";
import {
  useGetAllFlashSaleProductsQuery,
  useGetAllBestSellingProductsQuery,
  useGetFeaturedProductsQuery,
  useGetAllProductsQuery
} from "../redux/apis/homeApis";

const Products = () => {
  const { type } = useParams();

  // 🔹 Pagination states
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // 🔹 Determine which query to use based on type
  let queryResult;
  switch (type) {
    case 'flash-sales':
      queryResult = useGetAllFlashSaleProductsQuery();
      break;
    case 'best-selling':
      queryResult = useGetAllBestSellingProductsQuery();
      break;
    case 'featured':
      queryResult = useGetFeaturedProductsQuery();
      break;
    default:
      queryResult = useGetAllProductsQuery({ page: 1, limit: 20 });
      break;
  }

  const products = queryResult.data?.data || [];
  const isLoading = queryResult.isLoading;

  // 🔹 Transform data for ProductCard
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

  // 🔹 Pagination logic
  const totalPages = Math.ceil(transformedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = transformedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-12">
      <h2 className="text-3xl font-semibold mb-16 text-center capitalize">
        {type?.replace("-", " ") || "Products"}
      </h2>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>

      {/* Pagination (3 se zyada products hone par) */}
      {transformedProducts.length > 3 && (
        <div className="flex justify-center mt-10 gap-2 flex-wrap">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            const isActive = page === pageNumber;

            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-black hover:ring-2 hover:ring-red-500 hover:bg-transparent"
                  }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
