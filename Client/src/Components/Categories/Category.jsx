import React from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineVisibility } from "react-icons/md";
import { GiSunglasses } from "react-icons/gi";
import { FaRegEye, FaBaby } from "react-icons/fa";
import { IoMdFootball, IoMdGlasses } from "react-icons/io";

const categories = [
  { id: 1, name: "Sunglasses", icon: <GiSunglasses size={36} /> },
  { id: 2, name: "Prescription", icon: <IoMdGlasses size={36} /> },
  { id: 3, name: "Reading", icon: <MdOutlineVisibility size={36} /> },
  { id: 4, name: "Contact Lenses", icon: <FaRegEye size={36} /> },
  { id: 5, name: "Kids Glasses", icon: <FaBaby size={36} /> },
  { id: 6, name: "Sports", icon: <IoMdFootball size={36} /> },
];

export { categories };

const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (name) => {
    const formattedName = name.toLowerCase();
    navigate(`/products/${formattedName}`);
  };

  return (
    <div className="w-full px-6">
      {/* Title Section */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative inline-block group cursor-pointer">
          <div className="absolute top-0 left-0 h-full bg-red-500 rounded-sm transition-all duration-500 w-3 group-hover:w-full z-0"></div>
          <h3 className="relative z-10 px-6 py-1 text-red-500 font-semibold transition-colors duration-500 group-hover:text-white">
            Categories
          </h3>
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-800 whitespace-nowrap">
        Browse By Category
      </h2>

      {/* Category Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mt-10">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-sm border h-35 border-gray-400 cursor-pointer transition-all duration-300 hover:bg-red-500 group"
          >
            <div className="mb-2 text-gray-800 group-hover:text-white">{cat.icon}</div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-white">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
      <hr  className="mt-17 mb-10 border-t-2 border-gray-300 "/>
    </div>
  );
};

export default CategoryGrid;
