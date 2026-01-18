import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchProductsQuery } from "../redux/apis/homeApis";
import ProductCard from "../Components/ProductCard/Product_card";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: searchResults, isLoading, error } = useSearchProductsQuery(
    { q: query },
    { skip: !query }
  );

  const products = searchResults?.data || [];

  // Transform data to match ProductCard format
  const transformedProducts = products.map(product => ({
    id: product._id,
    image: product.images?.[0]?.url,
    title: product.name,
    price: product.is_flash_sale ? product.flash_sale_price : product.price,
    originalPrice: product.is_flash_sale ? product.price : undefined,
    rating: product.rating || 4.5,
    category: product.category,
    discount: product.is_flash_sale ?
      Math.round(((product.price - product.flash_sale_price) / product.price) * 100) : 0,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-red-500 py-10">
            <p className="text-lg mb-4">Failed to load search results</p>
            <p className="text-sm">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              {products.length > 0
                ? `Found ${products.length} result${products.length > 1 ? 's' : ''} for "${query}"`
                : `No results found for "${query}"`
              }
            </p>
          )}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {transformedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">
              <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or browse our categories
            </p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              Browse All Products
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;