import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorCourses,
  getPublishedCourse,
  removeLecture,
  togglePulishedCourse,
  deleteCourse,
} from "../Controllers/courseController.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/published-courses").get(getPublishedCourse);
router.route("/").get(isAuthenticated, getCreatorCourses);
router.route("/:courseId").put(isAuthenticated, singleUpload, editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.delete("/delete/:courseId", isAuthenticated, deleteCourse);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.route("/:courseId/lecture/:lectureId").put(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/:courseId").patch(togglePulishedCourse);

export default router;
