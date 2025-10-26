import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import Button from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import RichTextEditor from "../../components/RichTextEditor";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../redux/courseSlice";
import { Loader2 } from "lucide-react";

const CourseTab = () => {
  const params = useParams();
  const id = params.courseId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { course } = useSelector((store) => store.course);
  const selectCourse = course.find((course) => course?._id === id);
  const [selectedCourse, setSelectedCourse] = useState(selectCourse);
  const [loading, setLoading] = useState(false);
  const [publish, setPublish] = useState(false);

  const getCourseById = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/course/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setSelectedCourse(res.data.course);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourseById();
  });

  const [input, setInput] = useState({
    courseTitle: selectedCourse?.courseTitle,
    subTitle: selectedCourse?.subTitle,
    description: selectedCourse?.description,
    category: selectedCourse?.category,
    courseLevel: selectedCourse?.courseLevel,
    coursePrice: selectedCourse?.coursePrice,
    file: "",
  });

  const [previewThumbnail, setPreviewThumbnail] = useState(
    selectedCourse?.courseThumbnail
  );

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) =>
    setInput({ ...input, courseLevel: value });

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("file", input.courseThumbnail);

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:8000/api/v1/course/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate(`lecture`);
        toast.success(res.data.message);

        const updatedCourses = course.map((c) =>
          c._id === id ? res.data.course : c
        );
        dispatch(setCourse(updatedCourses));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const togglePublishUnpublish = async (action) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/course/${id}`,
        {
          params: {
            action,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setPublish(!publish);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeCourseHandler = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const res = await axios.delete(
        `http://localhost:8000/api/v1/course/delete/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/admin/course");
        toast.success(res.data.message);

        const updatedCourses = course.filter((c) => c._id !== id);
        dispatch(setCourse(updatedCourses));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Full error details:", error);
      console.log("Error response:", error.response);
      console.log("Error message:", error.message);

      if (error.response) {
        toast.error(error.response.data.message || "Failed to delete course");
      } else if (error.request) {
        toast.error("Network error - please check your connection");
      } else {
        toast.error("Failed to delete course");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none bg-gray-200">
      <CardHeader className="flex md:flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make Changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() =>
              togglePublishUnpublish(
                selectedCourse?.isPublished ? "unpublish" : "publish"
              )
            }
            className="bg-gray-800 text-white hover:bg-blue-600"
          >
            {selectedCourse?.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
            onClick={removeCourseHandler}
            disabled={loading}
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Remove Course"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              value={input.courseTitle}
              onChange={changeEventHandler}
              type="text"
              name="courseTitle"
              placeholder="Ex. Full Stack Developer"
              className="m-1 border-none bg-white"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={input.subTitle}
              onChange={changeEventHandler}
              type="text"
              name="subTitle"
              placeholder="Ex. Become a fullstack developer from zero to hero in 2 months"
              className="m-1 border-none bg-white"
            />
          </div>
          <div>
            <Label className="m-2">Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex md:flex-row flex-wrap gap-1 items-center md:gap-5">
            <div>
              <Label className="m-2">Category</Label>
              <Select
                defaultValue={input.category}
                onValueChange={selectCategory}
              >
                <SelectTrigger className="w-[180px] mt-1 border-none bg-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg hover:bg-gray-200">
                  <SelectGroup>
                    <SelectLabel className="text-gray-700 font-semibold px-2 py-2 bg-gray-50 border-b border-gray-200">
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
            <div>
              <Label className="m-2">Course Level</Label>
              <Select
                defaultValue={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px] mt-1 bg-white border-none">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-200 border border-gray-200 rounded-md shadow-lg">
                  <SelectGroup>
                    <SelectLabel className="text-gray-700 font-semibold px-2 py-2 bg-gray-50 border-b border-gray-200">
                      Course level
                    </SelectLabel>
                    <div className="divide-y divide-gray-100 ">
                      <SelectItem
                        value="Beginner"
                        className="py-3 px-2 hover:bg-white "
                      >
                        Beginner
                      </SelectItem>
                      <SelectItem
                        value="Medium"
                        className="py-3 px-2 hover:bg-white"
                      >
                        Medium
                      </SelectItem>
                      <SelectItem
                        value="Advanced"
                        className="py-3 px-2 hover:bg-white"
                      >
                        Advanced
                      </SelectItem>
                    </div>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="m-2">Price in (TRY)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-fit border-none bg-white"
              />
            </div>
          </div>
          <div>
            <Label className="m-2">Course Photo</Label>
            <Input
              type="file"
              id="file"
              onChange={selectThumbnail}
              placeholder="Photo"
              accept="image/*"
              className="w-fit border-none bg-white"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                alt="Thumbnail"
                className="w-64 my-2"
              />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/admin/course/`)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={loading}
              onClick={updateCourseHandler}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
