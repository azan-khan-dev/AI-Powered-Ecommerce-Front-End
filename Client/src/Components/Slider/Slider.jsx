import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1654257650833-b7398115275a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8",
        title: "Up to 10% off Vocher",
        subtitle: "On all Electronics",
        showButton: true,
    },
    {
        id: 2,
        image:
            "https://images.unsplash.com/photo-1556306510-31ca015374b0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Trendy Fashion",
        subtitle: "Discover New Styles",
    },
    {
        id: 3,
        image:
            "https://plus.unsplash.com/premium_photo-1709648420127-7479e53df7e8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Functional Fashion",
        subtitle: "Carry it with style",
    },
    {
        id: 4,
        image:
            "https://images.unsplash.com/photo-1631427984596-5b3412779d0c?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Free Delivery",
        subtitle: "For orders above Rs. 5000",
    },
    {
        id: 5,
        image:
            "https://images.pexels.com/photos/27544587/pexels-photo-27544587.jpeg",
        title: "Latest Gadgets",
        subtitle: "Now in stock",
    },
];

const Slider = () =>
{
    const navigate = useNavigate();

    const [current, setCurrent] = useState(0);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index) =>
    {
        setCurrent(index);
    };

    const handleTouchStart = (e) =>
    {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) =>
    {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () =>
    {
        const threshold = 50;
        if (!touchStartX.current || !touchEndX.current) return;

        const delta = touchStartX.current - touchEndX.current;
        if (delta > threshold)
        {
            setCurrent((prev) => (prev + 1) % slides.length);
        } else if (delta < -threshold)
        {
            setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    return (
        <div
            className="relative w-full h-[250px] sm:h-[370px] overflow-hidden shadow-md"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-start justify-center text-white text-left px-6 sm:px-12">
                        {slide.id === 1 ? (
                            <>
                                <h2 className="text-xl sm:text-4xl md:text-5xl font-bold">
                                    Up to 10%
                                </h2>
                                <h2 className="text-xl sm:text-4xl md:text-5xl font-bold mt-3">
                                    off Voucher
                                </h2>
                            </>
                        ) : (
                            <h2 className="text-xl sm:text-4xl md:text-5xl font-bold">
                                {slide.title}
                            </h2>
                        )}

                        {slide.showButton ? (
                            <button
                                onClick={() => navigate("/products/our-products")}
                                className="group mt-4 flex items-center gap-2 text-sm sm:text-base font-medium border-b-2 border-transparent hover:border-black transition-all duration-300 bg-transparent hover:bg-white text-white hover:text-black cursor-pointer p-3 rounded-lg"
                            >
                                Shop Now
                                <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                            </button>

                        ) : (
                            <p className="text-sm sm:text-base mt-2">{slide.subtitle}</p>
                        )}
                    </div>
                </div>
            ))}

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-4 h-4 sm:w-3 sm:h-3 rounded-full border-2 transition duration-300 cursor-pointer ${index === current
                                ? "bg-orange-500 border-white"
                                : "bg-transparent border-white"
                            }`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Slider;
