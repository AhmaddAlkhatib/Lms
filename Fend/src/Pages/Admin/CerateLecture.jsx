import React, { useEffect, useState } from "react";
import Button from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Edit, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLecture } from "../../redux/lectureSlice";

const CreateLecture = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { lecture } = useSelector((store) => store.lecture);

  const createLectureHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/course/${params?.courseId}/lecture`,
        { lectureTitle, course: params.courseId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setLectureTitle("");
      }
      const lecturesRes = await axios.get(
        `http://localhost:8000/api/v1/course/${params.courseId}/lecture`,
        { withCredentials: true }
      );
      if (lecturesRes.data.success) {
        dispatch(setLecture(lecturesRes.data.lectures));
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLectures = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/course/${params.courseId}/lecture`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setLecture(res.data.lectures));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLectures();
  }, [params.courseId, dispatch]);
  return (
    <div className="p-4 md:p-10 md:pr-20 h-screen">
      <h1 className="text-2xl font-bold mb-2">
        Let's Add <span className="text-blue-600"> Lectures</span>
      </h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio officiis
        optio placeat dolore molestiae adipisci asperiores, voluptatibus tempore
        eos quibusdam aperiam, incidunt recusandae impedit excepturi, quas
        eveniet omnis. Quasi, molestiae!
      </p>
      <div className="mt-10 space-y-5">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Your lecture Name"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            className="bg-white m-1 border-none"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/admin/course/${params.courseId}`)}
            variant="outline"
          >
            Back to course
          </Button>
          <Button
            disabled={loading}
            onClick={createLectureHandler}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
      </div>
      <div className="mt-10">
        {lecture?.map((lecture, index) => {
          return (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md my-2"
            >
              <h1 className="font-bold text-gray-800">
                Lecture - {index + 1}: {lecture.lectureTitle}
              </h1>
              <Edit
                onClick={() => navigate(`${lecture._id}`)}
                size={20}
                className="cursor-pointer text-gray-600 hover:text-blue-600"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreateLecture;
