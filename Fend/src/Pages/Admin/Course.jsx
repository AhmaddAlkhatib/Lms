import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../redux/courseSlice";
import { Badge } from "../../components/ui/badge";
import Button from "../../components/ui/button";
import { Edit } from "lucide-react";

const Course = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { course } = useSelector((store) => store.course);

  useEffect(() => {
    const getCreatorCourse = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/course/", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCourse(res.data.courses));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCreatorCourse();
  }, [dispatch]);

  return (
    <div className="md:p-10 p-4 w-full h-screen">
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
        onClick={() => navigate("create")}
      >
        Create Course
      </Button>
      <Table className="mt-10">
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-white border-none">
            <TableHead className="w-[100px]">Course</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {course?.map((course) => (
            <TableRow key={course?._id} className="hover:bg-white border-none">
              <TableCell className="md:w-[300px] flex items-center gap-2">
                <img
                  src={course?.courseThumbnail}
                  alt="Thumbnail"
                  className="w-25 hidden md:block rounded-sm"
                />
                {course?.courseTitle}
              </TableCell>
              <TableCell className="font-medium text-right">
                {course?.coursePrice || "Free"}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={
                    course?.isPublished
                      ? "bg-green-400 text-white"
                      : "bg-red-400 text-white"
                  }
                >
                  {course?.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  className="cursor-pointer hover:bg-gray-200"
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/admin/course/${course._id}`)}
                >
                  <Edit className="w-4 h-4 " />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Course;
