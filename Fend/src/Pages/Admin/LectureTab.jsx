import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import Button from "../../components/ui/button";
import React, { useState } from "react";
import { Switch } from "../../components/ui/switch";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setLecture } from "../../redux/lectureSlice";
import { Loader2 } from "lucide-react";
import { Progress } from "../../components/ui/progress";

const LectureTab = () => {
  const params = useParams();
  const { courseId, lectureId } = params;
  const { lecture } = useSelector((store) => store.lecture);
  const selectedLecture = lecture.find((lecture) => lecture._id === lectureId);
  const [lectureTitle, setLectureTitle] = useState(
    selectedLecture?.lectureTitle
  );
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(selectedLecture?.isPreviewFree);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(
          "http://localhost:8000/api/v1/media/upload-video",
          formData,
          {
            onUploadProgress: ({ loaded, total }) => {
              setUploadProgress(Math.round(loaded * 100) / total);
            },
          }
        );
        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  // const editLectureHandler = async (e) => {
  //   e.preventDefault();
  //   const data = {
  //     lectureTitle,
  //     videoInfo: uploadVideoInfo,
  //     isPreviewFree: isFree,
  //   };
  //   try {
  //     setLoading(true);
  //     const res = await axios.post(
  //       `http://localhost:8000/api/v1/course/${courseId}/lecture/${lectureId}`,
  //       data,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true,
  //       }
  //     );
  //     if (res.data.success) {
  //       dispatch([...lecture, setLecture(res.data.lecture)]);
  //       toast.success(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to edit lecture");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const editLectureHandler = async (e) => {
    e.preventDefault();

    // ✅ تحقق من وجود تغييرات
    if (!lectureTitle.trim()) {
      toast.error("Please enter a lecture title");
      return;
    }

    const data = {
      lectureTitle: lectureTitle.trim(),
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
    };

    try {
      setLoading(true);

      // ✅ استخدام PUT بدلاً من POST للتحديث
      const res = await axios.put(
        `http://localhost:8000/api/v1/course/${courseId}/lecture/${lectureId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        // ✅ تصحيح الـ dispatch
        const updatedLectures = lecture.map((lect) =>
          lect._id === lectureId ? res.data.lecture : lect
        );
        dispatch(setLecture(updatedLectures));

        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to update lecture");
      }
    } catch (error) {
      console.log("Edit lecture error:", error);

      // ✅ معالجة أفضل للأخطاء
      if (error.response) {
        toast.error(error.response.data.message || "Server error occurred");
      } else if (error.request) {
        toast.error("Network error - please check your connection");
      } else {
        toast.error("Failed to edit lecture");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeLectureHandler = async (e) => {
    e.preventDefault();
    try {
      setRemoveLoading(true);
      const res = await axios.delete(
        `http://localhost:8000/api/v1/course/lecture/${lectureId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        navigate(`/admin/course/${courseId}/lecture`);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete lecture");
    } finally {
      setRemoveLoading(false);
    }
  };
  return (
    <Card className="border-none bg-gray-200">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={removeLoading}
            onClick={removeLectureHandler}
            className="bg-red-500 text-white hover:bg-red-600"
            variant="destructive"
          >
            {removeLoading ? (
              <>
                <Loader2 className="mr-1 w-4 h-4 animate-spin" /> Please wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="m-1">
          <Label className="m-1">Title</Label>
          <Input
            type="text"
            placeholder="Ex. Introduction to javascript"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            className="bg-white border-none"
          />
        </div>
        <div className="m-1">
          <Label className="m-1">
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            className="w-fit bg-white border-none"
            onChange={fileChangeHandler}
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch
            checked={isFree}
            onCheckedChange={setIsFree}
            className="data-[state=checked]:bg-blue-500 border-solid-1 bg-white"
          />
          <Label>Is this video FREE</Label>
        </div>
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} className="w-full bg-blue-400" />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}
        <div className="mt-4">
          <Button
            disabled={loading}
            onClick={editLectureHandler}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
