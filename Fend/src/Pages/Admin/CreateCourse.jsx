import { Loader2 } from "lucide-react";
import Button from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createCourseHandler = async () => {
    if (!courseTitle || !category) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/course/",
        { courseTitle, category },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/admin/course");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 md:pr-20 h-screen">
      <h1 className="text-2xl font-bold">
        Let's Add <span className="text-blue-500">Courses</span>
      </h1>
      <p className="text-gray-600 mt-2">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae
        eligendi laudantium minima aut quas repellendus explicabo eaque ipsa
        perferendis hic delectus perspiciatis, amet ducimus facere eius fuga.
        Esse, dolorem quo?
      </p>
      <div className="mt-10">
        <div>
          <Label>Title</Label>
          <Input
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            type="text"
            placeholder="Your Course Name"
            className="bg-white mt-1 border-none"
          />
        </div>
        <div className="mt-4 mb-5">
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-white mt-1 border-none">
              <SelectValue placeholder="Select a category " />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg hover:bg-gray-200">
              <SelectGroup>
                <SelectLabel className="text-gray-700 font-semibold px-2 py-2 bg-gray-50 border-b border-gray-200 ">
                  Category
                </SelectLabel>
                <div className="divide-y divide-gray-100">
                  <SelectItem
                    value="Next JS"
                    className="py-3 px-2 hover:bg-gray-50"
                  >
                    Next JS
                  </SelectItem>
                  <SelectItem
                    value="Data Science"
                    className="py-3 px-2 hover:bg-gray-50"
                  >
                    Data Science
                  </SelectItem>
                  <SelectItem
                    value="Frontend Development"
                    className="py-3 px-2 hover:bg-gray-50"
                  >
                    Frontend Development
                  </SelectItem>
                  <SelectItem
                    value="Backend Development"
                    className="py-3 px-2 hover:bg-gray-50"
                  >
                    Backend Development
                  </SelectItem>
                  <SelectItem
                    value="Mern Stack Development"
                    className="py-3 px-2 hover:bg-gray-50"
                  >
                    Mern Stack Development
                  </SelectItem>
                  <SelectItem
                    value="Javascript"
                    className="py-3 px-2 hover:bg-gray-50"
                  >
                    Javascript
                  </SelectItem>
                  <SelectItem
                    value="Python"
                    className="py-3 px-2 hover:bg-gray-50"
                  >
                    Python
                  </SelectItem>
                  <SelectItem
                    value="Docker"
                    className="py-3 px-2 hover:bg-gray-50"
                  >
                    Docker
                  </SelectItem>
                  <SelectItem
                    value="MongoDB"
                    className="py-3 px-2 hover:bg-gray-50"
                  >
                    MongoDB
                  </SelectItem>
                </div>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            className="hover:bg-white"
            onClick={() => navigate("/admin/course")}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            disabled={loading}
            onClick={createCourseHandler}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Please Wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
