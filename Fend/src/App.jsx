import React from "react";
import { Navbar } from "./components/Navbar";
import Admin from "./Pages/Admin/Admin";
import { Home } from "./Pages/Home";
import Courses from "./Pages/Courses";
import { Login } from "./Pages/auth/Login";
import Signup from "./Pages/auth/Signup";
import Footer from "./components/Footer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./Pages/Profile";
import Dashboard from "../src/Pages/Admin/Dashboard";
import Course from "./Pages/Admin/Course";
import CreateCourse from "./Pages/Admin/CreateCourse";
import UpdateCourse from "./Pages/Admin/UpdateCourse";
import CerateLecture from "./Pages/Admin/CerateLecture";
import EditLecture from "./Pages/Admin/EditLecture";
import CourseDetails from "./Pages/CourseDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/courses",
    element: (
      <>
        <Navbar />
        <Courses />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Navbar />
        <Signup />
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <>
        <Navbar />
        <Profile />
      </>
    ),
  },
  {
    path: "/courses/:courseId",
    element: (
      <>
        <Navbar />
        <CourseDetails />
      </>
    ),
  },
  {
    path: "/admin",
    element: (
      <>
        <Navbar />
        <Admin />
      </>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "course",
        element: <Course />,
      },
      {
        path: "course/create",
        element: <CreateCourse />,
      },
      {
        path: "course/:courseId",
        element: <UpdateCourse />,
      },
      {
        path: "course/:courseId/lecture",
        element: <CerateLecture />,
      },
      {
        path: "course/:courseId/lecture/:lectureId",
        element: <EditLecture />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Footer />
    </>
  );
}

export default App;
