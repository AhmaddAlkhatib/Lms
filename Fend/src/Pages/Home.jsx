import React from "react";
import Hero from "../components/Hero";
import CourseCard from "../components/CourseCard";
import { useSelector } from "react-redux";

export const Home = () => {
  const { course } = useSelector((store) => store.course);
  return (
    <div>
      <Hero />
      <div className="py-10 bg-gray-200">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-4">
          Our Courses
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Explore our curated courses to boost your skills and career. Whether
          you're a beginner or an expert, we have something for everyone.
        </p>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {course?.slice(0, 6).map((course) => (
            <CourseCard course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};
