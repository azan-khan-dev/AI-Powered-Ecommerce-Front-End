import React from "react";
import { Link } from "react-router-dom";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { FaTruckFast } from "react-icons/fa6";
import
{
  FaStore,
  FaDollarSign,
  FaGift,
  FaMoneyBillWave,
} from "react-icons/fa";

function About()
{
  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-35 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-5">
        <Link to="/" className="hover:text-red-500">Home</Link> /{" "}
        <span className="text-gray-900">About</span>
      </div>

      {/* Our Story */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 mt-16">
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-wide mb-4">
            Our Story
          </h1>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-quicksand">
            Launched in 2015, Exclusive is South Asia's premier online shopping
            marketplace with an active presence in Bangladesh. Supported by wide
            range of tailored marketing, data and service solutions, Exclusive
            hosts 10,500 sellers and 300 brands and serves 3 million customers
            across the region.
          </p>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-quicksand">
            Exclusive has more than 1 Million products to offer, growing very
            fast. Exclusive offers a diverse assortment in categories ranging
            from consumer.
          </p>
        </div>
        <div className="md:w-1/2 w-full">
          <img
            src="../../public/fcc89aaa7b85f8c1dcce81e71e2eb178be13bd4d.jpg"
            alt="Shopping"
            className="rounded-md object-cover w-full h-[250px] sm:h-[300px] md:h-[350px]"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-19 mt-10">
        {[
          {
            icon: <FaStore className="text-white text-xl" />,
            count: "10.5k",
            label: "Sellers active on our site",
          },
          {
            icon: <FaDollarSign className="text-white text-xl" />,
            count: "33k",
            label: "Monthly Products Sold",
          },
          {
            icon: <FaGift className="text-white text-xl" />,
            count: "45.5k",
            label: "Customers active on our site",
          }
        ].map((item, index) => (
          <div
            key={index}
            className="border border-gray-400 rounded-md p-4 w-full h-40 flex flex-col items-center space-y-2 text-center
              bg-white text-gray-800 transition duration-300 ease-in-out
              hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black">
                {item.icon}
              </div>
            </div>
            <h2 className="text-3xl font-semibold">{item.count}</h2>
            <p className="text-xs font-semibold">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Free Delivery */}
        <div className="flex flex-col items-center space-y-5">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black">
              <FaTruckFast className="text-white text-xl" />
            </div>
          </div>
          <h3 className="font-bold text-sm md:text-base">FREE AND FAST DELIVERY</h3>
          <p className="text-sm text-gray-600">
            Free delivery for all orders over $140
          </p>
        </div>

        {/* Customer Service */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black">
              <TfiHeadphoneAlt className="text-white text-xl" />
            </div>
          </div>
          <h3 className="font-bold text-sm md:text-base">24/7 CUSTOMER SERVICE</h3>
          <p className="text-sm text-gray-600">
            Friendly 24/7 customer support
          </p>
        </div>

        {/* Money Back */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4M12 21a9 9 0 100-18 9 9 0 000 18z"
                />
              </svg>
            </div>
          </div>
          <h3 className="font-bold text-sm md:text-base">MONEY BACK GUARANTEE</h3>
          <p className="text-sm text-gray-600">
            We return money within 30 days
          </p>
        </div>
      </div>
    </div>
  );
}
export default About;
