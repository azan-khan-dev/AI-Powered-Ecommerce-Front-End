import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../Features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../Features/Wishlist/WishlistSlice";
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from "../../redux/apis/wishlistApis";
import { useGetUserWishlistQuery } from "../../redux/apis/wishlistApis";
const ProductCard = ({ product }) =>
{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addToWishlistApi, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlistApi, { isLoading: isRemovingFromWishlist }] = useRemoveFromWishlistMutation();
  const { data: wishlistData, isLoading: isWishlistLoading, isError: isWishlistError, refetch: refetchWishlist } = useGetUserWishlistQuery();
  // check product wishlist mei hai ya nahi
  const wishlist = wishlistData?.data || [];
  const isInWishlist = wishlist?.some((item) => item?.product?.id || item?.product?._id === product?.id);

  const toggleWishlist = (e) => {
  e.stopPropagation();
  if (isInWishlist) {
    dispatch(removeFromWishlist(product?.id));
    removeFromWishlistApi(product?.id).then(() => {
      refetchWishlist();
    });
  } else {
    dispatch(addToWishlist({ product: { _id: product?.id, name: product?.title, images: [{ url: product?.image }], price: product?.price, is_flash_sale: product?.isFlashSale } }));
    addToWishlistApi(product?.id).then(() => {
      refetchWishlist();
    });
  }
};


  return (
    <div
      className="w-72 bg-white group relative overflow-hidden cursor-pointer"
      onClick={() => navigate(`/product/${product?.id}`)}
    >
      <div className="relative w-full h-62 overflow-hidden rounded-md">
        <img
          src={product?.image}
          alt={product?.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Wishlist Heart */}
        <div
          className="absolute top-2 right-2 transition-opacity duration-300"
          onClick={toggleWishlist}
        >
          <div className={`w-10 h-10 bg-gray-200 hover:bg-black rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${(isAddingToWishlist || isRemovingFromWishlist) ? 'opacity-50 cursor-wait' : ''}`}>
            {(isAddingToWishlist || isRemovingFromWishlist) ? (
              <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isInWishlist ? (
              <AiFillHeart className="text-red-500" size={22} />
            ) : (
              <AiOutlineHeart className="text-gray-700" size={22} />
            )}
          </div>
        </div>

        {/* Add to Cart */}
        <div className="absolute bottom-[-100%] left-0 w-full transition-all duration-300 group-hover:bottom-0">
          <button
            onClick={(e) =>
            {
              e.stopPropagation();
              dispatch(
                addToCart({
                  id: product?.id,
                  name: product?.name,
                  price: product?.price,
                  image: product?.image,
                })
              );
            }}
            className="w-full py-3 text-sm font-medium bg-white text-black group-hover:bg-black group-hover:text-white hover:bg-white hover:text-black cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <h3 className="mt-4 text-lg font-semibold text-gray-700 px-3 truncate">
        {product?.name}
      </h3>
      <div className="mt-1 flex items-center gap-3 px-3">
        <span className="text-red-600 font-bold text-base">${product?.price}</span>
        <span className="line-through text-gray-400 text-sm">
          ${product?.originalPrice}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 px-3 pb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={
              i < Math.round(product?.rating) ? "text-yellow-500" : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600">({product?.rating})</span>
      </div>
    </div>
  );
};

export default ProductCard;
