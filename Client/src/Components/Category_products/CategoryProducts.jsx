import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductsByCategoryQuery } from "../../redux/apis/productApis";
import ProductCard from "../ProductCard/Product_card";

const CategoryProducts = () => {
  const { categoryName } = useParams();

  const { data: categoryData, isLoading, error } = useGetProductsByCategoryQuery({
    categoryName: categoryName.replace(/-/g, " "),
    page: 1,
    limit: 20,
  });

  const products = categoryData?.data || [];

  // Transform data to match ProductCard format
  const transformedProducts = products.map(product => ({
    id: product._id,
    image: product.images?.[0]?.url,
    title: product.name,
    description: product.description,
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
            <p className="text-lg mb-4">Failed to load category products</p>
            <p className="text-sm">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 capitalize">
            {categoryName.replace(/-/g, " ")}
          </h1>
          <p className="text-gray-600">
            {products.length > 0
              ? `Found ${products.length} product${products.length > 1 ? 's' : ''} in this category`
              : `No products found in this category`
            }
          </p>
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
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              This category doesn't have any products yet.
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

export default CategoryProducts;
