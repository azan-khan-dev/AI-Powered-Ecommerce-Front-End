import React, { useEffect, useRef, useState } from "react";
import { LuMoveRight, LuMoveLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/Product_card";
import { useDispatch } from "react-redux";
import { setProducts } from "../../Features/Products/productsSlice";
import { useGetFlashSaleProductsQuery } from "../../redux/apis/homeApis";

const FlashSales = () =>
{
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sliderRef = useRef(null);
  const { data: products, isLoading, error } = useGetFlashSaleProductsQuery();

  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  // Countdown Timer
  useEffect(() =>
  {
    const timer = setInterval(() =>
    {
      setTimeLeft((prev) =>
      {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) seconds--;
        else if (minutes > 0)
        {
          minutes--;
          seconds = 59;
        } else if (hours > 0)
        {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0)
        {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Transform API data to match ProductCard format
  const transformedProducts = products?.data?.map(product => ({
    id: product._id,
    image: product.images[0]?.url,
    title: product.name,
    price: product.is_flash_sale ? product.flash_sale_price : product.price,
    originalPrice: product.is_flash_sale ? product.price : undefined,
    rating: 4.5, // Default rating since we don't have this field
    category: product.category,
    description: product.description,
    isFlashSale: product.is_flash_sale,
  })) || [];


  // Slider scroll
  const scrollSlider = (direction) =>
  {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full px-6 py-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative inline-block group cursor-pointer">
            <div className="absolute top-0 left-0 h-full bg-red-500 rounded-sm transition-all duration-500 w-3 group-hover:w-full z-0"></div>
            <h3 className="relative z-10 px-6 py-1 text-red-500 font-semibold transition-colors duration-500 group-hover:text-white">
              Today's
            </h3>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Flash Sales</h2>
        <div className="flex gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="min-w-[280px] animate-pulse">
              <div className="bg-gray-200 h-[250px] rounded-lg"></div>
              <div className="mt-3 space-y-2">
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-6 py-5">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Flash Sales</h2>
        <p className="text-red-500">Failed to load flash sale products</p>
      </div>
    );
  }

  if (!transformedProducts || transformedProducts.length === 0) {
    return (
      <div className="w-full px-6 py-5">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Flash Sales</h2>
        <p className="text-gray-500">No flash sale products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-5">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative inline-block group cursor-pointer">
          <div className="absolute top-0 left-0 h-full bg-red-500 rounded-sm transition-all duration-500 w-3 group-hover:w-full z-0"></div>
          <h3 className="relative z-10 px-6 py-1 text-red-500 font-semibold transition-colors duration-500 group-hover:text-white">
            Today's
          </h3>
        </div>
      </div>

      {/* Title + Timer + Arrows */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-12 flex-wrap">
          <h2 className="text-3xl font-bold text-gray-800 whitespace-nowrap">
            Flash Sales
          </h2>

          {/* Countdown */}
          <div className="flex items-end gap-3">
            {["Days", "Hours", "Minutes", "Seconds"].map((label, index) =>
            {
              const value = [
                timeLeft.days,
                timeLeft.hours,
                timeLeft.minutes,
                timeLeft.seconds,
              ][index];

              return (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="text-3xl font-bold pb-4">
                      {String(value).padStart(2, "0")}
                    </span>
                  </div>
                  {index !== 3 && (
                    <span className="text-3xl font-bold pb-5 text-orange-500">
                      :
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Arrows */}
        <div className="flex gap-3">
          <button
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center transition-all hover:bg-black hover:text-white cursor-pointer"
            onClick={() => scrollSlider("left")}
          >
            <LuMoveLeft size={20} />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center transition-all hover:bg-black hover:text-white cursor-pointer"
            onClick={() => scrollSlider("right")}
          >
            <LuMoveRight size={20} />
          </button>
        </div>
      </div>

      {/* Product Slider */}
      <div className="w-full overflow-x-auto scrollbar-hide" ref={sliderRef}>
        <div className="flex gap-6 min-w-max scroll-smooth">
          {transformedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>


      {/* View All Button */}
      <div className="w-full px-6 py-5">
        {/* View All Button */}
        <div className="w-full flex justify-center mt-6">
          <button
            onClick={() =>
            {
              navigate("/products/flash-sales")
            }}
            className="bg-red-600 text-white px-7 py-3 rounded-sm hover:bg-red-500 transition cursor-pointer mt-5 font-quicksand font-semibold"
          >
            View All Product
          </button>

        </div>
      </div>
    </div>
  );
};

export default FlashSales;
