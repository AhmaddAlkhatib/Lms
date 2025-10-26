import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/button";
import CourseTab from "./CourseTab";

const UpdateCourse = () => {
  return (
    <div className="md:p-10 p-4 bg-white">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          Add detail informatin regardin course
        </h1>
        <Link to="lecture">
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            Go to lecture page
          </Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
};

export default UpdateCourse;
