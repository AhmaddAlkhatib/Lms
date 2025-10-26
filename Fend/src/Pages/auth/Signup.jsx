import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import Button from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { RadioGroup } from "../../components/ui/radio-group";
import axios from "axios";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(), console.log(user);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        user,
        {
          headers: {
            "Contect-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        navigate("/login");
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
          Create Your Account
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join us today! It's quick and easy
        </p>

        {/* Name Input */}
        <div className="mb-4">
          <Label htmlFor="name" className="m-2">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter Your Name"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email" className="m-2">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter Your Email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label htmlFor="password" className="m-2">
            Password
          </Label>
          <Input
            type="password"
            placeholder="Enter Your Password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </div>

        {/* Role */}
        <div className="mb-6">
          <Label className="m-2">Role</Label>
          <RadioGroup className="flex gap-4 mt-2 peer">
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                id="role1"
                name="role"
                value="student"
                checked={user.role === "student"}
                onChange={handleChange}
              ></Input>
              <Label htmlFor="role1" className="cursor-pointer">
                Student
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                id="role2"
                name="role"
                value="instructor"
                checked={user.role === "instructor"}
                onChange={handleChange}
              ></Input>
              <Label htmlFor="role2" className="cursor-pointer">
                Instructor
              </Label>
            </div>
          </RadioGroup>
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Sign Up
        </Button>

        <p className="text-center mt-4 text-gray-600">
          Already Have an Account?
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-600 m-1 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
