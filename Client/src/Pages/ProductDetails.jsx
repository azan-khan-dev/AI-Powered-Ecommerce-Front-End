import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaTruckFast, FaArrowsRotate } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../Features/cart/cartSlice";
import ProductCard from "../Components/ProductCard/Product_card";
import { useGetProductQuery } from "../redux/apis/productApis";

const ProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(2);
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);

  const { id } = useParams();
  const { data: productData, isLoading } = useGetProductQuery(id);
  const product = productData?.data;

  console.log(product);
 

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!product) {
    return <div>Product not found</div>;
  }

  const colors = ["#ffffff", "#ff6b6b"];
  const sizes = ["XS", "S", "M", "L", "XL"];

  const dummyProduct = {
    id: 101,
    name: "Havic HV G-92 Gamepad",
    price: 192,
    rating: 4,
    reviews: 150,
    images: [
      "/api/placeholder/400/400",
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
    ],
    description:
      "PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.",
  };

  const relatedProducts = [
    {
      id: 1,
      title: "HAVIT HV-G92 Gamepad",
      originalPrice: 160,
      price: 120,
      rating: 5,
      image: "/api/placeholder/200/200",
    },
    {
      id: 2,
      title: "AK-900 Wired Keyboard",
      price: 960,
      rating: 4,
      image: "/api/placeholder/200/200",
    },
    {
      id: 3,
      title: "IPS LCD Gaming Monitor",
      originalPrice: 400,
      price: 370,
      rating: 5,
      image: "/api/placeholder/200/200",
    },
    {
      id: 4,
      title: "RGB liquid CPU Cooler",
      originalPrice: 170,
      price: 160,
      rating: 4,
      image: "/api/placeholder/200/200",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <span>Account</span>
        <span className="mx-2">/</span>
        <span>Gaming</span>
        <span className="mx-2">/</span>
        <span className="text-black">{product?.name}</span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Thumbnails */}
        <div className="lg:col-span-2">
          <div className="flex flex-row lg:flex-col gap-5">
            {product?.images?.slice(1).map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i + 1)}
                className={`w-24 h-24 lg:w-full lg:h-34 bg-gray-100 rounded-lg overflow-hidden border-2 
                  ${
                    selectedImage === i + 1
                      ? "border-red-500"
                      : "border-transparent"
                  }`}
              >
                <img
                  src={img?.url}
                  alt={`Thumb ${i + 1}`}
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
              src={product?.images[selectedImage]?.url}
              alt="Main Product"
              className="w-full h-full object-contain p-8"
            />
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-4">
          <h1 className="text-2xl font-semibold mb-2">{product?.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={i < Math.round(product?.rating) ? "text-yellow-500" : "text-gray-300"}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product?.reviews} Reviews)
            </span>
            <span className="text-sm text-green-500">In Stock</span>
          </div>

          {/* Price */}
          <div className="text-2xl font-semibold mb-4">${product?.price}.00</div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6">{product?.description}</p>

          {/* Colors */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <span className="text-sm font-medium mr-4">Colours:</span>
              <div className="flex gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedColor === index
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <span className="text-sm font-medium mr-4">Size:</span>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`cursor-pointer px-3 py-1 text-sm border rounded ${
                      selectedSize === size
                        ? "bg-red-500 text-white border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity + Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded h-12 overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-4 hover:bg-gray-100 cursor-pointer text-2xl"
              >
                –
              </button>
              <span className="px-4 py-2 text-xl text-center w-20 border-x">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-4 text-2xl text-center hover:bg-red-700 bg-red-500 text-white cursor-pointer"
              >
                +
              </button>
            </div>

            <button className="bg-red-500 text-white px-8 py-3 cursor-pointer rounded hover:bg-red-600 flex-1">
              Buy Now
            </button>

            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: product?._id,
                    name: product?.name,
                    price: product?.price,
                    image: product?.images[0]?.url,
                    quantity,
                  })
                )
              }
              className="bg-black text-white px-8 py-3 cursor-pointer rounded hover:bg-gray-800 flex-1"
            >
              Add to Cart
            </button>

            <button
              onClick={() => setLiked(!liked)}
              className="p-3 border rounded hover:bg-gray-50 text-2xl text-red-500 transition duration-300"
            >
              {liked ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
          </div>

          {/* Delivery Info */}
          <div className="space-y-4">
            <div className="p-4 border rounded flex items-start gap-3">
              <FaTruckFast className="text-red-500 mt-1 text-2xl" />
              <div>
                <div className="font-medium text-sm mb-1">Free Delivery</div>
                <div className="text-xs text-gray-600 underline">
                  Enter your postal code for Delivery Availability
                </div>
              </div>
            </div>
            <div className="p-4 border rounded flex items-start gap-3">
              <FaArrowsRotate className="text-red-500 mt-1 text-2xl" />
              <div>
                <div className="font-medium text-sm mb-1">Return Delivery</div>
                <div className="text-xs text-gray-600">
                  Free 30 Days Delivery Returns. Details
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items */}
      <div>
        <div className="flex items-center mb-6">
          <div className="w-5 h-8 bg-red-500 rounded mr-3"></div>
          <h2 className="text-lg font-medium text-red-500">Related Items</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {product?.relatedProducts?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
