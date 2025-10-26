import { Course } from "../models/courseModel.js";
import { Lecture } from "../models/lectureModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

// create course
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Course title and category are required",
        success: false,
      });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res.status(201).json({
      success: true,
      course,
      message: "Course created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
      success: false,
    });
  }
};

// publish courses
export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl description",
    });
    if (!courses) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get courses",
      success: false,
    });
  }
};

// get created courses
export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId }).populate("lecture");
    if (!courses) {
      return res.status(404).json({
        message: "Courses not found",
        courses: [],
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get courses",
      success: false,
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const file = req.file;
    let course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    let courseThumbnail;
    if (file) {
      const fileUri = getDataUri(file);
      courseThumbnail = await cloudinary.uploader.upload(fileUri);
    }
    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update course",
      success: false,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get course",
      success: false,
    });
  }
};
// delete course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    console.log("Attempting to delete course:", courseId);

    // Find the course first
    const course = await Course.findById(courseId);
    if (!course) {
      console.log("Course not found:", courseId);
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    console.log("Found course:", course.courseTitle);

    // Delete all lectures associated with this course
    const deletedLectures = await Lecture.deleteMany({ course: courseId });
    console.log("Deleted lectures count:", deletedLectures.deletedCount);

    // Delete the course
    await Course.findByIdAndDelete(courseId);
    console.log("Course deleted successfully");

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteCourse:", error);
    console.log("Error name:", error.name);
    console.log("Error message:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message, // إضافة رسالة الخطأ للتصحيح
    });
  }
};

// lecture controllers
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required",
        success: false,
      });
    }

    const lecture = await Lecture.create({ lectureTitle, course: courseId });

    const course = await Course.findById(courseId);

    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(201).json({
      success: true,
      lecture,
      message: "Lecture created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create Lecture!",
      success: false,
    });
  }
};

// getCourseLecture
export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "course not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get Lecture!",
      success: false,
    });
  }
};

// edit lecture
// export const editLecture = async (req, res) => {
//   try {
//     const { lectureTitle, videoInfo, isPreviewFree } = req.body;
//     const { courseId, lectureId } = req.params;
//     const lecture = await Lecture.findById(lectureId).populate("lectures");
//     if (!lecture) {
//       return res.status(404).json({
//         message: "Lecture not Found!",
//         success: false,
//       });
//     }
// lecture update
//     if (lectureTitle) lecture.lectureTitle = lectureTitle;
//     if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
//     if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
//     lecture.isPreviewFree = isPreviewFree;

//     await lecture.save();

//     const course = await Course.findById(courseId);
//     if (course && !course.lectures.includes(lecture._id)) {
//       course.lectures.push(lecture._id);
//       await course.save();
//     }
//     return res.status(200).json({
//       success: true,
//       lecture,
//       message: "Lecture updated successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Failed to edit Lecture!",
//       success: false,
//     });
//   }
// };

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { lectureId } = req.params;

    const updatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      {
        lectureTitle,
        videoUrl: videoInfo?.videoUrl,
        publicId: videoInfo?.publicId,
        isPreviewFree,
      },
      { new: true, runValidators: true } // ✅ إرجاع البيانات المحدثة
    );

    if (!updatedLecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    res.status(200).json({
      success: true,
      lecture: updatedLecture,
      message: "Lecture updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to edit lecture",
    });
  }
};

// remove Lecture
export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
        success: false,
      });
    }
    //remve th lecture refference form the associated course
    await Course.updateOne(
      {
        lectures: lectureId, // find the course that contains the lecture
      },
      {
        $pull: { lectures: lectureId }, // remove the lectures id from the lectures array
      }
    );
    return res.status(200).json({
      success: true,
      message: "lecture deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to remove Lecture!",
      success: false,
    });
  }
};

export const togglePulishedCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; //ture, false
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    course.isPublished = !course.isPublished;
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      success: true,
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};
