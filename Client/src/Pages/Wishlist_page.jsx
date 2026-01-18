import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillHeart } from "react-icons/ai";
import { removeFromWishlist } from "../Features/Wishlist/WishlistSlice";
import { addToCart } from "../Features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { useGetUserWishlistQuery } from "../redux/apis/wishlistApis";
import { useRemoveFromWishlistMutation } from "../redux/apis/wishlistApis";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [removeFromWishlistApi, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
  const { data, isLoading, isError, refetch: refetchWishlist } = useGetUserWishlistQuery();
  const wishlist = data?.data || [];
  const [removingProductId, setRemovingProductId] = useState(null);

  if (isLoading){
    return (
      <div className="w-full py-8">
        <h2 className="text-3xl text-center font-semibold mb-9">My Wishlist</h2>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-red-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 text-lg">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }
  if (isError){
    return (
      <div className="w-full py-8">
        <h2 className="text-3xl text-center font-semibold mb-9">My Wishlist</h2>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">Error loading wishlist</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <h2 className="text-3xl text-center font-semibold mb-9">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-500 text-center text-2xl">
            No items in wishlist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors cursor-pointer"
          >
            Add Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-37">
          {wishlist?.map((item) => (
            <div
              key={item.product?._id || item.product?.id}
              className="w-72 bg-white group relative overflow-hidden cursor-pointer rounded-md shadow-md hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/product/${item.product?._id || item.product?.id}`)}
            >
              {/* Image Section */}
              <div className="relative w-full h-64 overflow-hidden rounded-md">
                <img
                  src={item.product?.images?.[0]?.url || item.product?.image}
                  alt={item.product?.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Remove from Wishlist */}
                <div
                  className={`absolute top-2 right-2 w-10 h-10 bg-gray-200 hover:bg-black rounded-full flex items-center justify-center cursor-pointer transition-colors ${removingProductId === (item.product?._id || item.product?.id) ? 'opacity-50 cursor-wait' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const productId = item.product?._id || item.product?.id;
                    setRemovingProductId(productId);
                    dispatch(removeFromWishlist(productId));
                    removeFromWishlistApi(productId).unwrap()
                      .then(() => {
                        refetchWishlist();
                      })
                      .catch((error) => {
                        console.error('Failed to remove from wishlist:', error);
                      })
                      .finally(() => {
                        setRemovingProductId(null);
                      });
                  }}
                >
                  {removingProductId === (item.product?._id || item.product?.id) ? (
                    <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <AiFillHeart className="text-red-500" size={22} />
                  )}
                </div>

                {/* Add to Cart Button */}
                <div className="absolute bottom-[-100%] left-0 w-full transition-all duration-300 group-hover:bottom-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        addToCart({
                          id: item.product?._id || item.product?.id,
                          name: item.product?.name,
                          price: item.product?.is_flash_sale ? item.product?.flash_sale_price : item.product?.price,
                          image: item.product?.images?.[0]?.url || item.product?.image,
                          originalPrice: item.product?.is_flash_sale ? item.product?.price : undefined,
                          rating: item.product?.rating || 4.5,
                        })
                      );
                    }}
                    className="w-full py-3 text-sm font-medium bg-white text-black group-hover:bg-black group-hover:text-white hover:bg-white hover:text-black cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-4 text-lg font-semibold text-gray-700 px-3 truncate">
                {item.product?.name}
              </h3>

              {/* Price Section */}
              <div className="mt-1 flex items-center gap-3 px-3">
                <span className="text-red-600 font-bold text-base">
                  ${item.product?.is_flash_sale ? item.product?.flash_sale_price : item.product?.price}
                </span>
                {item.product?.is_flash_sale && (
                  <span className="line-through text-gray-400 text-sm">
                    ${item.product?.price}
                  </span>
                )}
              </div>

              {/* Rating */}
              {item.product?.rating && (
                <div className="mt-1 flex items-center gap-2 px-3 pb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.round(item.product?.rating || 4.5)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-600">
                    ({item.product?.rating || 4.5})
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
