import React from "react";
import { GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Button from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../redux/authSlice";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/");
        dispatch(setUser(null));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.respone.data.message);
    }
  };
  return (
    <div className="bg-gray-900 z-50 w-full py-3 fixed top-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo section */}
        <Link to="/">
          <div className="flex gap-2 items-center">
            <GraduationCap className="text-gray-300 w-10 h-10" />
            <h1 className="text-gray-300 text-2xl font-bold">
              NextStep Academy
            </h1>
          </div>
        </Link>

        {/* Menu section */}
        <nav>
          <ul className="flex gap-6 text-lg items-center font-semibold text-white">
            <li>
              <Link
                to="/"
                className="cursor-pointer hover:text-gray-300 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className="cursor-pointer hover:text-gray-300 transition"
              >
                Courses
              </Link>
            </li>

            {!user ? (
              <div className="flex gap-3">
                <Link to="/login">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {user.role === "instructor" && (
                  <Link to="/admin/dashboard">
                    <li className="cursor-pointer">Admin</li>
                  </Link>
                )}
                <Link to="/profile">
                  <Avatar>
                    <AvatarImage src={user.photoUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <Button
                  onClick={logoutHandler}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Logout
                </Button>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};
