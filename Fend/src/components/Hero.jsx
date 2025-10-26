import React from "react";
import { Award, Search, User } from "lucide-react";
import HeroJPG from "../assets/Hero.png";
import CountUp from "react-countup";

const Hero = () => {
  return (
    <div className="bg-slate-800 pt-14">
      <div className="lg:h-[700px] max-w-7xl mx-auto flex md:flex-row flex-col gap-10 items-center">
        {/* Text section */}
        <div className="space-y-7 px-4 md:px-0">
          <h1 className="text-4xl mt-10 md:mt-0 md:text-6xl font-extrabold text-gray-200">
            Herkes için <span className="text-blue-500">1400+</span> <br />
            fazla çevrimiçi kursumuzu keşfedin
          </h1>
          <p className="text-gray-300 text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A, culpa
            illum quia nisi repudiandae! Veritatis mollitia libero delectus
            natus ea.
          </p>
          <div className="inline-flex relative">
            <input
              type="text"
              placeholder="Search Your Course Here..."
              className="bg-gray-200 w-[350px] md:w-[450px] text-gray-800 p-4 pr-32 rounded-l-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-4 flex gap-2 items-center bg-blue-500 hover:bg-blue-600 font-semibold text-white rounded-r-xl text-lg transition-colors duration-200">
              Search
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Image section */}
        <div className="md:h-[700px] flex items-end relative px-4 md:px-0">
          <img
            src={HeroJPG}
            alt="Hero"
            className="w-[700px] shadow-blue-500 drop-shadow-lg"
          />

          {/* Active Students Card */}
          <div className="bg-slate-200 hidden md:flex gap-3 items-center rounded-md absolute top-[35%] right-0 p-3 mt-7">
            <div className="rounded-full bg-blue-400 p-2 text-white">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-bold text-2xl">
                <CountUp end={4500} />+
              </h2>
              <p className="italic text-sm text-gray-600 leading-none">
                Active Students
              </p>
            </div>
          </div>

          {/* Certified Students Card */}
          <div className="bg-slate-200 hidden md:flex gap-3 items-center rounded-md absolute top-[15%] left-0 p-3 mt-22 ml-5">
            <div className="rounded-full bg-blue-400 p-2 text-white">
              <Award size={20} />
            </div>
            <div>
              <h2 className="font-bold text-2xl ">
                <CountUp end={650} />+
              </h2>
              <p className="italic text-sm text-gray-600 leading-none">
                Certified Students
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
