import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { addToCart } from "../../Features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../Features/Wishlist/WishlistSlice";

import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetUserWishlistQuery,
} from "../../redux/apis/wishlistApis";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔐 Auth user
  const user = useSelector((state) => state.auth?.user);

  // Wishlist APIs
  const [addToWishlistApi, { isLoading: isAdding }] =
    useAddToWishlistMutation();
  const [removeFromWishlistApi, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

  const { data: wishlistData, refetch } = useGetUserWishlistQuery(
    undefined,
    { skip: !user } // 🚫 login nahi to API hit nahi
  );

  const wishlist = wishlistData?.data || [];

  const isInWishlist = wishlist.some(
    (item) =>
      item?.product?._id === product?.id ||
      item?.product?.id === product?.id
  );

  // 🔐 Auth guard
  const checkAuth = () => {
    if (!user) {
      toast.error("Please login first", {
        position: "top-right",
        autoClose: 2000,
      });
      return false;
    }
    return true;
  };

  // ❤️ Wishlist handler
  const toggleWishlist = (e) => {
    e.stopPropagation();

    if (!checkAuth()) return;

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      removeFromWishlistApi(product.id).then(refetch);
    } else {
      dispatch(
        addToWishlist({
          product: {
            _id: product.id,
            name: product.title,
            images: [{ url: product.image }],
            price: product.price,
            is_flash_sale: product.isFlashSale,
          },
        })
      );

      addToWishlistApi(product.id).then(refetch);
    }
  };

  // 🛒 Cart handler
  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!checkAuth()) return;

    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image,
      })
    );

    toast.success("Added to cart", {
      position: "top-right",
      autoClose: 1500,
    });
  };

  return (
    <div
      className="w-72 bg-white group relative overflow-hidden cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative w-full h-62 overflow-hidden rounded-md">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* ❤️ Wishlist */}
        <div
          className="absolute top-2 right-2"
          onClick={toggleWishlist}
        >
          <div className="w-10 h-10 bg-gray-200 hover:bg-black rounded-full flex items-center justify-center transition">
            {isAdding || isRemoving ? (
              <svg
                className="animate-spin h-5 w-5 text-gray-700"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : isInWishlist ? (
              <AiFillHeart size={22} className="text-red-500" />
            ) : (
              <AiOutlineHeart size={22} className="text-gray-700" />
            )}
          </div>
        </div>

        {/* 🛒 Add to Cart */}
        <div className="absolute bottom-[-100%] left-0 w-full transition-all duration-300 group-hover:bottom-0">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 text-sm font-medium bg-white text-black group-hover:bg-black group-hover:text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <h3 className="mt-4 text-lg font-semibold text-gray-700 px-3 truncate">
        {product.title}
      </h3>

      <div className="mt-1 flex items-center gap-3 px-3">
        <span className="text-red-600 font-bold text-base">
          ${product.price}
        </span>
        <span className="line-through text-gray-400 text-sm">
          ${product.originalPrice}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-2 px-3 pb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={
              i < Math.round(product.rating)
                ? "text-yellow-500"
                : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600">
          ({product.rating})
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
