import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BannerWithTimer = () => {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-black overflow-hidden shadow-lg px-4 sm:px-10 md:px-12 py-8 sm:py-10 md:py-13 mt-10 max-h-[800px]">

      {/* LEFT SECTION */}
      <div className="flex flex-col items-start text-left gap-4 max-w-xl pl-10">
        <span className="text-red-500 text-sm sm:text-base font-bold uppercase">
          Category
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          Enhance your <br /> Visual Experience
        </h1>

        {/* TIMER */}
        <div className="flex flex-wrap gap-4 text-center text-gray-800 font-semibold text-sm sm:text-base mt-4">
          {["Days", "Hours", "Minutes", "Seconds"].map((label, index) => (
            <div
              key={label}
              className="bg-white w-16 h-16 sm:w-20 sm:h-20 flex flex-col justify-center items-center rounded-full border shadow"
            >
              <span className="text-lg sm:text-xl font-bold">
                {Object.values(timeLeft)[index]}
              </span>
              <span className="text-xs sm:text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/products/Glasses")}
          className="mt-5 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-sm transition-all duration-200 cursor-pointer"
        >
          Shop Now
        </button>
      </div>

      {/* RIGHT IMAGE */}
      <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] 
                        bg-gray-400 rounded-full blur-3xl opacity-50 z-0" />
        <img
          src="https://assets.sunglasshut.com/is/image/LuxotticaRetail/889652341026__001.png?impolicy=SGH_bgtransparent&width=640"
          alt="Music"
          className="rounded-lg h-[380px] sm:h-[200px] w-auto object-cover relative z-10"
        />
      </div>
    </div>
  );
};

export default BannerWithTimer;
