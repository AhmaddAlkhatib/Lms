import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import Button from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/authSlice";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        navigate("/");
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-16">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please login to your account
        </p>

        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email" className="m-2">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={input.email}
            onChange={handleChange}
            placeholder="Enter Your Email"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label htmlFor="password" className="m-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={input.password}
            onChange={handleChange}
            placeholder="Enter Your Password"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Login
        </Button>
        {/* divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <p className="text-center mt-4">
          Don't have an account?
          <Link to="/signup" className="text-blue-500 m-1 hover:underline ">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
