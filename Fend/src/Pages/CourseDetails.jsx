import { Card, CardContent, CardFooter } from "../components/ui/card";
import { ArrowLeft, PlayCircle, Lock } from "lucide-react";
import Button from "../components/ui/button";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Separator } from "../components/ui/separator";
import ReactPlayer from "react-player";

const CourseDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  const { course } = useSelector((store) => store.course);
  const selectedCourse = course.find((course) => course?._id === courseId);
  const [courseLectures, setCourseLectures] = useState(null);

  useEffect(() => {
    const getCourseLectures = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/course/${courseId}/lecture`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setCourseLectures(res.data.lectures);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCourseLectures();
  }, [courseId]);

  return (
    <div className="bg-gray-200 md:p-10 mt-20">
      <Card className="max-w-7xl rounded-md mx-auto bg-white shadow-md pt-5 mt-14 border-none mb-20">
        {/* Header section */}
        <div className="px-4 py-1">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Button
                size="icon"
                variant="outline"
                className="bg-gray-200 rounded-full border-none cursor-pointer"
                onClick={() => navigate("/")}
              >
                <ArrowLeft size={16} />
              </Button>
              <h1 className="md:text-2xl font-bold text-gray-800">
                {selectedCourse?.courseTitle}
              </h1>
            </div>
            <div className="flex space-x-4">
              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
        {/* course overview section */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <img
              src={selectedCourse?.courseThumbnail}
              alt="thumbnail"
              className="w-full lg:w-1/3 rounded-md mb-4 lg:mb-0"
            />
            <div>
              <p className="text-gray-800 mb-4 font-semibold capitalize">
                {selectedCourse?.subTitle}
              </p>
              <p
                className="mb-4 text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: selectedCourse?.description,
                }}
              ></p>
              <p className="text-gray-800 font-semibold">
                ⭐⭐⭐⭐⭐
                <i className="fa-solid fa-star"></i>(4.8) | 1,200 reviews
              </p>
              <div className="mt-1">
                <p className="text-2xl font-bold text-gray-800">
                  {selectedCourse?.coursePrice}
                </p>
                <p className="text-gray-500 line-through">TRY599</p>
              </div>
              <ul className="mt-4 space-y-2">
                <li className="text-gray-600">✅ 30+ hours of video content</li>
                <li className="text-gray-600">
                  ✅ Lifetime access to course materials
                </li>
                <li className="text-gray-600">✅ Certificate of completion</li>
              </ul>
            </div>
          </div>
        </div>
        {/* course Details section */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            What You'll Learn
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Build dynamic web applications with React and Node.js</li>
            <li>Deploy websites with modern tools like Vercel and Netlify</li>
            <li>Understand REST APIs and database integration</li>
          </ul>
          <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">
            Requirements
          </h2>
          <p className="text-gray-700">
            Basic programming knowledge is helpful but not required.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">
            Who This Course Is For
          </h2>
          <p className="text-gray-700">
            Beginners, aspiring developers, and professionals looking to upgrade
            skills.
          </p>
        </div>
        {/* course lectures section */}
        {courseLectures?.length === 0 ? null : (
          <div className="flex flex-col md:flex-row justify-between gap-10 p-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">
                Course Curriculum
              </h2>
              <p className="text-gray-700 italic my-2">
                {courseLectures?.length} Lectures
              </p>
              <div className="space-y-4">
                {courseLectures?.map((lecture, index) => {
                  return (
                    <div
                      key={lecture._id || index}
                      className="flex items-center gap-3 bg-gray-200 p-4 rounded-md cursor-pointer"
                    >
                      <span>
                        {lecture.isPreviewFree ? (
                          <PlayCircle size={20} />
                        ) : (
                          <Lock size={20} />
                        )}
                      </span>
                      <p>{lecture.lectureTitle}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-full lg:w-1/3">
              <Card>
                <CardContent className="p-4 flex flex-col">
                  <div className="w-full aspect-video mb-4">
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      url={courseLectures ? courseLectures[0]?.videoUrl : null}
                      controls={true}
                    />
                  </div>
                  <h1>
                    {courseLectures
                      ? courseLectures[0]?.lectureTitle
                      : "Lecture Title"}
                  </h1>
                  <Separator className="my-2" />
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Veritatis aliquam enim doloribus sit cumque, velit corporis
                    fuga possimus officia laudantium ratione quasi corrupti
                    quibusdam nostrum repellat sapiente est explicabo maiores.
                  </p>
                </CardContent>
                <CardFooter className="flex p-4">
                  <Button className="bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer">
                    Continue Course
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
        {/* instructor section */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Instructor</h2>
          <div className="flex items-center space-x-4">
            <img
              src={selectedCourse?.creator?.photoUrl}
              alt="Instructor"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {selectedCourse?.creator?.name}
              </h3>
              <p className="text-gray-600">Senior Full-Stack Developer</p>
            </div>
          </div>
          <p className="text-gray-700 mt-4">
            {selectedCourse?.creator?.description}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CourseDetails;
