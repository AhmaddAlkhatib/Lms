import React from "react";
import { ChartColumnBig, FolderPlus } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-700 w-80 h-screen hidden md:block sticky top-0">
      {" "}
      <div className="text-center pt-10 px-3 space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `text-xl text-gray-300 ${
              isActive ? "bg-gray-900" : "bg-transparent"
            } flex items-center gap-2 font-semibold cursor-pointer p-3 rounded-lg w-full hover:bg-gray-600 transition duration-200`
          }
        >
          <ChartColumnBig className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin/course"
          className={({ isActive }) =>
            `text-xl text-gray-300 ${
              isActive ? "bg-gray-900" : "bg-transparent"
            } flex items-center gap-2 font-semibold cursor-pointer p-3 rounded-lg w-full hover:bg-gray-600 transition duration-200`
          }
        >
          <FolderPlus className="w-5 h-5" /> {/* ✅ أضف حجم للأيقونة */}
          <span>Course</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
