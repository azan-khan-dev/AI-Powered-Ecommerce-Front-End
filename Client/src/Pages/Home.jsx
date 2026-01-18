import React from "react";
import Sidebar from "../Components/SideBar/Sidebar";
import Slider from "../Components/Slider/Slider";
import FlashSlider from "../Components/Todays/Flash";
import CategoryGrid from "../Components/Categories/Category";
import BestSelling from "../Components/Best_selling/Best_selling";
import BannerWithTimer from "../Components/Banner/Banner";
import Our_products from "../Components/OurProducts/Our_products";
import Featured from "../Components/Featured/Featured";
import Others from "../Components/Others/Others";
import VirtualTryOnButton from "../Components/VirtualTryOnButton";

const Home = () => {

  return (

    <div className="flex flex-col items-center w-full ">
      {/* Virtual Try-On Floating Button */}
      <VirtualTryOnButton />

      {/* Slider: Full width */}
      <div className="sm:w-[85%] mt-9">
        <Slider />
      </div>

      {/* FlashSlider: Full width below */}
      <div className=" sm:w-[85%] w-full mt-19">
        <FlashSlider />
      </div>
      <div className=" sm:w-[85%] w-full mt-10">
        <CategoryGrid />
      </div>
      <div className=" sm:w-[85%] w-full mt-7">
        <BestSelling />
      </div>
      <div className=" sm:w-[85%] w-full mt-10">
        <BannerWithTimer />
      </div>
      <div className=" sm:w-[85%] w-full mt-10">
        <Our_products />
      </div>
      <div className=" sm:w-[85%] w-full mt-10">
        <Featured />
      </div>
      <div className=" sm:w-[85%] w-full mt-1">
        <Others />
      </div>
    </div>
  );
};

export default Home;
