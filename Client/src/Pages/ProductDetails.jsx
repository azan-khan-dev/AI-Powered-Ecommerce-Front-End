import React, { useEffect, useState } from "react";
import { FaTruckFast, FaArrowsRotate } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { addToCart } from "../Features/cart/cartSlice";
import { useGetProductQuery } from "../redux/apis/productApis";

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // 🔐 auth user
  const user = useSelector((state) => state.auth?.user);

  const { data: productData, isLoading } = useGetProductQuery(id);
  const product = productData?.data;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  // set first image
  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  // 🔐 auth check helper
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

  // 🛒 Add to cart handler
  const handleAddToCart = () => {
    if (!checkAuth()) return;

    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        quantity,
      })
    );

    toast.success("Added to cart", {
      position: "top-right",
      autoClose: 1500,
    });
  };

  // 💳 Buy now handler
  const handleBuyNow = () => {
    if (!checkAuth()) return;

    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        quantity,
      })
    );

    navigate("/checkout"); // ya /checkout
  };

  // Loader
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-lg">Loading product...</p>
      </div>
    );

  if (!product)
    return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <span className="text-black">{product.name}</span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Thumbnails */}
        <div className="lg:col-span-2">
          <div className="flex flex-row lg:flex-col gap-4">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img.url)}
                className={`w-24 h-24 lg:w-full bg-gray-100 rounded-lg overflow-hidden border-2 ${selectedImage === img.url
                  ? "border-red-500"
                  : "border-transparent"
                  }`}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${i}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Image */}
        <div className="lg:col-span-6">
          <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Main Product"
              className="w-full h-full object-contain p-8"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-4">
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
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
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviews} Reviews)
            </span>
            <span className="text-sm text-green-500">In Stock</span>
          </div>

          {/* Price - cross  */}
          <div className={`text-2xl font-semibold mb-4 ${product?.flash_sale_price ? "line-through" : ""}`}>
            ${product.price}.00
          </div>


          {/* Discounted Price */}
          {product?.flash_sale_price && (
            <div className="text-xl font-semibold mb-4">
              ${product?.flash_sale_price}.00
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6">
            {product.description}
          </p>

          {/* Quantity + Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded h-12 overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-4 text-2xl hover:bg-gray-100"
              >
                –
              </button>

              <span className="px-4 py-2 text-xl w-16 text-center border-x">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-4 text-2xl bg-red-500 text-white hover:bg-red-600"
              >
                +
              </button>
            </div>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              className="bg-red-500 text-white px-3 py-3 rounded hover:bg-red-600"
            >
              Buy Now
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-4 py-3 rounded hover:bg-gray-800"
            >
              Add to Cart
            </button>
          </div>

          {/* Delivery Info */}
          <div className="space-y-4">
            <div className="p-4 border rounded flex items-start gap-3">
              <FaTruckFast className="text-red-500 text-2xl mt-1" />
              <div>
                <p className="font-medium text-sm">Free Delivery</p>
                <p className="text-xs text-gray-600 underline">
                  Enter postal code for availability
                </p>
              </div>
            </div>

            <div className="p-4 border rounded flex items-start gap-3">
              <FaArrowsRotate className="text-red-500 text-2xl mt-1" />
              <div>
                <p className="font-medium text-sm">Return Delivery</p>
                <p className="text-xs text-gray-600">
                  Free 30 Days Return Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
