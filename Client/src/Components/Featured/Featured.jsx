import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetFeaturedProductsQuery } from "../../redux/apis/homeApis";

const Featured = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetFeaturedProductsQuery();
    const featuredProducts = data?.data || data

    return (
        <div className="w-full px-6 min-h-[800px]">
            <div className="flex items-center gap-2 mb-3">
                <div className="relative inline-block group cursor-pointer">
                    <div className="absolute top-0 left-0 h-full bg-red-500 rounded-sm transition-all duration-500 w-3 group-hover:w-full z-0"></div>
                    <h3 className="relative z-10 px-6 py-1 text-red-500 font-semibold transition-colors duration-500 group-hover:text-white">
                        Featured
                    </h3>
                </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
                <h2 className="text-3xl font-bold text-gray-800 whitespace-nowrap">
                    New Arrival
                </h2>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="min-h-[550px] bg-gray-200 animate-pulse rounded-lg"></div>
                    <div className="grid grid-rows-2 gap-4 h-full">
                        <div className="min-h-[200px] bg-gray-200 animate-pulse rounded-lg"></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="min-h-[150px] bg-gray-200 animate-pulse rounded-lg"></div>
                            <div className="min-h-[150px] bg-gray-200 animate-pulse rounded-lg"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Large Box - Dynamic */}
                    {featuredProducts && featuredProducts[0] ? (
                        <div className="relative overflow-hidden min-h-[550px] flex items-end bg-black">
                            <img
                                src={featuredProducts[0]?.images[0]?.url || "public/PS5.png"}
                                alt={featuredProducts[0]?.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-opacity-50" />
                            <div className="relative z-10 p-8 w-full">
                                <h2 className="text-2xl font-bold text-white mb-2">{featuredProducts[0].name}</h2>
                                <p className="text-white text-sm">{featuredProducts[0].description.substring(0, 50)}...</p>
                                <button
                                    onClick={() => navigate(`/product/${featuredProducts[0]._id}`)}
                                    className="mt-3 relative text-white px-1 py-2 group cursor-pointer"
                                >
                                    Shop Now
                                    <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden min-h-[550px] flex items-end bg-black">
                            <img src="public/PS5.png" alt="PlayStation 5" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-opacity-50" />
                            <div className="relative z-10 p-8 w-full">
                                <h2 className="text-2xl font-bold text-white mb-2">PlayStation 5</h2>
                                <p className="text-white text-sm">Black and White Version of PS5 <br /> coming out on Sale</p>
                                <button
                                    onClick={() => navigate("/products/PS5")}
                                    className="mt-3 relative text-white px-1 py-2 group cursor-pointer"
                                >
                                    Shop Now
                                    <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Right Section */}
                    <div className="grid grid-rows-2 gap-4 h-full">
                        {/* Top Box */}
                        {featuredProducts && featuredProducts[1] ? (
                            <div className="relative overflow-hidden min-h-[200px] flex items-end">
                                <img
                                    src={featuredProducts[1].images[0]?.url || "public/women.png"}
                                    alt={featuredProducts[1].name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-opacity-50" />
                                <div className="relative z-10 p-7 w-full">
                                    <h3 className="text-2xl font-semibold text-white">{featuredProducts[1].name}</h3>
                                    <p className="text-sm text-white mt-1">{featuredProducts[1].description.substring(0, 60)}...</p>
                                    <button
                                        onClick={() => navigate(`/product/${featuredProducts[1]._id}`)}
                                        className="mt-2 relative text-white px-1 py-2 group cursor-pointer"
                                    >
                                        Shop Now
                                        <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative overflow-hidden min-h-[200px] flex items-end">
                                <img src="public/women.png" alt="Women's Collection" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-opacity-50" />
                                <div className="relative z-10 p-7 w-full">
                                    <h3 className="text-2xl font-semibold text-white">Women's Collection</h3>
                                    <p className="text-sm text-white mt-1">Featured woman collections that <br /> give you another vibe.</p>
                                    <button
                                        onClick={() => navigate("/products/Women")}
                                        className="mt-2 relative text-white px-1 py-2 group cursor-pointer"
                                    >
                                        Shop Now
                                        <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Bottom Two Boxes */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Box 1 */}
                            {featuredProducts && featuredProducts[2] ? (
                                <div className="relative bg-black overflow-hidden min-h-[150px] flex items-end group">
                                    <img
                                        src={featuredProducts[2].images[0]?.url || "Public/e5659d572977438364a41d7e8c9d1e9a794d43ed.png"}
                                        alt={featuredProducts[2].name}
                                        className="absolute inset-0 w-full h-full object-contain scale-90 object-left"
                                    />
                                    <div className="absolute inset-0 bg-opacity-50" />
                                    <div className="relative z-10 p-7 w-full">
                                        <h4 className="text-2xl font-medium text-white">{featuredProducts[2].name}</h4>
                                        <p className="text-sm text-white mt-1">${featuredProducts[2].price}</p>
                                        <button
                                            onClick={() => navigate(`/product/${featuredProducts[2]._id}`)}
                                            className="mt-1 relative text-white px-1 py-2 group cursor-pointer"
                                        >
                                            Shop Now
                                            <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative bg-black overflow-hidden min-h-[150px] flex items-end group">
                                    <img src="https://img.freepik.com/premium-photo/glasses-isolated-black-background_496782-1142.jpg" alt="Speakers"
                                        className="absolute inset-0 w-full h-full object-contain scale-90 object-left" />
                                    <div className="absolute inset-0 bg-opacity-50" />
                                    <div className="relative z-10 p-7 w-full">
                                        <h4 className="text-2xl font-medium text-white">Speakers</h4>
                                        <p className="text-sm text-white mt-1">Amazon wireless speakers</p>
                                        <button
                                            onClick={() => navigate("/products/Speakers")}
                                            className="mt-1 relative text-white px-1 py-2 group cursor-pointer"
                                        >
                                            Shop Now
                                            <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Box 2 */}
                            {featuredProducts && featuredProducts[3] ? (
                                <div className="relative bg-black overflow-hidden min-h-[150px] flex items-end group">
                                    <img
                                        src={featuredProducts[3].images[0]?.url || "Public/15315cd15102562cf220504d288fa568eaa816dd.png"}
                                        alt={featuredProducts[3].name}
                                        className="absolute inset-0 w-full h-full object-contain scale-90 object-left"
                                    />
                                    <div className="absolute inset-0 bg-opacity-50" />
                                    <div className="relative z-10 p-7 w-full">
                                        <h4 className="text-2xl font-medium text-white">{featuredProducts[3].name}</h4>
                                        <p className="text-sm text-white mt-1">${featuredProducts[3].price}</p>
                                        <button
                                            onClick={() => navigate(`/product/${featuredProducts[3]._id}`)}
                                            className="mt-1 relative text-white px-1 py-2 group cursor-pointer"
                                        >
                                            Shop Now
                                            <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative bg-black overflow-hidden min-h-[150px] flex items-end group">
                                    <img src="https://st3.depositphotos.com/12982378/35701/i/450/depositphotos_357010326-stock-photo-close-glasses-black-copy-space.jpg" alt="Perfume"
                                        className="absolute inset-0 w-full h-full object-contain scale-90 object-left" />
                                    <div className="absolute inset-0 bg-opacity-50" />
                                    <div className="relative z-10 p-7 w-full">
                                        <h4 className="text-2xl font-medium text-white">Glasses</h4>
                                        <p className="text-sm text-white mt-1">Best Glasses for your eyes</p>
                                        <button
                                            onClick={() => navigate("/products/Glasses")}
                                            className="mt-1 relative text-white px-1 py-2 group cursor-pointer"
                                        >
                                            Shop Now
                                            <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Featured;
