import React from "react";
import { useDispatch } from "react-redux";
import { setProducts } from "../../Features/Products/productsSlice"; // ✅ import
import ProductCard from "../ProductCard/Product_card";
import { useGetOurProductsQuery } from "../../redux/apis/homeApis"
import { useNavigate } from "react-router-dom";

const Our_products = () => {

  const { data, isLoading } = useGetOurProductsQuery();

  const ourProducts = data?.data || data

  const navigate = useNavigate()

  const products = ourProducts?.map((product) => ({
    id: product?._id,
    image: product?.images?.[0]?.url,
    title: product?.name,
    price: product?.is_flash_sale ? product?.flash_sale_price : product?.price,
    originalPrice: product?.is_flash_sale ? product?.price : undefined,
    rating: product?.rating || 4.5,
    category: product?.category,
    description: product?.description,
    isFlashSale: product?.is_flash_sale,
    stock: product?.stock,
    reviews: product?.reviews || 0
  })) || []


  const handleViewAll = () => {
    navigate("/products/our-products");
  };

  if(isLoading){
    return(
      <div>Loading....</div>
    )
  }

  return (
    <div className="w-full px-6 py-5">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative inline-block group cursor-pointer">
          <div className="absolute top-0 left-0 h-full bg-red-500 rounded-sm transition-all duration-500 w-3 group-hover:w-full z-0"></div>
          <h3 className="relative z-10 px-6 py-1 text-red-500 font-semibold transition-colors duration-500 group-hover:text-white">
            Our Products
          </h3>
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 whitespace-nowrap">
          Explore Our Products
        </h2>
      </div>

      {/* Product Grid - sirf preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => ( // ✅ sirf 4 dikhayenge preview me
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="w-full flex justify-center mt-6">
        <button
          onClick={handleViewAll}
          className="bg-red-600 text-white px-7 py-3 rounded-sm hover:bg-red-500 transition cursor-pointer mt-5 font-quicksand font-semibold"
        >
          View All Product
        </button>
      </div>

      <hr className="mt-17 border-t-2 border-gray-300" />
    </div>
  );
};

export default Our_products;
